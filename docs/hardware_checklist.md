# SCARAB hardware prototyping & Firmware Validation

**INTERNAL RESTRICTED DOCUMENT**
*Contains prototyping supply chain details and firmware validation checklists. Do not distribute without NDA.*

## 1. Solar Sentinel v1 BOM & Supply Chain Sourcing
This list covers the primary components for the B2C Smart Bokashi validation units.

| Component | Function | Primary Source | Fallback Distro | Note |
|---|---|---|---|---|
| **ESP32-S3 WROOM-1** | MCU / Wi-Fi | Espressif Direct | Mouser / Digi-Key | Flash encrypted, JTAG disabled |
| **Microchip ATECC608A** | Secure Element | Microchip | LCSC | Requires provisioning facility for key generation |
| **TI INA226** | Bi-Directional Power Monitoring | Texas Instruments | Mouser | ±0.1% accuracy requirement for Sentinel tracking |
| **Semtech SX1276** | LoRa Transceiver (Optional) | Semtech | LCSC | Used for deep-rural off-grid deployments |
| **18650 Li-ion Cell** | Main Power Reserve | Panasonic/Sanyo | Local European Wholesaler | Must have integrated BMS |

## 2. Firmware Handshake Test Protocol
To verify the Air-gapped HSM architecture before flashing production units, complete the following routine:

1. **Provisioning:** Burn a unique ECDSA secp256r1 keypair into the ATECC608A using the `cryptoauthlib` provisioning script. *The private key must never leave slot 0.*
2. **Registration:** Export the public key. Submit a transaction to `DeviceRegistry.sol` executing `registerDevice(deviceHash, pubKey, hubAddress)`.
3. **Telemetry Gen:** Use a test script to feed raw sensor data (e.g. `weight=14kg`, `temp=45C`) to the ESP32.
4. **Hardware Sign:** The ESP32 passes the SHA-256 hash of the telemetry to the ATECC608A for signing.
5. **SQS Relay:** Device POSTs the payload and signature to the AWS API Gateway over TLS.
6. **Execution:** Observe the Node.js Oracle worker polling SQS, recovering the signer address via `ethers.utils.verifyMessage`, matching it in the Registry, and pushing the transaction to `EmissionController.sol`.
7. **Verification:** Confirm the BSC testnet transaction hash exists and rewards were emitted to the mapped wallet.

## 3. Factory Provisioning Sub-routine
At the ECM (Electronic Contract Manufacturer) facility:
- We do not supply the device with its final SCARAB connectivity credentials.
- The ATECC608A receives a "blank slate" keypair.
- The Public Key is passed to the SCARAB foundation in an encrypted manifest file.
- `DeviceRegistry.sol` is bulk-loaded with whitelisted public keys.

## 4. Bioreactor Sensor Bus Integration
**CRITICAL:** The I2C bus collision check.
- **ATECC608A Default Address:** `0xC0` (or `0x60` 7-bit)
- **DS18B20 Temp Sensor:** Uses 1-Wire protocol (No I2C collision)
- **Sensirion SCD41 (CO2):** `0x62`
- *Action:* Confirm no downstream multiplexers share the `0x60` range to prevent cryptographic halting during concurrent sensor polling.

## 5. Device QR Code Specification
The physical sticker on the back of the Smart Bokashi bin must conform to the following schema for the React PWA `FarmerOnboard.jsx` flow:

**Data Encoded (JSON payload compressed or URI scheme):**
\`\`\`
scarab://activate?id=BOK-9942&hash=0x4b7c...a1&v=1
\`\`\`
- `id`: The human-readable Device Tag.
- `hash`: The first 12 bytes of the Keccak256 hash of the device's public key (used for rapid front-end validation before the on-chain query).
- `v`: QR versioning.
