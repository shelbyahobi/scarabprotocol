/**
 * SCARAB Protocol — Currency Utilities
 * 
 * All EUR amounts are stored as INTEGER CENTS in Redis and PostgreSQL.
 * This prevents floating-point rounding errors in financial calculations.
 * Display layer divides by 100.
 */

/**
 * Convert integer cents to a locale-formatted display string.
 * @param {number} cents - Integer cents (e.g. 2450 = €24.50)
 * @param {string} [locale='de-DE'] - BCP 47 locale tag
 * @returns {string} Formatted string e.g. "24,50 €"
 */
function centsToDisplay(cents, locale = 'de-DE') {
    if (!Number.isInteger(cents)) {
        throw new Error(`centsToDisplay: expected integer, got ${typeof cents} (${cents})`);
    }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(cents / 100);
}

/**
 * Convert a user-input display string to integer cents.
 * Handles both comma-decimal (German) and dot-decimal (English) formats.
 * @param {string} str - User input e.g. "24,50" or "24.50"
 * @returns {number} Integer cents e.g. 2450
 */
function displayToCents(str) {
    if (typeof str !== 'string') {
        throw new Error(`displayToCents: expected string, got ${typeof str}`);
    }
    // Normalise: strip currency symbols/spaces, replace comma with dot
    const cleaned = str.replace(/[€\s]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) {
        throw new Error(`displayToCents: cannot parse "${str}" as a number`);
    }
    return Math.round(parsed * 100);
}

module.exports = { centsToDisplay, displayToCents };
