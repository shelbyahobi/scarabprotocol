# Mobile Audit & Fixes (390px Viewport)

## 1. Hero Component (`frontend/src/components/Hero.jsx`)
- **Issue**: Header text (`h1` and `h2`) was too large (`text-5xl` base for `h1`), which risked word breaking or horizontal overflow on smaller devices for words like "ecological".
- **Fix**: Lowered base font sizes to `text-4xl` for `h1` and `text-3xl` for `h2`, scaling up safely on `sm:` and `md:` breakpoints.

## 2. Navbar Component (`frontend/src/components/Navbar.jsx`)
- **Issue**: The hamburger menu icon had a tap target size of roughly 40px (`p-2` around a 24px icon), which is below the minimum 44x44px accessible tap target guideline.
- **Fix**: Adjusted the padding to `p-3`, extending the touchable area to a compliant 48x48px without shifting the layout.

*Note: All tables and complex cards rely on `flex-col` or grid layouts that natively stack or scroll via `overflow-x-auto` within container constraints on mobile views.*
