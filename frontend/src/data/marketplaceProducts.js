/**
 * SCARAB Protocol - The Armory
 * Institutional Supply Chain for Off-Grid Sovereignty
 * 
 * Product Curation Guidelines:
 * - Priority Partners: Vetted brands with established reputation
 * - Holder Rebates: 5-20% discount for ≥1000 SCARAB holders
 * - Image Usage: Affiliate press kits or generic category images
 * - Affiliate Links: Track via ?ref=scarab parameter
 */

export const MARKETPLACE_CATEGORIES = {
    energy: {
        name: 'Energy',
        emoji: '⚡',
        description: 'Solar, batteries, generators',
        tagline: 'Power independence for any location'
    },
    water: {
        name: 'Water',
        emoji: '💧',
        description: 'Purification, storage, collection',
        tagline: 'Clean water without infrastructure'
    },
    food: {
        name: 'Food',
        emoji: '🌱',
        description: 'Preservation, production, storage',
        tagline: 'Long-term food security systems'
    },
    comms: {
        name: 'Communications',
        emoji: '📡',
        description: 'Satellite, mesh, emergency',
        tagline: 'Stay connected off-grid'
    },
    security: {
        name: 'Security',
        emoji: '🔒',
        description: 'Surveillance, access control',
        tagline: 'Protect your sovereign perimeter'
    }
};

