import os
import argparse
import requests
import json
from openai import OpenAI
import tweepy
from dotenv import load_dotenv

# Load env variables if present (local testing)
load_dotenv()

# Configuration
BSCSCAN_API_KEY = os.getenv("BSCSCAN_API_KEY")
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN")
TWITTER_ACCESS_TOKEN_SECRET = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")
GHOST_ADMIN_KEY = os.getenv("GHOST_ADMIN_KEY")
GHOST_URL = os.getenv("GHOST_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

VITE_SCARAB_TOKEN_ADDRESS = os.getenv("VITE_SCARAB_TOKEN_ADDRESS", "0x0000000000000000000000000000000000000000") # Replace in .env

def get_bsc_stats():
    """Fetch testnet token stats from BscScan"""
    if not BSCSCAN_API_KEY:
        print("[WARNING] BSCSCAN_API_KEY not found. Using mock data.")
        return {"total_supply": "1000000000", "holders": "0", "tx_count": "150"}
        
    url = f"https://api-testnet.bscscan.com/api?module=stats&action=tokensupply&contractaddress={VITE_SCARAB_TOKEN_ADDRESS}&apikey={BSCSCAN_API_KEY}"
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        if data["status"] == "1":
            # Simplified mock stats combined with actual supply
            return {
                "total_supply": str(int(data["result"]) // 10**18),
                "holders": "Beta Phase",
                "tx_count": "Growing rapidly"
            }
        else:
            print(f"[ERROR] BscScan returned error: {data['message']}")
            return None
    except Exception as e:
        print(f"[ERROR] Failed to fetch BSC stats: {e}")
        return None

def generate_educational_tweet(stats):
    """Use OpenAI to generate an educational tweet based on protocol stats."""
    if not OPENAI_API_KEY:
        print("[WARNING] OPENAI_API_KEY not found. Returning mock tweet.")
        return "🌱 The SCARAB Protocol is testing hardware-verified DePIN solutions on the BNB Smart Chain! Cryptographic telemetry guarantees environmental truth. Track our testnet progress: https://www.scarabprotocol.org #DePIN #ReFi"

    client = OpenAI(api_key=OPENAI_API_KEY)
    
    prompt = f"""
    Write a single, educational, and engaging tweet (max 280 characters) about the SCARAB Protocol.
    SCARAB is a DePIN (Decentralized Physical Infrastructure Network) on BNB Smart Chain focusing on hardware-verified organic waste fermentation (Bokashi) and renewable energy tracking.
    
    Current Testnet Stats:
    Total Supply Cap: {stats.get('total_supply', '1,000,000,000')}
    Network Phase: Testnet Beta
    
    Tone: Objective, academic, innovative. NO financial advice, NO price speculation, NO "moon" talk.
    Include the link: https://www.scarabprotocol.org
    Include hashtags: #DePIN #ReFi
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a lead technical communicator for a blockchain infrastructure protocol."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=60,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[ERROR] OpenAI generation failed: {e}")
        return "🌱 SCARAB Protocol is bringing hardware-verified environmental truth to the BNB Smart Chain. Join the DePIN revolution. Read the docs: https://www.scarabprotocol.org #DePIN #ReFi"

def save_ghost_draft(title, content):
    """Save content as a draft in Ghost CMS using the Admin API."""
    if not GHOST_ADMIN_KEY or not GHOST_URL:
        print("[WARNING] Ghost credentials missing. Skipping blog draft.")
        return False
        
    # Standard Ghost Admin API JWT generation would go here.
    # For this script, we output the mock execution explicitly to terminal.
    print(f"\n[GHOST API MOCK] Saving draft: '{title}' to {GHOST_URL}")
    return True

def post_tweet(tweet_content):
    """Post to Twitter using Developer API v2."""
    if not TWITTER_BEARER_TOKEN or not TWITTER_ACCESS_TOKEN:
        print("[WARNING] Twitter credentials missing. Skipping live tweet.")
        return False
        
    try:
        client = tweepy.Client(
            bearer_token=TWITTER_BEARER_TOKEN,
            consumer_key=TWITTER_API_KEY,
            consumer_secret=TWITTER_API_SECRET,
            access_token=TWITTER_ACCESS_TOKEN,
            access_token_secret=TWITTER_ACCESS_TOKEN_SECRET
        )
        response = client.create_tweet(text=tweet_content)
        print(f"[SUCCESS] Tweet posted! ID: {response.data['id']}")
        return True
    except Exception as e:
        print(f"[ERROR] Twitter API failed: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="SCARAB Social Generator automation agent.")
    parser.add_argument("--dry-run", action="store_true", help="Run without posting to live APIs")
    args = parser.parse_args()

    print("==========================================")
    print(" SCARAB PROTOCOL - SOCIAL GENERATOR AGENT")
    print("==========================================\n")
    
    if args.dry_run:
        print("[MODE] DRY-RUN ENABLED. No live posts will be made.\n")

    # 1. Fetch Stats
    print("[1/3] Fetching BSCScan testnet statistics...")
    stats = get_bsc_stats()
    if stats:
        print(f"      -> Success: Total Supply = {(stats.get('total_supply'))}")
    else:
        stats = {"total_supply": "1000000000"}

    # 2. Generate Content
    print("\n[2/3] Generating educational content via OpenAI...")
    tweet = generate_educational_tweet(stats)
    print("      -> Generated Tweet:")
    print("------------------------------------------")
    print(tweet)
    print("------------------------------------------")

    # 3. Publish
    print("\n[3/3] Publishing workflow...")
    if args.dry_run:
        print("      -> [DRY-RUN] Skipping Ghost CMS draft upload.")
        print("      -> [DRY-RUN] Skipping Twitter v2 API post.")
    else:
        save_ghost_draft("Weekly Network Update: Verified Telemetry", tweet)
        post_tweet(tweet)
        
    print("\n[DONE] Agent execution complete.")

if __name__ == "__main__":
    main()
