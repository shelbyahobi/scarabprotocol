/**
 * SCARAB Protocol — Official Brand Mark
 * SVG component — scales perfectly from 16px favicon to 500px hero.
 * Variants:
 *   mark     — hexagon + beetle icon only
 *   wordmark — icon + "SCARAB PROTOCOL" text (horizontal lockup)
 *   coin     — circular coin version for token visual
 */
export default function ScarabLogo({ variant = 'mark', size = 40, className = '' }) {

    const MarkSVG = ({ sz }) => (
        <svg
            width={sz}
            height={sz}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* --- Hexagon Background --- */}
            <polygon
                points="50,4 93,27.5 93,72.5 50,96 7,72.5 7,27.5"
                fill="#0D1F0F"
                stroke="#D4A843"
                strokeWidth="3"
            />

            {/* --- Inner circle ring --- */}
            <circle cx="50" cy="50" r="34" fill="#0A1A0C" stroke="#D4A843" strokeWidth="1.5" />

            {/* --- Circuit board traces (background layer) --- */}
            <g stroke="#1DB954" strokeWidth="0.8" opacity="0.5">
                <line x1="22" y1="50" x2="30" y2="50" />
                <line x1="70" y1="50" x2="78" y2="50" />
                <line x1="22" y1="50" x2="22" y2="44" />
                <line x1="78" y1="50" x2="78" y2="56" />
                <circle cx="22" cy="44" r="1.5" fill="#1DB954" />
                <circle cx="78" cy="56" r="1.5" fill="#1DB954" />
                <line x1="50" y1="16" x2="50" y2="25" />
                <line x1="50" y1="75" x2="50" y2="84" />
            </g>

            {/* --- Beetle Body (abdomen) --- */}
            <ellipse
                cx="50" cy="56" rx="13" ry="16"
                fill="#D4A843"
                stroke="#B8890A"
                strokeWidth="1"
            />

            {/* --- Beetle elytra split line --- */}
            <line x1="50" y1="40" x2="50" y2="72" stroke="#0D1F0F" strokeWidth="1.2" />

            {/* --- Beetle Thorax --- */}
            <ellipse cx="50" cy="42" rx="10" ry="7" fill="#D4A843" stroke="#B8890A" strokeWidth="1" />

            {/* --- Beetle Head --- */}
            <ellipse cx="50" cy="32" rx="7" ry="6" fill="#1DB954" stroke="#15803d" strokeWidth="1" />

            {/* --- Beetle Antennae --- */}
            <line x1="47" y1="27" x2="39" y2="20" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="53" y1="27" x2="61" y2="20" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="38" cy="19" r="1.5" fill="#D4A843" />
            <circle cx="62" cy="19" r="1.5" fill="#D4A843" />

            {/* --- Beetle Legs (3 per side) --- */}
            {/* Left legs */}
            <line x1="38" y1="46" x2="28" y2="41" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="37" y1="53" x2="26" y2="51" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="38" y1="60" x2="27" y2="63" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />
            {/* Right legs */}
            <line x1="62" y1="46" x2="72" y2="41" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="63" y1="53" x2="74" y2="51" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="62" y1="60" x2="73" y2="63" stroke="#D4A843" strokeWidth="1.2" strokeLinecap="round" />

            {/* --- Leaf shape on abdomen (Regeneration symbol) --- */}
            <ellipse cx="50" cy="56" rx="5" ry="7" fill="#1DB954" opacity="0.85" />
            <line x1="50" y1="49" x2="50" y2="63" stroke="#0D1F0F" strokeWidth="0.8" />
        </svg>
    );

    if (variant === 'coin') {
        return (
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                {/* Coin outer ring */}
                <circle cx="50" cy="50" r="48" fill="#0D1F0F" stroke="#D4A843" strokeWidth="4" />
                {/* Coin inner ring */}
                <circle cx="50" cy="50" r="40" fill="#0A1A0C" stroke="#D4A843" strokeWidth="1" />
                {/* Beetle head (green) */}
                <ellipse cx="50" cy="32" rx="7" ry="6" fill="#1DB954" />
                {/* Antennae */}
                <line x1="47" y1="27" x2="38" y2="19" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="53" y1="27" x2="62" y2="19" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="37" cy="18" r="2" fill="#D4A843" />
                <circle cx="63" cy="18" r="2" fill="#D4A843" />
                {/* Thorax */}
                <ellipse cx="50" cy="42" rx="10" ry="7" fill="#D4A843" />
                {/* Abdomen */}
                <ellipse cx="50" cy="57" rx="13" ry="16" fill="#D4A843" />
                <line x1="50" y1="40" x2="50" y2="73" stroke="#0D1F0F" strokeWidth="1.2" />
                {/* Leaf */}
                <ellipse cx="50" cy="57" rx="5" ry="7" fill="#1DB954" opacity="0.9" />
                {/* Legs */}
                <line x1="38" y1="46" x2="27" y2="40" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="37" y1="54" x2="25" y2="52" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="38" y1="62" x2="26" y2="66" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="62" y1="46" x2="73" y2="40" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="63" y1="54" x2="75" y2="52" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="62" y1="62" x2="74" y2="66" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        );
    }

    if (variant === 'wordmark') {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <MarkSVG sz={size} />
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

    // Default: mark only
    return <MarkSVG sz={size} />;
}
