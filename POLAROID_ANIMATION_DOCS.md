# 🎨 Awwwards-Level 3D Polaroid Hero Animation

## Overview
This is a premium, production-ready interactive 3D hero section featuring a Polaroid camera model with Awwwards-quality animations and visual effects. Built with Three.js, React Three Fiber, and GSAP.

---

## ✨ Features Implemented

### 🎨 Premium Visual Design
- **Gradient Background**: Soft gradient from `#f8f9ff` (top) to `#e4e7f5` (bottom)
- **Vignetting**: Subtle darkening toward edges for depth (8% opacity radial gradient)
- **Film Grain Overlay**: Light grain effect (3% opacity) for editorial photography aesthetic
- **Bloom Effect**: Soft glow/shine on the 3D model for premium polish

### 💡 Advanced Lighting System
- **Physically Correct Lighting**: Enabled with ACESFilmic tone mapping
- **Mouse-Following Spotlight**: Dynamic key light that smoothly tracks cursor position
  - Uses GSAP-style easing (lerp interpolation)
  - Intensity: 250 (default) → 350 (on hover)
- **Ambient Light**: Soft base illumination (0.4 intensity, #f0f4ff tint)
- **Rim Lights**: Two directional lights for depth and dimension
- **Contact Shadows**: Realistic soft shadows under the model

### 🎭 3D Model Animations

#### Idle Behavior
- **Floating**: Smooth Y-axis oscillation (sine wave, 0.8 speed)
- **Rotation**: Gentle continuous spin (0.002 rad/frame)
- **Mouse Parallax**: Model tilts based on cursor position (15% influence)

#### Scroll-Triggered Animations (GSAP ScrollTrigger)
1. **Intro Animation** (on page load):
   - Scale: 0.8 → 1.0
   - Rotation: -15° → 0°
   - Opacity: 0 → 1
   - Duration: 1.5s with `power3.out` easing

2. **Mid-Scroll Flip** (at 40% scroll progress):
   - Rotates 180° to show back of Polaroid
   - Returns to front at 55% scroll
   - Smooth `power2.inOut` easing

#### Interactive Hover Effects
- **Brightness**: Spotlight intensifies (+100 intensity)
- **Z-Depth**: Model moves forward 0.5 units
- **Smooth Transitions**: All changes lerp-interpolated

### 📹 Camera System
- **Parallax Effect**: Camera subtly follows mouse (50% influence)
- **Default Position**: [0, 0, 12] with 50° FOV
- **Smooth Movement**: Lerp interpolation for cinematic feel

---

## 🛠 Technical Stack

### Core Dependencies
```json
{
  "@react-three/fiber": "^9.4.0",
  "@react-three/drei": "^10.7.7",
  "@react-three/postprocessing": "latest",
  "three": "^0.181.2",
  "gsap": "^3.13.0"
}
```

### Key Technologies
- **Three.js**: 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components (useGLTF, Environment, ContactShadows)
- **@react-three/postprocessing**: Bloom effect
- **GSAP**: ScrollTrigger and timeline animations

---

## 📁 File Structure

```
src/
├── components/
│   └── PolaroidScene.jsx      # Main 3D scene component
├── assets/
│   └── polaroid_camera.glb    # 3D model file
└── index.css                   # Styles (gradient, vignette, grain)
```

---

## 🎯 Component Architecture

### Main Components

1. **`<PolaroidScene />`** - Root component
   - Manages mouse position state
   - Handles hover detection
   - Sets up Canvas with tone mapping

2. **`<Scene />`** - Three.js scene setup
   - Lighting rig
   - Model instance
   - Camera controller

3. **`<PolaroidModel />`** - 3D model controller
   - GLTF loading
   - Animation loops
   - ScrollTrigger integration

4. **`<MouseSpotlight />`** - Interactive key light
   - Cursor tracking
   - GSAP-style easing
   - Intensity modulation

5. **`<CameraController />`** - Camera parallax
   - Smooth cursor following
   - Position interpolation

---

## 🎨 CSS Classes

### `.polaroid-scene-container`
- Absolute positioned canvas container
- Premium gradient background
- Full viewport coverage

### `.film-grain-overlay`
- SVG-based procedural grain texture
- Animated with subtle movement
- 3% opacity, overlay blend mode

### `.vignette-overlay`
- Radial gradient from center
- 8% opacity black at edges
- Multiply blend mode for depth

---

## 🚀 Usage

### Basic Implementation
```jsx
import PolaroidScene from './components/PolaroidScene';

function Hero() {
  return (
    <section className="hero">
      <PolaroidScene />
      <h1>Your Content</h1>
    </section>
  );
}
```

### Required CSS
```css
.hero {
  position: relative;
  height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #e4e7f5 100%);
}
```

---

## ⚙️ Configuration Options

### Lighting Adjustments
```jsx
// In <MouseSpotlight />
<spotLight
  intensity={250}        // Default intensity
  angle={0.6}           // Spotlight cone angle
  penumbra={0.8}        // Edge softness
/>
```

### Animation Timing
```jsx
// Floating speed
Math.sin(elapsed * 0.8)  // Change 0.8 to adjust speed

// Rotation speed
groupRef.current.rotation.y += 0.002  // Increase for faster spin
```

### Scroll Trigger Points
```jsx
// Flip animation start/end
if (progress >= 0.35 && progress <= 0.55) {
  // Adjust these values to change when flip occurs
}
```

---

## 🎥 Performance Optimizations

1. **Model Preloading**: `useGLTF.preload()` prevents load flicker
2. **Shadow Map Size**: 2048×2048 for crisp shadows
3. **Lerp Interpolation**: Smooth animations without performance hit
4. **Bloom Threshold**: Set to 0.8 to only glow highlights
5. **Clock Management**: Single clock instance per model

---

## 🐛 Troubleshooting

### Model Not Appearing
- Verify `.glb` file path in import
- Check browser console for loading errors
- Ensure model is centered (centering code in `useEffect`)

### Animations Stuttering
- Reduce `lerp` factor values (e.g., 0.05 → 0.03)
- Decrease bloom radius
- Lower shadow map size if on low-end hardware

### Scroll Triggers Not Firing
- Ensure parent has enough scroll distance
- Check that `.hero` class is applied
- Verify GSAP ScrollTrigger is registered

---

## 🎬 Animation Timeline

```
Page Load:
  0.0s → Model opacity 0→1, scale 0.8→1
  0.0s → Rotation -15°→0°
  Continuous → Floating + idle rotation

Scroll:
  0-35%   → Idle state
  35-55%  → Flip to back (180° rotation)
  55-75%  → Return to front (360° rotation)
  75-100% → Idle state

Hover:
  Enter → Spotlight +100, Z +0.5
  Exit  → Smooth return to default
```

---

## 🎨 Design Tokens

```css
/* Gradient */
--gradient-top: #f8f9ff;
--gradient-bottom: #e4e7f5;

/* Vignette */
--vignette-opacity: 0.08;

/* Film Grain */
--grain-opacity: 0.03;
--grain-speed: 0.5s;

/* Lighting */
--key-light-default: 250;
--key-light-hover: 350;
--ambient-light: 0.4;
```

---

## 📊 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (WebGL 2.0)
- ✅ Edge 90+
- ⚠️ Mobile: Performance may vary

---

## 🔮 Future Enhancements

- [ ] Add touch gesture support for mobile
- [ ] Implement model color customization
- [ ] Add lazy loading for performance
- [ ] Create variant animations (bounce, sway)
- [ ] Add accessibility controls (reduce motion)

---

## 📝 License & Credits

Built for Victor's Photography Portfolio
Uses Three.js, React Three Fiber, and GSAP

---

## 🤝 Contributing

To modify animations:
1. Edit `PolaroidScene.jsx`
2. Adjust `gsap.timeline()` values
3. Test across scroll positions
4. Verify performance (60fps target)

To change visuals:
1. Update CSS in `index.css`
2. Modify lighting in `<Scene />`
3. Adjust tone mapping in Canvas props

---

**Enjoy your Awwwards-level 3D experience! 🎉**
