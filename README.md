# ROLL Token Protocol

> **The Currency of Physical Resilience.**
> A Web3 ecosystem for financing, building, and accessing off-grid infrastructure.

![Banner](https://img.shields.io/badge/Status-Live_on_Testnet-success) ![Audit](https://img.shields.io/badge/Audit-Passed-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌍 The Vision

ROLL is not just a token; it is the **operating system for a sovereign physical network**. We bridge the gap between digital assets (DeFi) and real-world utility (RWA).

Our mission is to create a closed-loop economy where the token is used to:
1.  **Purchase** off-grid equipment (Solar, Water, Connectivity) at exclusive discounts.
2.  **Access** gated communities and physical locations.
3.  **Govern** a DAO dedicated to acquiring land and building resilient infrastructure.

## 🏗 Architecture

The platform consists of two core pillars:

### 1. The Launchpad (DApp)
A decentralized application for fair token distribution and governance.
*   **Smart Contract**: `SeedSale.sol` with automated soft-cap protection (refunds).
*   **Dashboard**: Real-time "Command Center" for tracking allocations and voting power.
*   **Gating**: `ColonyDashboard.jsx` restricts access to verified token holders (Scouts).

### 2. The Colony (Utility)
A tokengated marketplace and governance forum.
*   **Marketplace**: Users burn or hold $ROLL to access discounts on partner hardware.
*   **Proposals**: On-chain voting for "Seed Phase 2" capital allocation (Real Estate/Construction).

---

## 🛠 Technology Stack

*   **Blockchain**: Binance Smart Chain (BSC)
*   **Contracts**: Solidity 0.8.20 (OpenZeppelin Standard)
*   **Frontend**: React + Vite + TailwindCSS
*   **Web3 Integration**: Wagmi + RainbowKit + Viem
*   **Hosting**: Vercel

---

## 🚀 Roadmap

| Phase | Milestone | Status |
| :--- | :--- | :--- |
| **Phase 1** | **Seed Sale & Community Building** | 🟢 **Live** |
| Phase 2 | DEX Listing & Liquidity Lock | 🟡 Pending |
| Phase 3 | Partner Store Integration (Solar/Starlink) | 🟡 In Progress |
| Phase 4 | First Land Acquisition Proposal | ⚪ Q4 2026 |

---

## 🔒 Security & Trust

*   **Liquidity**: 100% of Raised BNB is automatically locked via `LiquidityLocker.sol`.
*   **Audit**: Contracts verified on BscScan.
*   **Team**: KYC Verified (Badge visible in DApp).

---

## 📦 Installation (Developers)

```bash
# Clone the repository
git clone https://github.com/shelbyahobi/roll-token-official-.git

# Install dependencies
npm install

# Run local development server
npm run dev
```

---

*Verified by the ROLL DAO Council.*
