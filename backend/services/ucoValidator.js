/**
 * SCARAB UCO Collection Node — Quality Validation Service
 * Validates used cooking oil telemetry before issuing rewards.
 * All thresholds from EU EN 14214 biodiesel feedstock standard.
 */

/**
 * @typedef {Object} UCOTelemetry
 * @property {string}  device_id
 * @property {number}  timestamp
 * @property {number}  volume_litres        - load cell measurement
 * @property {number}  density_kg_l         - at 15°C after thermal stabilisation
 * @property {number}  conductivity_us_cm   - water content proxy
 * @property {number}  optical_transmission - 0-100, refractometer reading
 * @property {number}  temp_c               - oil temperature at measurement
 * @property {string}  user_qr_hash         - hashed user QR scan
 * @property {string}  sig                  - ATECC608A ECDSA signature
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} accepted
 * @property {number}  verified_litres
 * @property {string}  grade              - 'A' | 'B' | 'rejected'
 * @property {number}  reward_eur         - calculated reward in EUR cents
 * @property {string[]} rejection_reasons  - empty if accepted
 * @property {number}  confidence         - 0-100
 */

const THRESHOLDS = {
  MIN_VOLUME_L: 1.0,
  MAX_VOLUME_L: 25.0,
  MAX_WATER_CONDUCTIVITY: 200,    // μS/cm — above this = >1% water content
  MIN_OPTICAL_TRANSMISSION: 35,  // below this = heavily degraded or contaminated
  DENSITY_MIN: 0.880,            // kg/L — below this = likely diluted with solvent
  DENSITY_MAX: 0.925,            // kg/L — above this = likely mixed with heavier oil/grease
  TEMP_MIN_C: 15,                // must be above 15°C for accurate density reading
  TEMP_MAX_C: 60,                // above 60°C = safety flag, reject and alert
};

const REWARD_RATES = {
  A: parseFloat(process.env.UCO_RATE_GRADE_A_EUR_L || '0.28'),  // clean, low FFA
  B: parseFloat(process.env.UCO_RATE_GRADE_B_EUR_L || '0.18'),  // acceptable, higher FFA
};

/**
 * @param {UCOTelemetry} telemetry
 * @returns {ValidationResult}
 */
function validateUCO(telemetry) {
  const reasons = [];

  if (telemetry.volume_litres < THRESHOLDS.MIN_VOLUME_L) reasons.push('Volume below minimum (1L)');
  if (telemetry.volume_litres > THRESHOLDS.MAX_VOLUME_L) reasons.push('Volume exceeds single-visit maximum (25L)');
  if (telemetry.conductivity_us_cm > THRESHOLDS.MAX_WATER_CONDUCTIVITY) reasons.push('Water content too high — oil may be diluted');
  if (telemetry.optical_transmission < THRESHOLDS.MIN_OPTICAL_TRANSMISSION) reasons.push('Oil clarity too low — possible contamination');
  if (telemetry.density_kg_l < THRESHOLDS.DENSITY_MIN || telemetry.density_kg_l > THRESHOLDS.DENSITY_MAX) reasons.push('Density outside vegetable oil range — possible adulteration');
  if (telemetry.temp_c < THRESHOLDS.TEMP_MIN_C) reasons.push('Oil temperature too low for accurate measurement — warm to 15°C+');
  if (telemetry.temp_c > THRESHOLDS.TEMP_MAX_C) reasons.push('Safety: oil temperature exceeds 60°C — rejected');

  if (reasons.length > 0) {
    return { accepted: false, verified_litres: 0, grade: 'rejected', reward_eur: 0, rejection_reasons: reasons, confidence: 0 };
  }

  // Grade A: high clarity, low water, ideal density
  const gradeA = telemetry.optical_transmission >= 65 && telemetry.conductivity_us_cm < 100;
  const grade = gradeA ? 'A' : 'B';
  const rate = REWARD_RATES[grade];
  const rewardEur = Math.round(telemetry.volume_litres * rate * 100) / 100;

  const confidence = Math.round(
    (telemetry.optical_transmission / 100) * 40 +
    (1 - telemetry.conductivity_us_cm / THRESHOLDS.MAX_WATER_CONDUCTIVITY) * 40 +
    20
  );

  return {
    accepted: true,
    verified_litres: Math.round(telemetry.volume_litres * 100) / 100,
    grade,
    reward_eur: rewardEur,
    rejection_reasons: [],
    confidence: Math.min(confidence, 100),
  };
}

module.exports = { validateUCO, THRESHOLDS, REWARD_RATES };
