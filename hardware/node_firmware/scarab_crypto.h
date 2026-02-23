#include "esphome.h"
#include <string>

// A mock C++ function to simulate the ATECC608A secure element interface.
// In reality, doing ECDSA secp256k1 signing directly on ESP32 requires the 
// hardware chip via I2C or heavy mbedtls cryptographic imports. 
// For this SITL (Software-in-the-Loop) simulation, we generate a JSON payload 
// representing the exact data structure the physical node would sign.

std::string generate_payload(float wattage) {
    if (isnan(wattage)) {
        return "{\"status\":\"WAITING_FOR_DATA\"}";
    }
    
    // Construct the payload JSON. In the real hardware, the ATECC608A will 
    // compute the SHA256 hash of this exact string and sign it.
    char buffer[256];
    sprintf(buffer, "{\"device_id\":\"MOCK_ESP32_01\",\"type\":\"SOLAR\",\"power_w\":%.2f,\"timestamp_ms\":1771800000000}", wattage);
    
    return std::string(buffer);
}
