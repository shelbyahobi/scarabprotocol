import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ExternalLink, CheckCircle, Star, Zap, 
    Droplet, Sprout, Radio, Shield, Package 
} from 'lucide-react';
import { calculateSavings } from '../data/marketplaceProducts';

const CATEGORY_ICONS = {
    energy: Zap,
    water: Droplet,
    food: Sprout,
    comms: Radio,
    security: Shield
};

export default function ProductCard({ product, isHolder }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    const {
        name,
        brand,
        category,
        image,
        price,
        holderRebate,
        partnerUrl,
        features,
        isPriority,
        scarabProduct
    } = product;
    
    const { finalPrice, savings } = calculateSavings(price, holderRebate, isHolder);
    const CategoryIcon = CATEGORY_ICONS[category] || Package;
    
    const handleImageLoad = () => {
        setImageLoaded(true);
    };
    
    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true); // Stop showing loading state
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`
                product-card bg-black/40 border rounded-3xl overflow-hidden transition-all group
                ${isPriority 
                    ? 'border-beetle-gold/30 shadow-[0_0_30px_rgba(212,175,67,0.15)]' 
                    : 'border-white/10'
                }
                hover:border-beetle-electric/30 hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] hover:scale-[1.02]
            `}
        >
            
            {/* Image Section */}
            <div className="relative bg-black/60 aspect-[4/3] overflow-hidden">
                
                {/* Loading Skeleton */}
                <AnimatePresence>
                    {!imageLoaded && !imageError && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <motion.div
                                        animate={{ 
                                            rotate: 360,
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                            scale: { duration: 1.5, repeat: Infinity }
                                        }}
                                        className="mb-4"
                                    >
                                        <CategoryIcon size={48} className="text-beetle-gold/30" />
                                    </motion.div>
                                    <div className="text-gray-500 text-sm font-medium">Loading...</div>
                                </div>
                            </div>
                            
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Actual Image or Fallback */}
                {!imageError && image ? (
                    <motion.img
                        src={image}
                        alt={name}
                        loading="lazy"
                        decoding="async"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: imageLoaded ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    // Branded Fallback
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1A0F] to-[#050A05] relative overflow-hidden"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-beetle-gold"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>
                        
                        {/* Icon */}
                        <div className="relative z-10 text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-beetle-gold/10 rounded-2xl flex items-center justify-center border border-beetle-gold/20">
                                <CategoryIcon size={48} className="text-beetle-gold" />
                            </div>
                            <div className="text-white font-bold text-lg mb-1">{brand}</div>
                            <div className="text-gray-400 text-sm">{name}</div>
                        </div>
                        
                        {/* Noise Texture */}
                        <div 
                            className="absolute inset-0 opacity-20 mix-blend-overlay"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                                backgroundSize: '200px 200px'
                            }}
                        />
                    </motion.div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    {scarabProduct && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-beetle-green text-black px-3 py-1.5 rounded-full text-xs font-black uppercase backdrop-blur-sm shadow-lg"
                        >
                            SCARAB Hardware
                        </motion.div>
                    )}
                    {isPriority && !scarabProduct && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-beetle-gold text-black px-3 py-1.5 rounded-full text-xs font-black uppercase shadow-lg"
                        >
                            Featured Partner
                        </motion.div>
                    )}
                    {isHolder && holderRebate && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-beetle-electric/90 text-black px-3 py-1.5 rounded-full text-xs font-black uppercase backdrop-blur-sm shadow-lg"
                        >
                            {(holderRebate * 100).toFixed(0)}% OFF
                        </motion.div>
                    )}
                </div>
                
                {/* Priority Star */}
                {isPriority && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="absolute top-4 right-4 z-20"
                    >
                        <Star className="text-beetle-gold fill-beetle-gold" size={24} />
                    </motion.div>
                )}
            </div>
            
            {/* Content Section */}
            <div className="p-6">
                
                {/* Brand */}
                <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                        {brand}
                    </div>
                </div>
                
                {/* Product Name */}
                <h3 className="text-xl font-black text-white mb-4 min-h-[3.5rem] leading-tight">
                    {name}
                </h3>
                
                {/* Features */}
                <div className="space-y-2.5 mb-6">
                    {features.slice(0, 3).map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (idx * 0.1) }}
                            className="flex items-start gap-2.5 text-sm text-gray-400"
                        >
                            <CheckCircle className="text-beetle-green mt-0.5 shrink-0" size={15} />
                            <span className="leading-snug">{feature}</span>
                        </motion.div>
                    ))}
                </div>
                
                {/* Pricing */}
                <div className="mb-6">
                    {isHolder && holderRebate ? (
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-beetle-gold">
                                    ${finalPrice.toLocaleString()}
                                </span>
                                <span className="text-gray-500 line-through text-lg">
                                    ${price.toLocaleString()}
                                </span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-beetle-gold font-bold"
                            >
                                💰 You save ${savings.toLocaleString()} with holder rebate
                            </motion.div>
                        </div>
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white">
                                ${price.toLocaleString()}
                            </span>
                            {holderRebate && (
                                <span className="text-xs text-gray-500">
                                    ({(holderRebate * 100).toFixed(0)}% off for holders)
                                </span>
                            )}
                        </div>
                    )}
                </div>
                
                {/* CTA Button */}
                <motion.a
                    href={partnerUrl}
                    target={scarabProduct ? '_self' : '_blank'}
                    rel={scarabProduct ? '' : 'noopener noreferrer'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full bg-beetle-electric text-black font-black py-4 rounded-xl hover:bg-beetle-electric/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                >
                    {scarabProduct ? 'Pre-Order Now' : 'View Product'}
                    <ExternalLink size={18} />
                </motion.a>
                
                {/* Holder Unlock CTA */}
                {!isHolder && holderRebate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-4 text-center"
                    >
                        <a 
                            href="/seed-sale" 
                            className="text-xs text-beetle-gold hover:underline inline-flex items-center gap-1"
                        >
                            🔓 Unlock {(holderRebate * 100).toFixed(0)}% rebate
                        </a>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
