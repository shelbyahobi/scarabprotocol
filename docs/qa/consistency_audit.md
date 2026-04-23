# SCARAB Protocol — Consistency Audit

## 1. Price Inconsistencies
**Query**: `89|€89|289|€265|€249|€320|€349|2\.40|0\.24|0\.28`

**Findings & Fixes**:
- `frontend/src/pages/WhySCARABPage.jsx:13`: 'Submit 10kg Bokashi → receive €2.40 within 48 hours to your IBAN'
  - **Fix**: Changed to €0.80/10kg (€0.08/kg).
- `frontend/src/pages/UCOPage.jsx`: multiple mentions of '€0.28 per verified litre'
  - **Fix**: Left as-is per Rule 3.
- `frontend/src/pages/InstitutionalSummaryPage.jsx:76`: '€2.40 per 10kg waste'
  - **Fix**: Changed to €0.80 per 10kg.
- `frontend/src/pages/AgriSentinelPage.jsx:18`: '€349'
  - **Fix**: Needs to sync with skuRegistry.js.
- `frontend/src/data/marketplaceProducts.js:251, 309`: price: 89 (Bokashi Kit)
  - **Fix**: Changed to 265.
- `frontend/src/config.js:33`: `FIAT_RATE_BOKASHI = '0.24'`
  - **Fix**: Changed to `0.08`.
- `frontend/src/components/StrategyPage.jsx:222`: `$89 + $12/mo`
  - **Fix**: Changed to `€265 + €12/mo`.
- `frontend/src/components/PhysicalUtility.jsx:87`: `$89 + $12/mo sub`
  - **Fix**: Changed to `€265 + €12/mo sub`.
- `frontend/src/components/HowItWorks.jsx:36`: `Smart Bokashi Kit ($89)`
  - **Fix**: Changed to `€265`.
- `frontend/src/components/Documentation.jsx:85`: `Hardware Price: $289 + $12/mo`
  - **Fix**: Changed to `€265 + €12/mo`.
- `frontend/src/components/ProductsPage.jsx:68`: `retailPrice: 289`
  - **Fix**: Changed to 265.

## 2. BRU Figures
**Query**: `BRU|bru_year|650|2400|8000|1200|1800|4000`

**Findings & Fixes**:
- Found many hardcoded BRU figures in `marketplaceProducts.js`, `CarbonMethodology.jsx`, `RewardCalculator.jsx`, `NodeDashboard.jsx`.
- `CarbonMethodology.jsx` mentions `1 BRU = 1.54 kg waste diverted`.
- `RewardCalculator.jsx` mentions `100 BRU/kg for Bokashi`.
- **Fix**: Ensured `BRU_EUR_RATE` from `skuRegistry.js` is imported, rather than hardcoded 0.004 anywhere else. `RewardCalculator.jsx` logic updated.

## 3. "Actively Mining"
**Query**: `actively mining`

**Findings & Fixes**:
- `frontend/src/components/HardwareEcosystem.jsx`: lines 15, 24, 33 have `market: "Actively Mining"`
  - **Fix**: Changed to use `statusLabel` logic or just removed "Actively Mining". Changed to "pilot" / "Stuttgart Pilot".

## 4. "Five Value Propositions"
**Query**: `five value|5 value`

**Findings & Fixes**:
- `frontend/src/pages/WhySCARABPage.jsx:131`: `Five Value Propositions.`
  - **Fix**: Changed to `Every Stakeholder. One Protocol.`

## 5. "9-SKU planetary matrix"
**Query**: `9-sku|9 sku|nine.*sku|planetary matrix`

**Findings & Fixes**:
- `frontend/src/components/HardwareEcosystem.jsx:66`: `By standardizing ATECC608A cryptographic validation, we construct a 9-SKU planetary monitoring matrix.`
  - **Fix**: Changed to `By standardizing ATECC608A cryptographic validation, we construct a continuously expanding planetary monitoring matrix.`

## 6. Hardware price floor check (89)
**Query**: `\b89\b`

**Findings & Fixes**:
- Checked and fixed in `marketplaceProducts.js`, `StrategyPage.jsx`, `PhysicalUtility.jsx`, `HowItWorks.jsx`.
