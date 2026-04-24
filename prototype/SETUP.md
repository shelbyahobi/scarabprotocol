# SCARAB Bokashi Prototype Setup Guide

This guide covers setting up the SCARAB Bokashi Smart Kit prototype from scratch. It assumes no prior embedded programming knowledge.

## 1. Hardware Wiring Diagram

Connect the components to the ESP32-WROOM-32 as follows:

*   **DS18B20 (Temperature)**:
    *   VCC (Red) ➔ 3.3V
    *   GND (Black) ➔ GND
    *   DATA (Yellow/White) ➔ GPIO4
    *   *Note: Place a 4.7kΩ resistor between VCC and DATA.*
*   **HX711 (Load Cell)**:
    *   VCC ➔ 3.3V
    *   GND ➔ GND
    *   DT / DOUT ➔ GPIO16
    *   SCK ➔ GPIO17
*   **SCD41 (CO₂ Sensor)**:
    *   VCC ➔ 3.3V
    *   GND ➔ GND
    *   SDA ➔ GPIO21
    *   SCL ➔ GPIO22
*   **Reed Switch (Lid Detection)**:
    *   Pin 1 ➔ GND
    *   Pin 2 ➔ GPIO5
*   **Float Switch (Leachate Detection)**:
    *   Pin 1 ➔ GND
    *   Pin 2 ➔ GPIO18

## 2. Flashing the ESP32 Firmware

### Step 2.1: Install Arduino IDE and ESP32 Board
1. Download and install the [Arduino IDE](https://www.arduino.cc/en/software).
2. Open Arduino IDE. Go to **File > Preferences**.
3. In "Additional Boards Manager URLs", paste: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
4. Go to **Tools > Board > Boards Manager**, search for `esp32` and install the package by Espressif Systems.
5. Go to **Tools > Board** and select **DOIT ESP32 DEVKIT V1** (or your specific ESP32 model).

### Step 2.2: Install Required Libraries
Go to **Sketch > Include Library > Manage Libraries**. Search for and install the EXACT following libraries:
*   `OneWire` by Paul Stoffregen
*   `DallasTemperature` by Miles Burton
*   `HX711 Arduino Library` by Bogdan Necula
*   `SparkFun SCD4x Arduino Library` by SparkFun Electronics
*   `ArduinoJson` by Benoit Blanchon

### Step 2.3: Configure and Flash
1. Open `firmware/bokashi_prototype/bokashi_prototype.ino` in Arduino IDE.
2. The `config.h` file will open in a second tab. Update the `WIFI_SSID` and `WIFI_PASSWORD` with your local network details.
3. Set `RASPBERRY_PI_IP` to the local IP address of your Raspberry Pi (e.g., `192.168.1.100`).
4. Connect the ESP32 via USB. Select the correct Port in **Tools > Port**.
5. Click the **Upload** (right arrow) button.

### Step 2.4: Calibrate the Load Cell
1. After flashing, open the **Serial Monitor** (magnifying glass icon in top right). Set the baud rate to `115200`.
2. Place a known weight (e.g., exactly 1kg) on the scale.
3. Observe the output weight. If it reads 2.5kg instead of 1kg, you must adjust the `HX711_CALIBRATION_FACTOR` in `config.h`. 
4. Calculate the new factor: `Current Factor / Output Weight = New Factor`. Flash again until 1kg reads correctly.

## 3. Setting Up the Raspberry Pi Oracle

### Step 3.1: Install Node.js and Redis
Log into your Raspberry Pi and run:
```bash
# Update packages
sudo apt update

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Install Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 3.2: Install Dependencies
Navigate to the `prototype/oracle` directory on the Pi:
```bash
cd prototype/oracle
npm install express ioredis ethers dotenv cors
```

### Step 3.3: Set Up BSC Testnet Wallet
1. Create a new wallet in MetaMask.
2. Go to the [BNB Smart Chain Testnet Faucet](https://testnet.binance.org/faucet-smart) and request test BNB.
3. Export the private key from MetaMask.
4. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
5. Edit `.env` and paste your private key: `ORACLE_PRIVATE_KEY=0xYourPrivateKeyHere`.

### Step 3.4: Run the Server
Start the oracle server:
```bash
node server.js
```
The server will now listen for the ESP32 telemetry on port 3001.

## 4. Running the VC Demo

1. Ensure the ESP32 is powered on (the onboard blue LED should be solid).
2. Ensure the `server.js` script is running on the Raspberry Pi.
3. Open a browser on any laptop connected to the same WiFi network and go to:
   `http://<RASPBERRY_PI_IP>:3001/dashboard`
4. The dashboard will load and show "Online".
5. Add some weight to the bucket (simulate putting waste in). Wait 1-2 seconds.
6. The dashboard will automatically update, showing the new weight, quality score, and the live Binance Smart Chain Testnet transaction hash!
7. Click the transaction hash to view the immutable record on BSCScan.
