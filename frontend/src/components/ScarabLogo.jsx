export default function ScarabLogo({ variant = 'mark', size = 40, className = '' }) {
    const imgUrl = '/images/scarab-logo-minimal.png';

    if (variant === 'wordmark') {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <img src={imgUrl} alt="SCARAB Logo" style={{ width: size, height: size, objectFit: 'contain' }} />
                <div className="flex flex-col leading-none">
                    <span
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 900,
                            letterSpacing: '0.05em',
                            fontSize: `${size * 0.45}px`,
                            color: '#D4A843',
                            lineHeight: 1,
                        }}
                    >
                        SCARAB
                    </span>
                    <span
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            letterSpacing: '0.18em',
                            fontSize: `${size * 0.2}px`,
                            color: '#1DB954',
                            lineHeight: 1.4,
                        }}
                    >
                        PROTOCOL
                    </span>
                </div>
            </div>
        );
    }

    if (variant === 'coin') {
        return (
            <div className={`rounded-full overflow-hidden bg-black border border-beetle-gold/30 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
                 <img src={imgUrl} alt="SCARAB Coin" style={{ width: size * 0.8, height: size * 0.8, objectFit: 'contain' }} />
            </div>
        );
    }

    // Default: mark only
    return <img src={imgUrl} alt="SCARAB Mark" className={className} style={{ width: size, height: size, objectFit: 'contain' }} />;
}
