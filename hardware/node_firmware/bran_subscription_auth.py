import hashlib
import hmac
import time
import os
import argparse

class BranAuthenticator:
    """
    SCARAB Protocol - Bran Authentication Simulator
    Verifies SCARAB-certified Bokashi bran via NFC/SD card HMAC-SHA256 signatures.
    """
    
    def __init__(self, master_key: bytes):
        """
        master_key: 32-byte AES-256 key (stored in SCARAB backend, public key verified on-device)
        """
        self.master_key = master_key
    
    def generate_subscription_token(self, batch_id: str, expiry_cycles: int = 1) -> bytes:
        """
        Generate unique token for each bran batch.
        
        Token Structure (48 bytes):
        - 16 bytes: Batch ID hash
        - 4 bytes: Expiry cycles (int32)
        - 8 bytes: Unix timestamp
        - 20 bytes: HMAC-SHA256 signature
        """
        # Hash batch ID
        batch_hash = hashlib.sha256(batch_id.encode()).digest()[:16]
        
        # Encode expiry
        expiry_bytes = expiry_cycles.to_bytes(4, 'big')
        
        # Timestamp
        timestamp = int(time.time()).to_bytes(8, 'big')
        
        # Create payload
        payload = batch_hash + expiry_bytes + timestamp
        
        # Sign with HMAC
        signature = hmac.new(
            self.master_key,
            payload,
            hashlib.sha256
        ).digest()[:20]
        
        token = payload + signature
        return token
    
    def verify_token(self, token: bytes) -> dict:
        """
        Verify token authenticity on the ESP32 simulator.
        Returns: {valid: bool, cycles_remaining: int}
        """
        if len(token) != 48:
            return {"valid": False, "error": "Invalid token length"}
        
        # Split token
        payload = token[:28]
        signature = token[28:]
        
        # Verify signature
        expected_sig = hmac.new(
            self.master_key,
            payload,
            hashlib.sha256
        ).digest()[:20]
        
        if not hmac.compare_digest(signature, expected_sig):
            return {"valid": False, "error": "Signature mismatch - Counterfeit Bran Detected"}
        
        # Extract data
        batch_hash = payload[:16]
        expiry_cycles = int.from_bytes(payload[16:20], 'big')
        timestamp = int.from_bytes(payload[20:28], 'big')
        
        # Check expiry
        age_days = (time.time() - timestamp) / 86400
        
        if age_days > 365:  # Token older than 1 year
            return {"valid": False, "error": "Token expired"}
        
        return {
            "valid": True,
            "cycles_remaining": expiry_cycles,
            "batch_id": batch_hash.hex(),
            "issued_timestamp": timestamp,
            "message": "SCARAB Bran Verified. 30-Day Fermentation Cycle Unlocked."
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SCARAB Bran Authentication Simulator")
    parser.add_argument("--batch", type=str, default="BATCH-802", help="The Bran Batch ID")
    parser.add_argument("--cycles", type=int, default=1, help="Number of 30-day cycles")
    args = parser.parse_args()

    print(f"--- SCARAB Protocol ---")
    print(f"Initializing Factory Key... ", end="")
    # Mocking a 32-byte secret key loaded from secure enclave
    mock_master_key = os.urandom(32) 
    authenticator = BranAuthenticator(mock_master_key)
    print("OK")

    print(f"Generating NFC Token for {args.batch}...")
    token = authenticator.generate_subscription_token(args.batch, args.cycles)
    print(f"Token Hex: {token.hex()}")

    print("\nSimulating Hardware Node Verification...")
    result = authenticator.verify_token(token)
    
    if result["valid"]:
        print("✅ SUCCESS!")
        print(f"Message: {result['message']}")
        print(f"Cycles Given: {result['cycles_remaining']}")
    else:
        print(f"❌ FAILED: {result['error']}")

    print("\nSimulating Counterfeit Bran Attack...")
    # Flip one byte in the signature
    counterfeit_token = bytearray(token)
    counterfeit_token[-1] ^= 0xFF
    
    bad_result = authenticator.verify_token(bytes(counterfeit_token))
    if not bad_result["valid"]:
        print(f"🛡️ Attack Blocked: {bad_result['error']}")
