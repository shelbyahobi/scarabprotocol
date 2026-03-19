"""
SCARAB Protocol - ESP32 Firmware Simulator
Simulates Solar Sentinel V1 hardware telemetry generation and signing

IMPORTANT: This is a SIMULATION for development/audit purposes.
Production devices MUST use ATECC608A secure element.

Dependencies:
    pip install ecdsa cryptography python-dateutil
"""

import time
import json
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import ecdsa
from ecdsa import SigningKey, SECP256k1, NIST256p
from ecdsa.util import sigencode_string, sigdecode_string


class ATECC608ASimulator:
    """
    Simulates Microchip ATECC608A secure element
    
    PRODUCTION NOTE:
    Real ATECC608A stores private key in hardware-protected memory.
    This simulation stores key in RAM for demonstration purposes only.
    """
    
    def __init__(self, device_id: str):
        self.device_id = device_id
        # Generate NIST P-256 keypair (same as ATECC608A)
        self.private_key = SigningKey.generate(curve=NIST256p)
        self.public_key = self.private_key.get_verifying_key()
        # Store public key in hex format (for smart contract registration)
        self.public_key_hex = self.public_key.to_string().hex()
        
        print(f"✅ Simulated ATECC608A initialized for {device_id}")
        print(f"   Public Key: 0x{self.public_key_hex[:32]}...")
    
    def sign_data(self, data: bytes) -> bytes:
        """Sign data using ECDSA (NIST P-256), returns 64-byte signature."""
        data_hash = hashlib.sha256(data).digest()
        signature = self.private_key.sign_digest(
            data_hash,
            sigencode=sigencode_string
        )
        return signature
    
    def get_public_key_hex(self) -> str:
        return self.public_key_hex


class SolarSentinelSimulator:
    """Simulates Solar Sentinel V1 hardware device"""
    
    def __init__(
        self, 
        device_id: str,
        panel_capacity_watts: int = 300,
        location_lat: float = 37.7749,
        location_lon: float = -122.4194
    ):
        self.device_id = device_id
        self.panel_capacity = panel_capacity_watts
        self.location = (location_lat, location_lon)
        self.secure_element = ATECC608ASimulator(device_id)
        self.telemetry_history = []
        
        print(f"\n🌞 Solar Sentinel V1 initialized:")
        print(f"   Device ID: {device_id}")
        print(f"   Panel Capacity: {panel_capacity_watts}W")
    
    def _simulate_solar_production(self, timestamp: datetime) -> Dict[str, float]:
        """Simulate realistic solar production based on time of day"""
        hour = timestamp.hour + timestamp.minute / 60.0
        day_of_year = timestamp.timetuple().tm_yday
        solar_noon = 12.0
        hours_from_noon = abs(hour - solar_noon)
        
        if hour < 6 or hour > 18:
            irradiance_factor = 0.0
        else:
            irradiance_factor = max(0, (1 - (hours_from_noon / 6.0) ** 2))
        
        seasonal_factor = 0.8 + 0.2 * (1 - abs(day_of_year - 172) / 182)
        cloud_factor = 0.7 + secrets.randbelow(30) / 100.0
        
        power_watts = (
            self.panel_capacity 
            * irradiance_factor 
            * seasonal_factor 
            * cloud_factor
        )
        
        voltage = 35.0 + secrets.randbelow(50) / 10.0
        current = power_watts / voltage if voltage > 0 else 0
        energy_wh = power_watts / 4.0  # 15 min = 0.25 hour
        
        return {
            "voltage": round(voltage, 2),
            "current": round(current, 3),
            "power": round(power_watts, 2),
            "energy_wh": round(energy_wh, 2)
        }
    
    def generate_telemetry(self, timestamp: datetime) -> Dict:
        """Generate signed telemetry packet"""
        metrics = self._simulate_solar_production(timestamp)
        payload = {
            "device_id": self.device_id,
            "timestamp": int(timestamp.timestamp()),
            "metrics": metrics,
            "location": {
                "lat": self.location[0],
                "lon": self.location[1]
            }
        }
        
        payload_string = json.dumps(payload, sort_keys=True)
        payload_bytes = payload_string.encode('utf-8')
        signature = self.secure_element.sign_data(payload_bytes)
        
        payload["signature"] = signature.hex()
        payload["public_key"] = self.secure_element.get_public_key_hex()
        self.telemetry_history.append(payload)
        return payload
    
    def export_telemetry_json(self, filepath: str):
        with open(filepath, 'w') as f:
            json.dump(self.telemetry_history, f, indent=2)
        print(f"💾 Telemetry exported to {filepath}")

def verify_signature(payload: Dict, public_key_hex: str, signature_hex: str) -> bool:
    """Verify ECDSA signature simulating smart contract behavior"""
    try:
        payload_copy = payload.copy()
        payload_copy.pop("signature", None)
        payload_copy.pop("public_key", None)
        
        payload_string = json.dumps(payload_copy, sort_keys=True)
        payload_bytes = payload_string.encode('utf-8')
        data_hash = hashlib.sha256(payload_bytes).digest()
        
        public_key_bytes = bytes.fromhex(public_key_hex)
        verifying_key = ecdsa.VerifyingKey.from_string(public_key_bytes, curve=NIST256p)
        signature_bytes = bytes.fromhex(signature_hex)
        
        verifying_key.verify_digest(signature_bytes, data_hash, sigdecode=sigdecode_string)
        return True
    except Exception as e:
        print(f"❌ Signature verification failed: {e}")
        return False

if __name__ == "__main__":
    device = SolarSentinelSimulator(device_id="SOLAR-SENTINEL-0001", panel_capacity_watts=300)
    print("\n📊 Generating 1 day of telemetry (15-min intervals)...")
    
    start_date = datetime(2026, 6, 1, 0, 0, 0)
    telemetry = []
    
    for i in range(96):
        telemetry.append(device.generate_telemetry(start_date + timedelta(minutes=15*i)))
    
    print("\n🔐 Cryptographic Verification Test:")
    is_valid = verify_signature(telemetry[0], telemetry[0]["public_key"], telemetry[0]["signature"])
    
    if is_valid:
        print("   ✅ Signature VALID (ATECC608A simulation working)")
    
    device.export_telemetry_json("telemetry_sample.json")
