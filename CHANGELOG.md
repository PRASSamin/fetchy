# Changelog

All notable changes to this project will be documented in this file.

### [Version 3.1.0] | 2025-11-07

### Added

- Instagram Downloader: Added support for downloading highlights 
- Facebook Downloader: Added support for downloading highlights 

### Fixed

- Fixed an issue with geo-location logging not working correctly 

### [Version 3.0.2] | 2025-08-26

### Added

- **Enhanced Content Support**: Introduced capabilities to fetch content from public Instagram and Facebook pages that may require a logged-in session to view.
- **New Blog Content**: Published three new articles to improve SEO:
  - _How to Download Instagram Posts & Carousels in HD_
  - _How to Save Just the Audio from a TikTok (MP3)_
  - _How to Download TikTok Slideshows as a Single Video_

### Fixed

- **Site Metadata**: Corrected sitewide metadata to ensure accurate information and improve social media link previews.

### [Version 3.0.1] | 2025/07/28

### Changes

- UI/UX Improvements

## [Version 3.0.0 – "Neon"] | 2025/07/10

### Neon Release

- **Project Restructure**: Full repo architecture revamped for clarity, scalability, and better DX.
- **Tailwind CSS v4 + Next.js 15.3**: Migrated to latest stable releases for both, unlocking new performance and design improvements.
- **New Blog System (powered by FumaDocs)**:
  - MDX-based blog structure with SEO-optimized metadata.
  - Rich Google-compatible content feed for better search discoverability.
- **Dynamic Tool Metadata Handling**:
  - Each tool now has a dedicated `meta.ts` file to store its frontmatter.
  - Frontmatter is dynamically consumed instead of hardcoded—cleaner, modular, easier to scale.
- **Custom Next.js Plugin System** (heavily inspired by FumaDocs):
  - `frontmatter` plugin: Automatically updates `updatedAt` on file or dependency changes.
  - `mapper` plugin: Collects and maps all tool metadata into a central store.
- **New Design**:
  - Fully redesigned UI/UX with a clean, bold aesthetic.
  - Better accessibility, theming, and responsive support across the board.
- **Unified API Response Format**:
  - All `/api/dl` routes now return consistent shape and structure across all tools.
- **Versioning Scheme Overhaul**:
  - Major releases are now named after periodic table elements (like Android’s candy names).
  - This release is dubbed **“Neon” (v3.0.0)**

## [Version 2.2.3] | 2025/06/15

### Changes

- Improved logger vault performance
- Fixed Facebook API compatibility issues
- Enhanced error handling

## [Version 2.2.2] | 2025/06/13

### Changes

**Architectural Improvements**

- Project Restructuring
  - Implemented Next.js advanced directory structure to enhance code organization and maintainability
  - Optimized project layout following modern React best practices

**Performance & Infrastructure**

- Rate Limiting
  - Removed custom rate limiting implementation in favor of Vercel's native rate limiting solution.

- Caching System
  - Migrated from traditional Redis to Upstash's HTTP-based Redis solution
  - Improved compatibility with serverless environments
  - Enhanced logging performance and reliability and latency.

## [Version 2.2.1] | 2025/06/12

### Added

- **Error Logger Vault**
  - Introduced a comprehensive admin dashboard for monitoring and managing system errors

### Fixed

- Enhanced Facebook API endpoint compatibility with live video URLs
- Improved Instagram API endpoint to support both `/reels/` and `/reel/` URL formats
- Improved error handling for malformed API requests

### Changed

- Optimized database queries in the error logging system for improved performance
- Updated project license from MIT to Business Source License 1.1

## [Version 2.2.0] | 2025/06/07

### Changes:

- Enhanced UI & UX.
- Refactored and optimized TikTok downloader for improved performance.
- Resolved bugs and improved overall stability.

## [Version 2.1.2] | 2025/05/30

### Changes:

- Optimized UI & UX.
- Added Minimal ads.
- Introduced new security layer on API.

## [Version 2.1.0] | 2025/05/27

### Changes:

- Changed the branding of the project from **Pownloader** to **Fetchy**.

## [Version 2.0.1] | 2024/12/24

### Initial Release

The first version of **Pownloader** is now live! Download videos and photos in high quality from your favorite platforms with ease.

#### Features:

- **Facebook Downloader**:
  - Download stories.
  - Download reels and videos.

- **Instagram Downloader**:
  - Download posts.
  - Download reels and videos.

- **TikTok Downloader**:
  - Download music.
  - Download videos.
  - Download slideshows.
