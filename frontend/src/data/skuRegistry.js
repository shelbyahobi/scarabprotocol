/**
 * SCARAB Protocol — SKU Registry
 * Single source of truth for all hardware SKUs.
 * All prices in EUR. All BRU figures are modelled projections.
 * Import this wherever SKU data is displayed.
 */

export const SKU_REGISTRY = [

  // ── PHASE 1: ACTIVE ──────────────────────────────────────
  {
    id: 'solar-sentinel-v1',
    name: 'Solar Sentinel V1',
    phase: 1,
    category: 'Energy Production',
    status: 'pilot', // 'pilot' | 'active' | 'planned'
    statusLabel: 'Stuttgart Pilot — Q4 2026',
    description: 'Residential and commercial PV monitoring. Cryptographically verifies kWh generation via ATECC608A signatures at source.',
    price_eur: 320,
    bom_eur: 96,
    margin_pct: 70,
    bru_year: 2400,
    bru_unit: 'kWh generated',
    bru_unit_value: 0.375, // kWh per BRU
    fiat_reward_unit: null, // energy credited to grid, not direct EUR reward
    co2e_year_kg: 342, // Germany grid factor
    sensors: ['INA226 current/voltage', 'ATECC608A', 'LoRa SX1276', 'ESP32-S3', 'DS18B20 temp'],
    data_buyers: ['Energy utilities', 'REC registries', 'ESG funds'],
    scarab_burn_per_month: 10,
    compliance: ['Verra AMS-I.D (roadmap)', 'EU REC standard'],
    icon: '☀️',
  },

  {
    id: 'bokashi-kit',
    name: 'Smart Bokashi Kit',
    phase: 1,
    category: 'Methane Avoidance',
    status: 'pilot',
    statusLabel: 'Stuttgart Pilot — Q4 2026',
    description: 'Transforms residential kitchen waste into verifiable carbon avoidance using integrated weight, temperature, and gas sensors.',
    price_eur: 265,
    bom_eur: 107,
    margin_pct: 60,
    bru_year: 650,
    bru_unit: 'kg waste diverted',
    bru_unit_value: 1.54, // kg per BRU
    fiat_reward_rate_eur: 0.024, // EUR per kg (Mode A fiat-stable)
    fiat_reward_unit: 'per kg verified Bokashi',
    co2e_year_kg: 13.8, // per cycle × 18 cycles
    subscription_eur_month: 12, // Bokashi bran
    sensors: ['HX711 load cell', 'DS18B20 temp', 'SCD41 CO₂', 'SHT40 humidity', 'Reed switch lid', 'Float leachate', 'ATECC608A', 'LoRa'],
    data_buyers: ['Municipalities', 'Agricultural research', 'SAF feedstock brokers'],
    scarab_burn_per_month: 5,
    compliance: ['Gold Standard GS-METH-SWDS (roadmap)', 'IPCC Tier 1 current'],
    icon: '♻️',
  },

  {
    id: 'pro-bioreactor',
    name: 'Pro Bioreactor',
    phase: 1,
    category: 'Industrial Bioprocessing',
    status: 'pilot',
    statusLabel: 'Stuttgart Pilot — Q4 2026',
    description: 'Processes localised urban waste at industrial scale. Forms the endpoint of the circular economy cryptographic handshake loop.',
    price_eur: 4595,
    bom_eur: 1600,
    margin_pct: 65,
    bru_year: 8000,
    bru_unit: 'kg processed',
    bru_unit_value: null, // industrial — per tonne
    fiat_reward_rate_eur: null, // Hub operator revenue model
    co2e_year_kg: null, // tonne-scale, facility-dependent
    sensors: ['4× 200kg load cells', 'Industrial pH probe', 'PT100 RTD temp', 'Gas array CH4/CO2/NH3', 'Ultrasonic level', 'ATECC608A', '4G LTE'],
    data_buyers: ['Industrial composters', 'Carbon registries', 'Soil amendment manufacturers'],
    scarab_burn_per_month: 50,
    compliance: ['Verra VM0042 (roadmap)', 'ISCC (roadmap)'],
    icon: '🏭',
  },

  // ── UCO COLLECTION NODE ───────────────────────────────────
  {
    id: 'uco-collection-node',
    name: 'UCO Collection Node',
    phase: 1,
    category: 'SAF Feedstock Verification',
    status: 'pilot',
    statusLabel: 'Stuttgart Pilot — Q4 2026',
    description: 'Kiosk-deployed used cooking oil verification and collection. Hardware-attests quality and volume for ISCC-certified SAF feedstock chain of custody.',
    price_eur: 1895,
    bom_eur: 620,
    margin_pct: 67,
    bru_year: 1200,
    bru_unit: 'litres UCO verified',
    bru_unit_value: null,
    fiat_reward_rate_eur: 0.28, // EUR per litre Grade A
    fiat_reward_unit: 'per litre verified UCO',
    co2e_year_kg: null, // SAF displacement — facility-dependent
    sensors: ['Optical refractometer', 'Conductivity (water content)', 'HX711 load cell', 'Thermal element', 'QR scanner', 'ATECC608A', 'LoRa'],
    data_buyers: ['SAF manufacturers', 'ISCC auditors', 'Aviation fuel buyers'],
    scarab_burn_per_month: 25,
    compliance: ['ISCC EU (roadmap)', 'EU RED II'],
    icon: '🫙',
  },

  // ── AGRISENTINEL FAMILY ───────────────────────────────────
  {
    id: 'agrisentinel-lite',
    name: 'AgriSentinel Lite',
    phase: 1,
    category: 'Agrivoltaic Microclimate',
    status: 'pilot',
    statusLabel: 'Hohenheim Research Pilot — 2026',
    description: 'Entry-level under-panel sensor node. Monitors light transmission, soil moisture, and microclimate for irrigation and crop variety decisions.',
    price_eur: 149,
    bom_eur: 52,
    margin_pct: 65,
    bru_year: 1200,
    bru_unit: 'verified sensor-hours',
    fiat_reward_rate_eur: null,
    sensors: ['PAR light sensor', 'Capacitive soil moisture', 'DS18B20 soil temp', 'SHT40 air temp/humidity', 'ATECC608A', 'LoRa'],
    data_buyers: ['Agrivoltaic operators', 'Agricultural insurers', 'Research institutions'],
    scarab_burn_per_month: 3,
    compliance: ['DIN SPEC 91434 (proxy data)'],
    icon: '🌿',
  },

  {
    id: 'agrisentinel-pro',
    name: 'AgriSentinel Pro',
    phase: 1,
    category: 'Food Production Compliance',
    status: 'pilot',
    statusLabel: 'Hohenheim Research Pilot — 2026',
    description: 'DIN SPEC 91434 compliance monitoring. Continuous Leaf Area Index, NPK, soil pH, and panel soiling measurement for regulatory documentation.',
    price_eur: 349,
    bom_eur: 133,
    margin_pct: 62,
    bru_year: 1800,
    bru_unit: 'verified compliance-hours',
    fiat_reward_rate_eur: null,
    sensors: ['All Lite sensors', 'NPK soil probe', 'Soil pH electrochemical', 'Optical soiling sensor', 'LAI camera module', 'ATECC608A', 'LoRa'],
    data_buyers: ['Municipalities', 'Agricultural banks', 'Agrivoltaic insurers', 'Landwirtschaftsamt'],
    scarab_burn_per_month: 8,
    compliance: ['DIN SPEC 91434 continuous monitoring', 'EU CSRD Scope 3'],
    icon: '🌾',
  },

  {
    id: 'agrisentinel-biodiversity',
    name: 'AgriSentinel Biodiversity',
    phase: 1,
    category: 'Ecosystem Health Tracking',
    status: 'planned',
    statusLabel: 'Q2 2027',
    description: 'Pollinator acoustic monitoring, soil carbon flux, VOC plant stress, and biodiversity index for Gold Standard carbon credit support.',
    price_eur: 599,
    bom_eur: 240,
    margin_pct: 60,
    bru_year: 2400,
    bru_unit: 'verified biodiversity-hours',
    fiat_reward_rate_eur: null,
    sensors: ['All Pro sensors', 'Acoustic insect sensor', 'VOC sensor', 'SCD41 CO₂ flux', 'Soil EC microbial proxy'],
    data_buyers: ['NGOs', 'Carbon registries', 'ESG funds', 'Insurance underwriters'],
    scarab_burn_per_month: 15,
    compliance: ['Gold Standard GS4GG (roadmap)', 'Verra VM0042'],
    icon: '🐝',
  },

  {
    id: 'agrisentinel-industrial',
    name: 'AgriSentinel Industrial',
    phase: 1,
    category: 'Precision Agrivoltaic Management',
    status: 'planned',
    statusLabel: 'Q3 2027',
    description: 'Full-spectrum agrivoltaic intelligence for large installations. Thermal fault detection, dynamic panel positioning, predictive maintenance.',
    price_eur: 2495,
    bom_eur: 1050,
    margin_pct: 58,
    bru_year: 4000,
    bru_unit: 'verified management-hours',
    fiat_reward_rate_eur: null,
    sensors: ['All Biodiversity sensors', 'Dual-axis irradiance tracker', 'Thermal camera panel fault', 'Full weather station'],
    data_buyers: ['Utility agrivoltaic operators', 'Agricultural land funds', 'Grid operators'],
    scarab_burn_per_month: 40,
    compliance: ['DIN SPEC 91434', 'Verra AMS-I.D', 'EU CSRD'],
    icon: '⚡',
  },

  // ── PHASE 2: PLANNED ──────────────────────────────────────
  {
    id: 'aquasentinel',
    name: 'AquaSentinel',
    phase: 2,
    category: 'Water Conservation',
    status: 'planned',
    statusLabel: 'Q4 2026',
    description: 'Residential and agricultural water usage verification. Leak detection, consumption patterns, drought stress index.',
    price_eur: 199,
    bru_year: 1200,
    data_buyers: ['Water utilities', 'Insurance', 'Drought-risk funds'],
    icon: '💧',
  },

  {
    id: 'airnode',
    name: 'AirNode',
    phase: 2,
    category: 'Urban Air Quality',
    status: 'planned',
    statusLabel: 'Q1 2027',
    description: 'PM2.5, CO₂, VOC, and AQI monitoring for city planning, health insurance, and real estate ESG reporting.',
    price_eur: 149,
    bru_year: 800,
    data_buyers: ['City planning', 'Health insurers', 'Real estate ESG'],
    icon: '🌬️',
  },

  {
    id: 'soilsentinel',
    name: 'SoilSentinel',
    phase: 2,
    category: 'Regenerative Carbon Tracking',
    status: 'planned',
    statusLabel: 'Q2 2027',
    description: 'SOC stock change measurement for Verra VM0042 soil carbon credits. NPK, bulk density, microbial activity.',
    price_eur: 599,
    bru_year: 3000,
    data_buyers: ['Carbon registries', 'Agricultural land funds', 'Regenerative farmers'],
    icon: '🌱',
  },

  {
    id: 'powervault-monitor',
    name: 'PowerVault Monitor',
    phase: 2,
    category: 'Battery Storage Efficiency',
    status: 'planned',
    statusLabel: 'Q2 2027',
    description: 'Charge/discharge cycle verification for home battery systems. Renewable percentage tracking for grid certificates.',
    price_eur: 249,
    bru_year: 1800,
    data_buyers: ['Grid operators', 'EV fleet managers', 'REC registries'],
    icon: '🔋',
  },

  {
    id: 'chargenode',
    name: 'ChargeNode',
    phase: 2,
    category: 'Renewable EV Charging',
    status: 'planned',
    statusLabel: 'Q3 2027',
    description: 'kWh delivered and renewable source verification for home and commercial EV charging. Fleet ESG reporting.',
    price_eur: 399,
    bru_year: 2200,
    data_buyers: ['Charge network operators', 'Fleet ESG reporting', 'Grid operators'],
    icon: '⚡',
  },

  {
    id: 'carbonvault',
    name: 'CarbonVault',
    phase: 2,
    category: 'Industrial CO₂ Capture',
    status: 'planned',
    statusLabel: 'Q4 2027',
    description: 'Tonne-scale CO₂ capture verification for industrial facilities. Flow meter attestation, storage confirmation.',
    price_eur: 12995,
    bru_year: 50000,
    data_buyers: ['Industrial emitters', 'Compliance buyers', 'Carbon registries'],
    icon: '🏗️',
  },
];

// ── CONVENIENCE EXPORTS ───────────────────────────────────────────
export const PHASE_1_SKUS = SKU_REGISTRY.filter(s => s.phase === 1);
export const PHASE_2_SKUS = SKU_REGISTRY.filter(s => s.phase === 2);
export const ACTIVE_SKUS  = SKU_REGISTRY.filter(s => s.status !== 'planned');

// BRU → EUR conversion (modelled, updated from VITE env)
export const BRU_EUR_RATE = parseFloat(import.meta.env.VITE_BRU_EUR_RATE || '0.004');
// At current modelled rate: 1 BRU = €0.004
// Solar Sentinel: 2,400 BRU × €0.004 = €9.60/year base (before multipliers)
// This is the floor — multipliers can reach 9× = €86.40/year max modelled scenario
