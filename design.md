---
name: Lumio
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#615e57'
  on-secondary: '#ffffff'
  secondary-container: '#e7e2d8'
  on-secondary-container: '#67645d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868382'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e7e2d8'
  secondary-fixed-dim: '#cbc6bd'
  on-secondary-fixed: '#1d1b16'
  on-secondary-fixed-variant: '#494740'
  tertiary-fixed: '#e6e2df'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  page-bg: '#FAF9F5'
  panel-bg: '#F0EFEB'
  surface-alt: '#E9E8E4'
  surface-light: '#F4F3EF'
  text-main: '#1B1B1B'
  text-dark: '#151515'
  text-muted: '#8C8880'
  accent-gradient-start: '#FF416C'
  accent-gradient-end: '#FF4B2B'
  status-active: '#22C55E'
typography:
  headline-lg:
    fontFamily: Poppins
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Poppins
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Poppins
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Poppins
    fontSize: 10px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  max-width: 1728px
  section-gap-lg: 200px
  section-gap-md: 120px
  gutter: 32px
  margin-page: 24px
---

## Brand & Style

This design system delivers a warm, minimalist aesthetic tailored for modern creative software. It merges a calm, welcoming atmosphere with crisp, high-contrast typography and subtle glassmorphic depth. 

- **Personality:** Calm, welcoming, professional, and effortlessly modern.
- **Target Audience:** Creative teams, designers, and forward-thinking agencies.
- **Emotional Response:** Reassurance, focus, and a sense of refined craftsmanship.
- **Design Style:** Warm Minimalism combined with selective Glassmorphism.

## Colors

The color palette relies on soft cream and warm beige foundations to create an eye-friendly canvas, punctuated by a deep charcoal primary tone for ultimate legibility. Accents are applied with extreme restraint to guide user focus.

- **Canvas & Surfaces:** Built on `#FAF9F5` with layered panels in `#F0EFEB`, `#E9E8E4`, and `#F4F3EF`.
- **Typography & Structure:** Anchored by `#1B1B1B` and `#151515` for headlines, supported by `#8C8880` for secondary descriptions.
- **Highlights:** A vibrant pink-to-orange gradient (`#FF416C` to `#FF4B2B`) signals creative energy, while `#22C55E` denotes active states.

## Typography

The typography centers exclusively on **Poppins**, leveraging geometric clean lines and rounded letterforms. 

- **Headlines:** Set heavy and tightly tracked to form solid, impactful structural blocks.
- **Body:** Given generous line heights (`1.6`) to ensure exceptional readability across multi-sentence paragraphs.
- **Labels:** Rendered in small, uppercase formats with wide letter-spacing to emulate high-end software interfaces.

## Layout & Spacing

The layout philosophy prioritizes generous whitespace and controlled containment to establish an expensive, calm aesthetic.

- **Grid Model:** Fixed-max container grid capped at 1728px, ensuring content never stretches awkwardly on ultra-wide displays.
- **Rhythm:** Sections utilize expansive vertical breathing room (ranging from 120px to 200px) to prevent visual clutter.
- **Adaptability:** Fluid scaling on mobile and tablet form factors with consistent lateral safety margins.

## Elevation & Depth

Depth is established through a refined blend of glassmorphism and subtle grounding shadows rather than heavy borders.

- **Glassmorphism:** Floating panels use semi-transparent background fills, backdrop blurs, and ultra-thin white borders to simulate frosted glass.
- **Ambient Shadows:** Containers feature soft, diffused dark shadows at their base to lift them gracefully off the warm cream canvas.
- **Interactive Layers:** Elements react to hover states with increased opacity and light diffusion.

## Shapes

The shape language relies heavily on generous corner radiuses to reject aggressive, sharp edges in favor of an inviting, modern feel.

- **Containers & Cards:** Utilize pronounced rounded corners (`rounded-lg` and `rounded-xl`) for a soft, approachable silhouette.
- **Interactive Elements:** Buttons and floating pills adopt fully rounded or pill-shaped geometries.

## Components

- **Buttons:** Pill-shaped and outlined variants that transition smoothly between states. Primary actions utilize solid charcoal or gradient fills with high-contrast text.
- **Navigation:** Floating pill headers featuring dark, semi-transparent backgrounds with backdrop blur and white typography.
- **Input Fields:** Clean, rounded input containers integrated into the warm surface colors with focused ring accents.
- **Cards & Panels:** Elevated containers utilizing glassmorphic blur effects, thin white borders, and soft bottom shadows.
- **Interactive Lists:** Stacked feature rows featuring active gradient indicator lines and muted states for inactive items.
- **Trust Marquee:** Infinitely scrolling partner logos in muted grey that illuminate upon hover.