export const MARKETPLACE_PRODUCTS = {
    energy: [
        // SCARAB Native Hardware
        {
            id: 'scarab-solar-sentinel-v1',
            name: 'Solar Sentinel V1',
            brand: 'SCARAB Protocol',
            category: 'energy',
            image: '/images/products/solar-sentinel.jpg',
            price: 349,
            holderRebate: 0.10, // 10% for holders
            partnerUrl: '/products#solar-sentinel',
            scarabProduct: true,
            isPriority: true,
            features: [
                'Integrated pyranometer (±3% accuracy)',
                'ATECC608A cryptographic signing',
                'WiFi + LoRaWAN dual-stack',
                'Earns SCARAB token rewards',
                '2,400 BRU/year baseline'
            ],
            specs: {
                compute: 'ESP32-S3 @ 240MHz',
                sensor: 'INA226 high-side current/power',
                security: 'Hardware secure element (ECC P-256)',
                connectivity: 'WiFi 2.4GHz + LoRaWAN 915MHz',
                power: 'PoE or 12V DC',
                warranty: '2 years'
            }
        },

        // Premium Energy Storage
        {
            id: 'ecoflow-delta-pro-ultra',
            name: 'Delta Pro Ultra',
            brand: 'EcoFlow',
            category: 'energy',
            image: 'https://via.placeholder.com/600x450/1a1a1a/00f0ff?text=EcoFlow+Delta+Pro+Ultra',
            price: 5799,
            holderRebate: 0.05,
            partnerUrl: 'https://us.ecoflow.com/products/delta-pro-ultra?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                '6kWh base (expandable to 90kWh)',
                '7,200W output (240V split-phase)',
                'Solar + vehicle charging',
                'Smart home integration',
                '5-year warranty'
            ],
            specs: {
                capacity: '6,000Wh (LFP battery)',
                output: '7,200W continuous / 14,400W surge',
                recharge: '0-80% in 70 min (AC + solar)',
                solar: 'Up to 5,600W MPPT',
                lifespan: '4,000 cycles to 80%',
                warranty: '5 years'
            }
        },

        {
            id: 'bluetti-ac500-b300s',
            name: 'AC500 + B300S Bundle',
            brand: 'Bluetti',
            category: 'energy',
            image: 'https://via.placeholder.com/600x450/1a1a1a/4ade80?text=Bluetti+AC500',
            price: 4599,
            holderRebate: 0.08,
            partnerUrl: 'https://www.bluettipower.com/products/ac500-b300s?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                '5,000W AC output (10,000W surge)',
                '3,072Wh expandable to 18.4kWh',
                'Dual charging (3,000W solar + AC)',
                'UPS mode (20ms switchover)',
                '6-year warranty'
            ],
            specs: {
                capacity: '3,072Wh base (B300S expansion)',
                output: '5,000W / 10,000W surge',
                solar: '3,000W MPPT (12-150V)',
                battery: 'LiFePO4 (3,500+ cycles)',
                app: 'Bluetooth + WiFi control',
                warranty: '6 years'
            }
        },

        {
            id: 'renogy-400w-solar-kit',
            name: '400W Solar Starter Kit',
            brand: 'Renogy',
            category: 'energy',
            image: 'https://via.placeholder.com/600x450/1a1a1a/d4af37?text=Renogy+Solar+Kit',
            price: 699,
            holderRebate: 0.10,
            partnerUrl: 'https://www.renogy.com/400w-12v-solar-starter-kit/?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                '4× 100W monocrystalline panels',
                'MPPT charge controller (40A)',
                'Complete wiring & connectors',
                'DIY-friendly installation',
                '25-year panel warranty'
            ],
            specs: {
                panels: '4× 100W mono (21% efficiency)',
                controller: 'Rover 40A MPPT',
                cables: '20ft solar cable + adapters',
                output: '1,600Wh/day (4 sun hours)',
                warranty: '25 years (panels) / 5 years (controller)'
            }
        },

        {
            id: 'jackery-explorer-2000-pro',
            name: 'Explorer 2000 Pro',
            brand: 'Jackery',
            category: 'energy',
            image: 'https://via.placeholder.com/600x450/1a1a1a/00f0ff?text=Jackery+2000+Pro',
            price: 1799,
            holderRebate: 0.06,
            partnerUrl: 'https://www.jackery.com/products/explorer-2000-pro?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                '2,160Wh capacity',
                '2,200W AC output',
                'Solar charging ready',
                'Ultra-fast 2-hour recharge',
                '3-year warranty'
            ],
            specs: {
                capacity: '2,160Wh (lithium battery)',
                output: '2,200W AC / 4,400W surge',
                solar: 'Up to 1,400W (6 SolarSaga 200)',
                recharge: '2 hours (AC) / 2.5 hours (solar)',
                warranty: '3 years + 2 year extension'
            }
        }
    ],

    water: [
        {
            id: 'berkey-big-berkey',
            name: 'Big Berkey',
            brand: 'Berkey',
            category: 'water',
            image: 'https://via.placeholder.com/600x450/1a1a1a/4ade80?text=Big+Berkey',
            price: 349,
            holderRebate: 0.12,
            partnerUrl: 'https://www.berkeyfilters.com/products/big-berkey?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                '2.25 gallon capacity',
                'Removes 99.999% of contaminants',
                'No electricity required',
                '6,000 gallon filter lifespan',
                'Portable stainless steel'
            ],
            specs: {
                capacity: '2.25 gallons',
                filters: '2× Black Berkey elements',
                flowRate: '3.5 gal/hour',
                removes: 'Bacteria, viruses, heavy metals, VOCs',
                lifespan: '6,000 gallons per set',
                warranty: 'Lifetime (housing) / 2 years (filters)'
            }
        },

        {
            id: 'lifestraw-community',
            name: 'Community Water Purifier',
            brand: 'LifeStraw',
            category: 'water',
            image: 'https://via.placeholder.com/600x450/1a1a1a/00f0ff?text=LifeStraw+Community',
            price: 180,
            holderRebate: 0.10,
            partnerUrl: 'https://www.lifestraw.com/products/lifestraw-community?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                '100,000 liter capacity',
                '0.02 micron hollow fiber',
                'Gravity-fed (no pumping)',
                'Serves 100 people',
                'BPA-free materials'
            ],
            specs: {
                capacity: '100,000 liters',
                flowRate: '9-12 liters/hour',
                filtration: '0.02 micron (bacteria, parasites)',
                dimensions: '14" × 7.5" × 18"',
                weight: '3.3 lbs',
                warranty: '3 years'
            }
        },

        {
            id: 'waterprepared-55gal-barrel',
            name: '55-Gallon Water Barrel',
            brand: 'WaterPrepared',
            category: 'water',
            image: 'https://via.placeholder.com/600x450/1a1a1a/d4af37?text=Water+Storage+Barrel',
            price: 89,
            holderRebate: 0.15,
            partnerUrl: 'https://www.waterprepared.com/55-gallon-water-barrel?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                '55-gallon BPA-free HDPE',
                'Stackable design',
                'Includes bung wrench & spigot',
                'FDA-approved materials',
                '5-year lifespan guarantee'
            ],
            specs: {
                capacity: '55 gallons (208 liters)',
                material: 'BPA-free HDPE',
                dimensions: '23" diameter × 35" height',
                weight: '22 lbs (empty)',
                color: 'Blue (opaque)',
                warranty: '5 years'
            }
        },

        {
            id: 'sawyer-pointone-filter',
            name: 'PointONE Water Filter',
            brand: 'Sawyer',
            category: 'water',
            image: 'https://via.placeholder.com/600x450/1a1a1a/4ade80?text=Sawyer+Filter',
            price: 45,
            holderRebate: 0.12,
            partnerUrl: 'https://sawyer.com/products/squeeze-water-filtration-system?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                '0.1 micron hollow fiber',
                '100,000 gallon lifespan',
                'Lightweight (2 oz)',
                'Backwashable (unlimited use)',
                'Fits standard bottles'
            ],
            specs: {
                filtration: '0.1 micron absolute',
                flowRate: '1.7 liters/minute',
                weight: '2 ounces',
                lifespan: '100,000 gallons',
                removes: '99.99999% bacteria, 99.9999% protozoa',
                warranty: 'Lifetime'
            }
        }
    ],

    food: [
        {
            id: 'scarab-bokashi-kit-v1',
            name: 'Smart Bokashi Kit',
            brand: 'SCARAB Protocol',
            category: 'food',
            image: '/images/products/bokashi-kit.jpg',
            price: 89,
            holderRebate: 0.10,
            partnerUrl: '/products#bokashi-kit',
            scarabProduct: true,
            isPriority: true,
            features: [
                'Cryptographically verified composting',
                'HX711 weight sensor (50kg capacity)',
                'DS18B20 temperature tracking',
                'Earns SCARAB token rewards',
                '650 BRU/year baseline'
            ],
            specs: {
                compute: 'ESP32-C3 (RISC-V)',
                sensors: 'HX711 (weight), DS18B20 (temp), MQ-135 (gas)',
                capacity: '5 gallons (19 liters)',
                subscription: '$12/month (bokashi bran)',
                warranty: '1 year'
            }
        },

        {
            id: 'harvest-right-medium-freeze-dryer',
            name: 'Medium Freeze Dryer',
            brand: 'Harvest Right',
            category: 'food',
            image: 'https://via.placeholder.com/600x450/1a1a1a/d4af37?text=Harvest+Right+Dryer',
            price: 3295,
            holderRebate: 0.05,
            partnerUrl: 'https://harvestright.com/product/medium-freeze-dryer/?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                '7-10 lbs per batch',
                '25-year shelf life preservation',
                'Retains 97% of nutrients',
                'Automatic cycle detection',
                '3-year warranty'
            ],
            specs: {
                capacity: '7-10 lbs fresh food per batch',
                trayArea: '675 sq inches (4 trays)',
                cycleTime: '24-36 hours average',
                power: '1,500W (115V)',
                dimensions: '25" W × 20.5" D × 28.5" H',
                warranty: '3 years'
            }
        },

        {
            id: 'foodsaver-fm5000',
            name: 'FM5000 Vacuum Sealer',
            brand: 'FoodSaver',
            category: 'food',
            image: 'https://via.placeholder.com/600x450/1a1a1a/00f0ff?text=FoodSaver+FM5000',
            price: 249,
            holderRebate: 0.10,
            partnerUrl: 'https://www.foodsaver.com/product/fm5000-series-vacuum-sealer/?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                'Automatic bag detection',
                'Dual vacuum pumps',
                'Moist/dry food modes',
                'Roll storage & cutter',
                '5-year warranty'
            ],
            specs: {
                vacuum: 'Dual pump (-0.8 bar)',
                sealing: '12" wide bags',
                modes: 'Dry, moist, marinate, canister',
                speed: '2× faster than FM3000',
                dimensions: '17.5" W × 10.5" D × 9.5" H',
                warranty: '5 years'
            }
        },

        {
            id: 'true-leaf-market-seed-vault',
            name: 'Survival Seed Vault',
            brand: 'True Leaf Market',
            category: 'food',
            image: 'https://via.placeholder.com/600x450/1a1a1a/4ade80?text=Seed+Vault',
            price: 119,
            holderRebate: 0.15,
            partnerUrl: 'https://www.trueleafmarket.com/products/survival-seed-vault?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                '30 heirloom varieties',
                'Non-GMO & organic',
                'Vacuum-sealed Mylar',
                '5+ year storage',
                'Enough for 1-acre garden'
            ],
            specs: {
                varieties: '30 vegetables & herbs',
                packaging: 'Mylar bags (vacuum sealed)',
                seeds: '20,000+ seeds total',
                storage: '5+ years (cool, dark, dry)',
                organic: 'USDA Certified Organic',
                warranty: 'Germination guarantee'
            }
        }
    ],

    comms: [
        {
            id: 'starlink-standard-kit',
            name: 'Standard Starlink Kit',
            brand: 'Starlink',
            category: 'comms',
            image: 'https://via.placeholder.com/600x450/1a1a1a/00f0ff?text=Starlink',
            price: 599,
            holderRebate: 0.03,
            partnerUrl: 'https://www.starlink.com/?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                '150+ Mbps download',
                'Global satellite coverage',
                'Portable setup',
                'Built-in WiFi router',
                '$120/month service'
            ],
            specs: {
                download: '50-150 Mbps typical',
                upload: '10-20 Mbps',
                latency: '25-50ms',
                powerConsumption: '50-75W average',
                temperature: '-22°F to 122°F',
                warranty: '1 year'
            }
        },

        {
            id: 'meshtastic-tbeam',
            name: 'T-Beam LoRa Node',
            brand: 'Meshtastic',
            category: 'comms',
            image: 'https://via.placeholder.com/600x450/1a1a1a/4ade80?text=Meshtastic+T-Beam',
            price: 79,
            holderRebate: 0.15,
            partnerUrl: 'https://meshtastic.org/docs/hardware/devices/lilygo/tbeam?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                'Decentralized mesh network',
                '10km+ range (line of sight)',
                'No subscription fees',
                'Open-source firmware',
                'GPS & battery included'
            ],
            specs: {
                radio: 'LoRa 915MHz (US) / 868MHz (EU)',
                range: '10km+ (open terrain)',
                battery: '18650 rechargeable',
                gps: 'Built-in GPS module',
                mesh: 'Up to 100 hops',
                warranty: '6 months'
            }
        },

        {
            id: 'gotenna-pro-x2',
            name: 'goTenna Pro X2',
            brand: 'goTenna',
            category: 'comms',
            image: 'https://via.placeholder.com/600x450/1a1a1a/d4af37?text=goTenna+Pro',
            price: 799,
            holderRebate: 0.10,
            partnerUrl: 'https://gotenna.com/products/pro-x2?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                'Military-grade mesh',
                '10+ mile range',
                'AES-256 encryption',
                'Works with any smartphone',
                '36-hour battery life'
            ],
            specs: {
                frequency: 'VHF 142-175 MHz',
                range: '10+ miles (terrain dependent)',
                battery: '36 hours continuous',
                encryption: 'AES-256',
                waterproof: 'IP67 rated',
                warranty: '2 years'
            }
        },

        {
            id: 'garmin-inreach-mini-2',
            name: 'inReach Mini 2',
            brand: 'Garmin',
            category: 'comms',
            image: 'https://via.placeholder.com/600x450/1a1a1a/00f0ff?text=Garmin+inReach',
            price: 399,
            holderRebate: 0.08,
            partnerUrl: 'https://www.garmin.com/en-US/p/592606?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                'Global satellite messaging',
                'SOS emergency beacon',
                '2-way text communication',
                'GPS tracking',
                '$14.95/month plan available'
            ],
            specs: {
                network: 'Iridium satellite',
                battery: '14 days (10min tracking)',
                weight: '3.5 oz',
                waterproof: 'IPX7 (1 meter, 30 min)',
                sos: '24/7 GEOS monitoring',
                warranty: '1 year'
            }
        }
    ],

    security: [
        {
            id: 'reolink-argus-3-pro-solar',
            name: 'Argus 3 Pro + Solar Panel',
            brand: 'Reolink',
            category: 'security',
            image: 'https://via.placeholder.com/600x450/1a1a1a/4ade80?text=Reolink+Argus',
            price: 139,
            holderRebate: 0.12,
            partnerUrl: 'https://reolink.com/product/argus-3-pro/?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                '2K+ resolution (2560×1440)',
                'Solar-powered (100% wireless)',
                'Color night vision',
                'Local storage (no cloud fees)',
                'Smart person/vehicle detection'
            ],
            specs: {
                resolution: '2560×1440 (4MP)',
                nightVision: 'Spotlights + IR (33ft)',
                storage: 'MicroSD up to 128GB',
                battery: 'Rechargeable (solar sustained)',
                wifi: '2.4/5GHz dual-band',
                warranty: '2 years'
            }
        },

        {
            id: 'ubiquiti-g4-bullet',
            name: 'UniFi Protect G4 Bullet',
            brand: 'Ubiquiti',
            category: 'security',
            image: 'https://via.placeholder.com/600x450/1a1a1a/00f0ff?text=UniFi+G4+Bullet',
            price: 199,
            holderRebate: 0.08,
            partnerUrl: 'https://store.ui.com/products/uvc-g4-bullet?ref=scarab',
            scarabProduct: false,
            isPriority: true,
            features: [
                '4MP resolution (2688×1512)',
                'Self-hosted (no cloud required)',
                'PoE powered',
                'IR night vision (25m)',
                'Integrates with UniFi Protect'
            ],
            specs: {
                resolution: '2688×1512 (4MP)',
                nightVision: 'IR LEDs (25 meters)',
                power: 'PoE 802.3af',
                storage: 'NVR required (sold separately)',
                weatherproof: 'IP67 rated',
                warranty: '1 year'
            }
        },

        {
            id: 'yubikey-5-nfc',
            name: 'YubiKey 5 NFC',
            brand: 'Yubico',
            category: 'security',
            image: 'https://via.placeholder.com/600x450/1a1a1a/d4af37?text=YubiKey+5+NFC',
            price: 55,
            holderRebate: 0.20,
            partnerUrl: 'https://www.yubico.com/product/yubikey-5-nfc/?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                'Hardware 2FA authentication',
                'FIDO2/WebAuthn support',
                'NFC + USB-A',
                'Works with 1Password, Bitwarden',
                'Wallet security essential'
            ],
            specs: {
                protocols: 'FIDO2, U2F, OTP, OpenPGP, PIV',
                interface: 'USB-A + NFC',
                compatibility: 'Windows, Mac, Linux, iOS, Android',
                durability: 'Waterproof, crushproof',
                lifespan: 'No battery (unlimited)',
                warranty: '2 years'
            }
        },

        {
            id: 'ring-alarm-pro',
            name: 'Alarm Pro Security Kit',
            brand: 'Ring',
            category: 'security',
            image: 'https://via.placeholder.com/600x450/1a1a1a/4ade80?text=Ring+Alarm+Pro',
            price: 299,
            holderRebate: 0.06,
            partnerUrl: 'https://ring.com/products/alarm-pro-8-piece-kit?ref=scarab',
            scarabProduct: false,
            isPriority: false,
            features: [
                '8-piece starter kit',
                'Built-in eero WiFi 6 router',
                'Cellular backup',
                '24/7 professional monitoring',
                '$20/month monitoring plan'
            ],
            specs: {
                kit: 'Base station, keypad, 4 sensors, 2 motion, range extender',
                connectivity: 'WiFi + cellular backup',
                monitoring: 'Optional 24/7 ($20/mo)',
                router: 'eero 6 WiFi (covers 1,500 sqft)',
                battery: 'Backup battery (24 hours)',
                warranty: '1 year'
            }
        }
    ]
};

// Helper function to get all products
export function getAllProducts() {
    return Object.values(MARKETPLACE_PRODUCTS).flat();
}

// Helper function to get products by category
export function getProductsByCategory(category) {
    return MARKETPLACE_PRODUCTS[category] || [];
}

// Helper function to get SCARAB native products
export function getScarabProducts() {
    return getAllProducts().filter(p => p.scarabProduct);
}

// Helper function to get priority partners
export function getPriorityProducts() {
    return getAllProducts().filter(p => p.isPriority);
}

// Helper function to calculate savings
export function calculateSavings(price, holderRebate, isHolder) {
    if (!isHolder || !holderRebate) return { finalPrice: price, savings: 0 };
    const savings = price * holderRebate;
    return {
        finalPrice: price - savings,
        savings: savings
    };
}
