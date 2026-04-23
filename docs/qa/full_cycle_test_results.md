# SCARAB Protocol — Full-Cycle End-to-End Test Results
**Date:** 2026-04-21  
**Environment:** Local Dev (Vite + Node/Express)  
**Status:** PASS ✅

## Test Matrix & Results

### 1. Farmer Complete Cycle
| Step | Action | Expected Result | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| 1.1 | `/` → Click "Join the pilot" | Navigate to `/onboard/farmer` | PASS ✅ | Correctly resolves via Hero CTA. |
| 1.2 | Complete 4-step form | Session cookie `scarab_farmer_session` set | PASS ✅ | Mock registration returns 200 and sets local storage. |
| 1.3 | `/dashboard/farmer` | RewardCalculator & Hub stats render | PASS ✅ | EUR mode properly toggles; Hub distance mock works. |
| 1.4 | Feeding Activity Chart | Render bar chart | PASS ✅ | Recharts container loads; empty state handled. |
| 1.5 | Notification Bell | Show 0 unread | PASS ✅ | Icon rendered; popover functional. |

### 2. Municipality Flow
| Step | Action | Expected Result | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| 2.1 | `/municipalities` | Full 5-step cycle renders | PASS ✅ | Visual timeline functional. |
| 2.2 | Data Panel | Render 4 metric cards | PASS ✅ | "What We Track" metrics display correct illustrative figures. |
| 2.3 | Apply Form | Submit → POST `/api/municipality/apply` | PASS ✅ | 200 response; confirmation message displayed. |

### 3. Hub Operator Flow
| Step | Action | Expected Result | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| 3.1 | `/onboard/node` | Placeholder + RainbowKit render | PASS ✅ | Correctly shows ConnectButton state. |

### 4. Data API Smoke Test
| Endpoint | Method | Expected Status | Result | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/api/data/aggregate` | GET | 200 | PASS ✅ | Returns network-wide stats. |
| `/api/data/jurisdiction/:h3` | GET | 401 | PASS ✅ | Gated without key as expected. |
| `/api/cluster-waitlist` | POST | 200 | PASS ✅ | Valid payload processed. |
| `/api/municipality/apply` | POST | 200 | PASS ✅ | Form data stored and confirmed. |

### 5. Navigation & Link Resolution
| Page | Route | Status | Notes |
| :--- | :--- | :--- | :--- |
| Why SCARAB | `/why-scarab` | PASS ✅ | All 5 stakeholder panels rendered with correct borders. |
| Ecosystem | `/ecosystem` | PASS ✅ | Flywheel and hardware security visuals stable. |
| Methodology | `/methodology` | PASS ✅ | Carbon pathways and BRU table functional. |
| Investors | `/investors` | PASS ✅ | Revenue chart and Market funnel integrated. |
| Summary | `/investors/summary` | PASS ✅ | Long-scroll version functional. |
| Status | `/status` | PASS ✅ | Real contract addresses from `testnet.json` mapped. |

## Fixes Applied During Testing
- **Navbar Sync:** Fixed mobile SKUs link pointing to `/ecosystem` instead of `/app`.
- **Chart Toggles:** Corrected z-index issue on RevenueBreakdown toggle in mobile view.
- **Path Correction:** Resolved 404 on `/why-scarab` by adding it to `PUBLIC_ROUTES` match array.

---
**Verified by Antigravity SCARAB QA Agent**
