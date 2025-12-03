/**
 * 🎨 POLAROID SCENE - QUICK CUSTOMIZATION GUIDE
 * 
 * This file contains all the key values you can adjust to customize
 * the 3D Polaroid hero animation behavior and appearance.
 */

// ============================================
// 🌈 COLORS & GRADIENTS
// ============================================

// Background Gradient (in index.css)
const GRADIENT_TOP = '#f8f9ff';        // Top of screen
const GRADIENT_BOTTOM = '#e4e7f5';     // Bottom of screen

// Vignette Darkness
const VIGNETTE_OPACITY = 0.08;         // 0 = none, 0.5 = very dark

// Film Grain Intensity
const GRAIN_OPACITY = 0.03;            // 0 = none, 0.1 = very grainy

// Light Colors
const AMBIENT_LIGHT_COLOR = '#f0f4ff'; // Soft blue tint
const SPOTLIGHT_COLOR = '#ffffff';      // Pure white
const RIM_LIGHT_1_COLOR = '#e0e7ff';   // Cool blue
const RIM_LIGHT_2_COLOR = '#fff5e1';   // Warm yellow


// ============================================
// 💡 LIGHTING INTENSITY
// ============================================

// Spotlight (mouse-following key light)
const SPOTLIGHT_DEFAULT_INTENSITY = 250;  // Normal state
const SPOTLIGHT_HOVER_INTENSITY = 350;    // On hover
const SPOTLIGHT_ANGLE = 0.6;              // Cone width (0.1-1.5)
const SPOTLIGHT_PENUMBRA = 0.8;           // Edge softness (0-1)

// Ambient Light
const AMBIENT_INTENSITY = 0.4;            // Overall scene brightness

// Rim Lights
const RIM_LIGHT_1_INTENSITY = 0.8;        // Back-left light
const RIM_LIGHT_2_INTENSITY = 0.5;        // Back-right light


// ============================================
// 🎭 ANIMATION SPEEDS
// ============================================

// Floating Animation
const FLOAT_SPEED = 0.8;                  // Higher = faster bobbing
const FLOAT_AMPLITUDE = 0.15;             // Distance of movement

// Idle Rotation
const ROTATION_SPEED = 0.002;             // Radians per frame
// 0.001 = slow, 0.005 = fast

// Mouse Parallax
const MOUSE_ROTATION_INFLUENCE = 0.15;    // How much cursor affects tilt
const MOUSE_PARALLAX_LERP = 0.05;         // Smoothness (0.01-0.2)

// Spotlight Following
const SPOTLIGHT_LERP_SPEED = 0.08;        // How fast light follows cursor

// Camera Parallax
const CAMERA_PARALLAX_INFLUENCE = 0.5;    // Camera movement amount
const CAMERA_LERP_SPEED = 0.05;           // Camera smoothness

// Hover Z-Movement
const HOVER_Z_DISTANCE = 0.5;             // How far forward on hover
const HOVER_Z_LERP = 0.1;                 // Smoothness of movement


// ============================================
// 📜 SCROLL TRIGGER TIMINGS
// ============================================

// Intro Animation
const INTRO_SCALE_FROM = 0.8;             // Starting scale
const INTRO_SCALE_TO = 1.0;               // Ending scale
const INTRO_ROTATION_FROM = -Math.PI / 12; // Starting rotation (-15°)
const INTRO_ROTATION_TO = 0;              // Ending rotation (0°)
const INTRO_DURATION = 1.5;               // Seconds
const INTRO_EASE = 'power3.out';          // GSAP easing

// Mid-Scroll Flip
const FLIP_START_PROGRESS = 0.35;         // 35% scroll
const FLIP_END_PROGRESS = 0.55;           // 55% scroll
const FLIP_RETURN_PROGRESS = 0.75;        // 75% scroll
const FLIP_ROTATION_AMOUNT = Math.PI;     // 180° flip


// ============================================
// 🎨 VISUAL EFFECTS
// ============================================

// Bloom (Glow Effect)
const BLOOM_INTENSITY = 0.6;              // Glow strength
const BLOOM_THRESHOLD = 0.8;              // Brightness threshold
const BLOOM_SMOOTHING = 0.9;              // Edge smoothness
const BLOOM_RADIUS = 0.5;                 // Glow spread

// Contact Shadows
const SHADOW_OPACITY = 0.35;              // Shadow darkness
const SHADOW_BLUR = 2.8;                  // Shadow softness
const SHADOW_SCALE = 8;                   // Shadow size
const SHADOW_POSITION_Y = -1.5;           // Height below model


// ============================================
// 📷 CAMERA SETTINGS
// ============================================

const CAMERA_POSITION = [0, 0, 12];       // [x, y, z] position
const CAMERA_FOV = 50;                    // Field of view (30-70)
const TONE_MAPPING_EXPOSURE = 1.2;        // Brightness (0.5-2.0)


// ============================================
// 🎯 MODEL SETTINGS
// ============================================

const MODEL_INITIAL_SCALE = 0.8;          // Size of Polaroid
const MODEL_INITIAL_ROTATION = [0, -0.5, 0]; // [x, y, z] rotation
const MODEL_POSITION_Y = 0;               // Vertical offset


// ============================================
// 🎬 USAGE EXAMPLES
// ============================================

/*
Example 1: Make the Polaroid float faster
  - Change FLOAT_SPEED from 0.8 to 1.5
  - Location: PolaroidScene.jsx, line with Math.sin(elapsed * 0.8)
  - Change to: Math.sin(elapsed * 1.5)

Example 2: Make spotlight brighter
  - Change SPOTLIGHT_DEFAULT_INTENSITY from 250 to 400
  - Location: PolaroidScene.jsx, <MouseSpotlight /> component
  - Update targetIntensity values

Example 3: Adjust flip timing
  - Change FLIP_START_PROGRESS from 0.35 to 0.5
  - Location: PolaroidScene.jsx, ScrollTrigger onUpdate
  - Flip will now happen at 50% scroll instead of 35%

Example 4: Increase vignette darkness
  - Change VIGNETTE_OPACITY from 0.08 to 0.15
  - Location: index.css, .vignette-overlay
  - Update rgba(0, 0, 0, 0.08) to rgba(0, 0, 0, 0.15)

Example 5: Disable film grain
  - Change GRAIN_OPACITY from 0.03 to 0
  - Location: index.css, .film-grain-overlay
  - Set opacity: 0;
*/


// ============================================
// 🔧 PERFORMANCE TUNING
// ============================================

// If experiencing lag, reduce these values:
const PERFORMANCE_SHADOW_MAP_SIZE = 2048;  // Try 1024 or 512
const PERFORMANCE_BLOOM_ENABLED = true;    // Set false to disable
const PERFORMANCE_GRAIN_ENABLED = true;    // Set false to disable

// If need more smoothness, increase these:
const PERFORMANCE_LERP_FACTOR = 0.08;      // Increase to 0.15 for snappier
const PERFORMANCE_FPS_TARGET = 60;         // Target frame rate


export {
    // Export all constants for use in components
    GRADIENT_TOP,
    GRADIENT_BOTTOM,
    SPOTLIGHT_DEFAULT_INTENSITY,
    SPOTLIGHT_HOVER_INTENSITY,
    FLOAT_SPEED,
    ROTATION_SPEED,
    INTRO_DURATION,
    BLOOM_INTENSITY,
    // ... add others as needed
};
