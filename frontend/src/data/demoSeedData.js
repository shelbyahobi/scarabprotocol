/**
 * SCARAB Demo Mode — Seed Data
 * Realistic simulated telemetry for live presentations.
 * Activated by ?demo=true URL param or the demo toggle button.
 */

export const DEMO_FARMER = {
  name: "Maria K.",
  device_id: "SCARAB-BK-0047",
  cluster: "Stuttgart Süd",
  hub_name: "Hub Vaihingen",
  hub_distance_km: 3.2,
  hub_fill_pct: 67,
  hub_days_to_collection: 4,
  tier: "Smart Bokashi Kit",
  activated_at: "2026-02-14",
};

export const DEMO_SUBMISSIONS = [
  { date: "2026-04-18", weight_kg: 8.4, temp_c: 24, quality_score: 91, reward_eur: 0.67, status: "paid" },
  { date: "2026-04-03", weight_kg: 11.2, temp_c: 22, quality_score: 87, reward_eur: 0.90, status: "paid" },
  { date: "2026-03-19", weight_kg: 9.8, temp_c: 26, quality_score: 94, reward_eur: 0.78, status: "paid" },
  { date: "2026-03-04", weight_kg: 7.6, temp_c: 21, quality_score: 83, reward_eur: 0.61, status: "paid" },
];

export const DEMO_NOTIFICATIONS = [
  { type: "info", category: "weight", title: "Bucket 74% full", body: "Estimated 3–4 days to capacity.", advice: "Book a drop-off in advance.", timestamp: Date.now() - 3600000, read: false },
  { type: "warning", category: "temperature", title: "Fermentation slowing", body: "Temperature dropped to 14°C overnight.", advice: "Move the bucket to a warmer spot — optimal range is 15–30°C.", timestamp: Date.now() - 86400000, read: false },
  { type: "info", category: "submission", title: "Payment confirmed", body: "€0.90 credited to your IBAN for your April 3rd submission.", advice: null, timestamp: Date.now() - 172800000, read: true },
];

export const DEMO_NODE = {
  wallet: "0x3f4A...d291",
  cluster: "Stuttgart Süd",
  registered_devices: 12,
  uptime_pct: 98.7,
  handshakes_this_epoch: 47,
  bru_this_epoch: 3840,
  staked_scarab: 5000,
  claimable_rewards_scarab: 2847,
  scarab_balance: 18420,
};

export const DEMO_TRANSACTIONS = [
  { hash: "0xd460fba2...", type: "Device Activation", age: "41 days ago", status: "confirmed" },
  { hash: "0x704f6749...", type: "Cycle Start", age: "38 days ago", status: "confirmed" },
  { hash: "0x9dbe6096...", type: "Telemetry — Day 3", age: "35 days ago", status: "confirmed" },
  { hash: "0xab212d51...", type: "Telemetry — Day 8", age: "30 days ago", status: "confirmed" },
  { hash: "0xf84cbd7d...", type: "Cycle Completion", age: "25 days ago", status: "confirmed" },
];
