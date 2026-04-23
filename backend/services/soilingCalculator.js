/**
 * Calculates panel soiling loss and economic impact.
 * @param {number} referenceIrradiance - clean reference photodiode (lux)
 * @param {number} soiledIrradiance   - soiled surface photodiode (lux)
 * @param {number} systemKwp          - system rated capacity in kWp
 * @param {number} energyRateEurKwh   - local energy rate €/kWh
 * @param {number} hoursPerYearFull   - full-load hours per year (regional avg, Germany ~1000)
 * @returns {{ soilingLossPct, annualKwhLoss, annualEurLoss }}
 */
function calculateSoilingLoss(referenceIrradiance, soiledIrradiance, systemKwp, energyRateEurKwh, hoursPerYearFull = 1000) {
  const soilingLossPct = ((referenceIrradiance - soiledIrradiance) / referenceIrradiance) * 100;
  const annualKwhLoss = systemKwp * hoursPerYearFull * (soilingLossPct / 100);
  const annualEurLoss = annualKwhLoss * energyRateEurKwh;
  return { 
    soilingLossPct: Math.round(soilingLossPct * 10) / 10, 
    annualKwhLoss: Math.round(annualKwhLoss), 
    annualEurLoss: Math.round(annualEurLoss) 
  };
}

module.exports = {
  calculateSoilingLoss
};
