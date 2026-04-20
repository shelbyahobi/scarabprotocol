/**
 * SCARAB Protocol — Notification Service
 * backend/utils/notificationService.js
 */

const THRESHOLDS = {
    LID_OPEN_WARN_SECONDS: 1800 // 30 minutes
};

/**
 * Process telemetry for lid-open notifications.
 * 
 * Rules:
 *   - Short opens (< 5 min) are silent (normal feeding).
 *   - Medium opens (5-30 min) are silent (at-risk but acceptable).
 *   - Long opens (>= 30 min) trigger a warning notification.
 * 
 * @param {Object} telemetry - Telemetry data including lid_open_seconds
 * @param {Array} notifications - Array to push new notifications to
 */
function processLidNotifications(telemetry, notifications) {
    if (telemetry.lid_open_seconds === undefined) return;

    // Lid-open: START a session, do not suppress data collection
    // Lid-open warning fires only if duration > THRESHOLDS.LID_OPEN_WARN_SECONDS (1800s)
    // Short opens (adding waste/bran) are expected — no warning for <5 minutes
    if (telemetry.lid_open_seconds > 300 && telemetry.lid_open_seconds < THRESHOLDS.LID_OPEN_WARN_SECONDS) {
        // Silent — normal feeding event
    } else if (telemetry.lid_open_seconds >= THRESHOLDS.LID_OPEN_WARN_SECONDS) {
        notifications.push({
            type: 'warning',
            category: 'lid',
            title: 'Lid left open — fermentation at risk',
            body: `Lid open for ${Math.round(telemetry.lid_open_seconds/60)} minutes.`,
            advice: 'Close the lid to maintain anaerobic conditions. Short opens for feeding are fine.'
        });
    }
}

module.exports = {
    processLidNotifications,
    THRESHOLDS
};
