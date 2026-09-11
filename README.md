# Vectrus Scroll-Tied Video Experience

A cinematic, interactive one-page experience recreating the Vectrus scroll-tied video site with pixel-faithful design, precision animations, and hardware-accelerated WebCodecs frame scrubbing.

## Features

- **Full-Viewport Sticky Scene**: 500vh scroll track driving smooth video playback tied directly to scroll progress.
- **Hardware-Accelerated WebCodecs Decoding**: Uses `mp4box` and browser `VideoDecoder` API to extract full-HD video frames into memory, delivering butter-smooth 60fps scrubbing with zero seeking lag.
- **Sequential Text & Overlay Animations**:
  - Section 1: Dynamic fade and entrance for *"Advancing resources for a cleaner future"*.
  - Section 2: Split opacity typography *"We build lasting partnerships with vision and precision across every frontier"*.
  - Section 3: High-contrast white typography *"Fueling ambition, shaping tomorrow"*.
- **Adaptive Navbar**: Smoothly flips theme from dark (`#1D3045`) to light (`white`) past scroll midpoint, with an interactive fullscreen mobile menu.
- **Fluid Responsiveness**: Tailored layout supporting mobile, tablet, and widescreen desktop breakpoints.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3
- **Video Demuxing & Decoding**: `mp4box` (^0.5.2) + WebCodecs API
- **Icons**: `lucide-react`

## Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
git clone <repo-url>
cd vectrus-scroll-video
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```
