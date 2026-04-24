#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <HX711.h>
#include <Wire.h>
#include <SparkFun_SCD4x_Arduino_Library.h>
#include <ArduinoJson.h>
#include "mbedtls/sha256.h"
#include "config.h"

/*
 * REQUIRED ARDUINO LIBRARIES (Install via Library Manager):
 * 1. "OneWire" by Paul Stoffregen
 * 2. "DallasTemperature" by Miles Burton
 * 3. "HX711 Arduino Library" by Bogdan Necula
 * 4. "SparkFun SCD4x Arduino Library" by SparkFun Electronics
 * 5. "ArduinoJson" by Benoit Blanchon
 */

#define ONE_WIRE_BUS 4
#define HX711_DOUT 16
#define HX711_SCK 17
#define REED_SWITCH 5
#define FLOAT_SWITCH 18
#define LED_PIN 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
HX711 scale;
SCD4x mySensor;

unsigned long lastTelemetryTime = 0;
bool lastLidState = false; // true = open
float lastWeight = 0;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(REED_SWITCH, INPUT_PULLUP);
  pinMode(FLOAT_SWITCH, INPUT_PULLUP);
  
  // Blink 3 times on boot
  for(int i=0; i<3; i++) {
    digitalWrite(LED_PIN, HIGH); delay(200);
    digitalWrite(LED_PIN, LOW); delay(200);
  }
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  digitalWrite(LED_PIN, HIGH); // Solid LED = WiFi connected

  sensors.begin();
  
  scale.begin(HX711_DOUT, HX711_SCK);
  scale.set_scale(HX711_CALIBRATION_FACTOR);
  scale.tare(); // Calibrate tare weight
  
  Wire.begin(21, 22);
  if (mySensor.begin() == false) {
    Serial.println("SCD41 not found");
  }
}

String getSHA256(String payload) {
  unsigned char hash[32];
  mbedtls_sha256_context ctx;
  mbedtls_sha256_init(&ctx);
  mbedtls_sha256_starts(&ctx, 0); // 0 means SHA-256
  mbedtls_sha256_update(&ctx, (const unsigned char *)payload.c_str(), payload.length());
  mbedtls_sha256_finish(&ctx, hash);
  mbedtls_sha256_free(&ctx);
  
  String hashStr = "";
  for(int i=0; i<32; i++) {
    char hex[3];
    sprintf(hex, "%02x", hash[i]);
    hashStr += hex;
  }
  return hashStr;
}

void sendTelemetry(String eventType, float weightDelta) {
  // Slow blink = sending data
  digitalWrite(LED_PIN, LOW);
  
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  
  float weightKg = scale.get_units(10);
  if (weightKg < 0) weightKg = 0.0;
  
  uint16_t co2 = 400; // atmospheric baseline
  if (mySensor.readMeasurement()) {
    co2 = mySensor.getCO2();
  }
  
  bool lidOpen = digitalRead(REED_SWITCH) == HIGH;
  bool leachateFull = digitalRead(FLOAT_SWITCH) == LOW;

  StaticJsonDocument<512> doc;
  doc["device_id"] = DEVICE_ID;
  doc["timestamp"] = 0; // Handled by server/oracle
  doc["weight_kg"] = weightKg;
  doc["temp_c"] = tempC;
  doc["co2_ppm"] = co2;
  doc["lid_open"] = lidOpen;
  doc["lid_open_seconds"] = 0;
  doc["leachate_full"] = leachateFull;
  doc["weight_delta_kg"] = weightDelta;
  doc["event_type"] = eventType;
  
  String payload;
  serializeJson(doc, payload);
  
  // Sign the payload (Prototype simulates ATECC608A using ESP32 SHA-256)
  String sig = getSHA256(payload);
  doc["sig"] = sig;
  
  String finalPayload;
  serializeJson(doc, finalPayload);
  
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://" + String(RASPBERRY_PI_IP) + ":3001/api/telemetry";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(finalPayload);
    if (httpResponseCode > 0) {
      Serial.println("Success! Sent: " + finalPayload);
      digitalWrite(LED_PIN, HIGH); // Back to solid
    } else {
      Serial.println("Error sending POST");
      // Fast blink error
      for(int i=0; i<5; i++) {
        digitalWrite(LED_PIN, HIGH); delay(100);
        digitalWrite(LED_PIN, LOW); delay(100);
      }
      digitalWrite(LED_PIN, HIGH);
    }
    http.end();
  } else {
    // Fast blink error - no wifi
    for(int i=0; i<5; i++) {
      digitalWrite(LED_PIN, HIGH); delay(100);
      digitalWrite(LED_PIN, LOW); delay(100);
    }
  }
}

void loop() {
  bool currentLidState = digitalRead(REED_SWITCH) == HIGH;
  bool leachateFull = digitalRead(FLOAT_SWITCH) == LOW;
  
  float currentWeight = scale.get_units(5);
  if(currentWeight < 0) currentWeight = 0;
  
  // Event: Lid Opens
  if (currentLidState == true && lastLidState == false) {
    lastWeight = currentWeight;
    sendTelemetry("lid_open", 0.0);
    lastLidState = true;
    delay(1000); // Debounce
  }
  
  // Event: Lid Closes (Calculate weight delta)
  if (currentLidState == false && lastLidState == true) {
    float weightDelta = currentWeight - lastWeight;
    if(weightDelta < 0) weightDelta = 0;
    sendTelemetry("lid_close", weightDelta);
    lastLidState = false;
    delay(1000); // Debounce
  }
  
  // Event: Leachate trigger
  static bool lastLeachateState = false;
  if (leachateFull == true && lastLeachateState == false) {
    sendTelemetry("leachate_alert", 0.0);
    lastLeachateState = true;
  } else if (leachateFull == false) {
    lastLeachateState = false;
  }
  
  // Heartbeat Telemetry: Every 60 seconds
  if (millis() - lastTelemetryTime > 60000) {
    sendTelemetry("telemetry", 0.0);
    lastTelemetryTime = millis();
  }
  
  delay(100);
}
