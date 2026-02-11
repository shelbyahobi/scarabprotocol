import { motion } from 'framer-motion';

export default function Ticker() {
    return (
        <div className="w-full bg-[#050a05] border-b border-beetle-gold/20 overflow-hidden py-2 relative z-50">
            <div className="flex items-center gap-8 whitespace-nowrap animate-infinite-scroll">
                {/* Content duplicated for seamless scroll if needed, or just static centered for now */}
                <div className="flex items-center justify-center w-full gap-8 md:gap-16 text-xs md:text-sm font-mono text-beetle-gold/80">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        LIVE
                    </span>
                    <span>SUPPLY: <span className="text-white">1,000,000,000</span></span>
                    <span className="text-gray-600">|</span>
                    <span>MARKET CAP: <span className="text-white">$ ---</span></span>
                    <span className="text-gray-600">|</span>
                    <span>LIQUIDITY: <span className="text-beetle-electric">LOCKED (1 YR)</span></span>
                    <span className="text-gray-600">|</span>
                    <span>HOLDERS: <span className="text-white">---</span></span>
                    <span className="text-gray-600">|</span>
                    <span className="text-beetle-electric font-bold">ROLL PROTOCOL 2026</span>
                </div>
            </div>
        </div>
    );
}
