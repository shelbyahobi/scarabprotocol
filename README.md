# $ROLL - The Dung Beetle Project 🪲

![ROLL Banner](https://placehold.co/1200x300/d4af37/000000?text=$ROLL:+Organic+Commerce+Revolution)

> **Bridging meme culture with real-world organic commerce.**  
> $ROLL is a community-driven ecosystem powered by the Binance Smart Chain (BSC), featuring decentralized governance, yield-generating NFTs, and a bonding curve seed sale.

---

## 📜 Table of Contents
- [About](#-about)
- [Key Features](#-key-features)
- [Ecosystem](#-ecosystem)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Smart Contracts](#-smart-contracts)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 About

$ROLL isn't just another meme coin. It represents a movement towards **Organic Commerce**—using decentralized finance (DeFi) to fund and support real-world agricultural initiatives. The protocol is designed to be deflationary, sustainable, and governed entirely by its holders.

Our mission is to create a self-sustaining economy where digital assets catalyze tangible, improved outcomes in the physical world.

## 🚀 Key Features

*   **Fair Launch Seed Sale**: A transparent bonding curve mechanism ensures fair price discovery for early adopters.
*   **Colony Staking**: Stake your $ROLL tokens to earn yield and governance power.
*   **Bonding Mechanism**: Innovative treasury growth strategies to back the token floor price.
*   **DAO Governance**: Only $ROLL holders decide the future of the protocol. No admin keys, no backdoors.
*   **Deflationary Tokenomics**: Automated buybacks and burns funded by ecosystem revenue.

## 💎 Ecosystem

### 1. The Seed Sale
An exclusive opportunity to acquire $ROLL at the ground floor. The sale uses a linear bonding curve, rewarding the earliest supporters with the best possible entry price.

### 2. The Colony (Dashboard)
Your command center. View your holdings, claim rewards, participate in governance, and track the overall health of the ecosystem.

### 3. Governance
We are building towards a fully on-chain DAO where proposals are submitted and voted on by the community.

---

## 💻 Technology Stack

*   **Blockchain**: Binance Smart Chain (BSC)
*   **Smart Contracts**: Solidity (Hardhat Framework)
*   **Frontend**: React.js + Vite
*   **Styling**: TailwindCSS + Framer Motion
*   **Web3 Integration**: Wagmi + Viem + RainbowKit
*   **Deployment**: Vercel (Frontend) / Hardhat Ignition (Contracts)

---

## 🛠 Getting Started

### Prerequisites
*   Node.js (v18+)
*   NPM or Yarn
*   Metamask (or any Web3 Wallet)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shelbyahobi/roll-token-official-.git
    cd roll-token-official-
    ```

2.  **Install Frontend Dependencies**
    ```bash
    cd frontend
    npm install
    ```

3.  **Run Local Development Server**
    ```bash
    npm run dev
    ```
    Access the dApp at `http://localhost:5173`.

---

## ⛓ Smart Contracts

The core logic of the ecosystem lives in the `contracts/` directory.

### Setup
```bash
cd contracts
npm install
npx hardhat compile
```

### Deployment (Testnet)
1.  Create a `.env` file in `contracts/`:
    ```env
    PRIVATE_KEY=your_deployer_private_key
    BSCSCAN_API_KEY=your_api_key
    ```
2.  Deploy to BSC Testnet:
    ```bash
    npx hardhat run scripts/deploy.js --network bscTestnet
    ```

---

## 🗺 Roadmap

| Phase | Status | Goal |
| :--- | :--- | :--- |
| **Phase 1** | 🟢 Active | Concept, Smart Contract Development, Seed Sale Launch |
| **Phase 2** | 🟡 Pending | Audit, Mainnet Deployment, PancakeSwap Listing |
| **Phase 3** | ⚪ Planned | Staking Platform, Governance DAO, Marketing Push |
| **Phase 4** | ⚪ Planned | Real-world Agtech Partnerships, Global Expansion |

---

## 🤝 Contributing

We welcome contributions from the community!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by the $ROLL Community.*
