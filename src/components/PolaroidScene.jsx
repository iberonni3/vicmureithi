import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, ContactShadows, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import polaroidModelPath from '../assets/polaroid_camera.glb?url';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// POLAROID MODEL WITH ANIMATIONS
// ============================================
function PolaroidModel({ mousePosition, isHovered, onPositionUpdate }) {
    const groupRef = useRef();
    const modelRef = useRef();
    const { scene } = useGLTF(polaroidModelPath);
    const clock = useRef(new THREE.Clock());
    const [rotationState, setRotationState] = useState('idle'); // idle, flipping, returning
    const [entranceComplete, setEntranceComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const baseY = useRef(0); // Store base Y position for floating

    useEffect(() => {
        if (modelRef.current) {
            // Initial setup - ensure model is centered
            const box = new THREE.Box3().setFromObject(scene);
            const center = box.getCenter(new THREE.Vector3());
            scene.position.sub(center);

            // Set model initially invisible
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = 0;
                }
            });
        }
    }, [scene]);

    // Scroll-triggered flip animation at 40% scroll
    useEffect(() => {
        if (!groupRef.current) return;

        const triggers = [];

        // Set initial state IMMEDIATELY - camera above viewport, scaled down, rotated dramatically
        // Do this synchronously before any render happens
        gsap.set(groupRef.current.position, { y: 15, z: -8 });
        gsap.set(groupRef.current.rotation, { x: -0.5, y: Math.PI * 1.3, z: 0.3 });
        gsap.set(groupRef.current.scale, { x: 0.3, y: 0.3, z: 0.3 });
        gsap.set(groupRef.current, { visible: false }); // Hide the entire group

        // CINEMATIC ENTRANCE: Camera drops from above with rotation and scale
        const entranceTl = gsap.timeline({
            delay: 0.1,
            onStart: () => {
                // Make group visible when animation starts
                if (groupRef.current) {
                    groupRef.current.visible = true;
                }
                setIsVisible(true);
            }
        });

        // Animate entrance with multiple overlapping movements - faster for better UX
        entranceTl
            // Drop down with deceleration
            .to(groupRef.current.position, {
                y: 0,
                z: 0,
                duration: 1.2,
                ease: 'power3.out',
            })
            // Scale up with slight overshoot
            .to(groupRef.current.scale, {
                x: 1.05,
                y: 1.05,
                z: 1.05,
                duration: 1.0,
                ease: 'back.out(1.2)',
            }, '<')
            // Rotate to final position with dramatic spin
            .to(groupRef.current.rotation, {
                x: 0,
                y: Math.PI,
                z: 0,
                duration: 1.3,
                ease: 'power2.inOut',
            }, '<')
            // Settle to exact scale
            .to(groupRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3,
                ease: 'power2.inOut',
                onComplete: () => {
                    setEntranceComplete(true);
                    // Ensure no lingering tweens on rotation before starting flip
                    gsap.killTweensOf(groupRef.current.rotation);
                    createFlipTimeline();
                },
            }, '-=0.2');

        // Create flip timeline only AFTER entrance completes to avoid conflicts
        let flipTimeline;
        const createFlipTimeline = () => {
            if (!groupRef.current || flipTimeline) return;
            flipTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.5,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        // Flip at 20-30%, return at 40%
                        if (progress >= 0.2 && progress <= 0.3) {
                            setRotationState('flipping');
                        } else if (progress > 0.3 && progress <= 0.4) {
                            setRotationState('returning');
                        } else {
                            setRotationState('idle');
                        }
                    },
                    invalidateOnRefresh: true,
                },
            });
            if (flipTimeline.scrollTrigger) triggers.push(flipTimeline.scrollTrigger);

            // Flip to front view at 20%
            flipTimeline.to(groupRef.current.rotation, {
                y: 0,
                duration: 0.1,
                ease: 'power2.inOut',
            }, 0.2);

            // Return to back view at 30%
            flipTimeline.to(groupRef.current.rotation, {
                y: Math.PI,
                duration: 0.1,
                ease: 'power2.inOut',
            }, 0.3);
        };

        return () => {
            triggers.forEach(trigger => trigger.kill());
        };
    }, []);

    // Animation loop for floating and mouse parallax
    useFrame((state) => {
        if (!groupRef.current) return;

        // Control model visibility via opacity
        if (modelRef.current) {
            scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    const targetOpacity = isVisible ? 1 : 0;
                    child.material.opacity = THREE.MathUtils.lerp(
                        child.material.opacity,
                        targetOpacity,
                        0.1
                    );
                }
            });
        }

        const elapsed = clock.current.getElapsedTime();

        // Floating animation (Y oscillation) - only when entrance is complete and idle
        if (entranceComplete && rotationState === 'idle') {
            const floatOffset = Math.sin(elapsed * 0.8) * 0.15;
            groupRef.current.position.y = baseY.current + floatOffset;
        }

        // Mouse parallax rotation (subtle tilt based on cursor position) - only after entrance
        if (entranceComplete) {
            const targetRotationX = mousePosition.y * 0.15;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                targetRotationX,
                0.05
            );
        }

        // Hover effect: bring forward in Z-space - only after entrance
        if (entranceComplete) {
            const targetZ = isHovered ? 0.5 : 0;
            groupRef.current.position.z = THREE.MathUtils.lerp(
                groupRef.current.position.z,
                targetZ,
                0.1
            );
        }

        // Update shadow position (throttled)
        if (onPositionUpdate && state.clock.elapsedTime % 0.1 < 0.016) {
            onPositionUpdate({
                x: groupRef.current.position.x,
                y: groupRef.current.position.y,
                z: groupRef.current.position.z
            });
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            <primitive ref={modelRef} object={scene} scale={0.8} />
        </group>
    );
}

// ============================================
// MOUSE-FOLLOWING SPOTLIGHT
// ============================================
function MouseSpotlight({ mousePosition, isHovered }) {
    const spotlightRef = useRef();
    const targetPosition = useRef(new THREE.Vector3(0, 0, 8));

    useFrame(() => {
        if (!spotlightRef.current) return;

        // Calculate target position based on mouse
        const x = mousePosition.x * 8;
        const y = mousePosition.y * 8;
        const z = 8;

        targetPosition.current.set(x, y, z);

        // Smoothly interpolate spotlight position using GSAP-like easing
        spotlightRef.current.position.lerp(targetPosition.current, 0.08);

        // Brighten on hover
        const targetIntensity = isHovered ? 350 : 250;
        spotlightRef.current.intensity = THREE.MathUtils.lerp(
            spotlightRef.current.intensity,
            targetIntensity,
            0.1
        );
    });

    return (
        <spotLight
            ref={spotlightRef}
            position={[0, 0, 8]}
            angle={0.6}
            penumbra={0.8}
            intensity={250}
            castShadow
            shadow-mapSize={[1024, 1024]} // Reduced from 2048
            shadow-bias={-0.0001}
            color="#ffffff"
        />
    );
}

// ============================================
// CAMERA PARALLAX
// ============================================
function CameraController({ mousePosition }) {
    const { camera } = useThree();

    useFrame(() => {
        // Subtle camera movement based on mouse position
        const targetX = mousePosition.x * 0.5;
        const targetY = mousePosition.y * 0.5;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    });

    return null;
}

// ============================================
// SCENE SETUP
// ============================================
function Scene({ mousePosition, isHovered }) {
    const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });

    return (
        <>
            {/* Physically correct lighting and tone mapping */}
            <color attach="background" args={['#d8dce8']} />

            {/* Ambient light for base illumination */}
            <ambientLight intensity={0.4} color="#f0f4ff" />

            {/* Mouse-controlled spotlight (key light) */}
            <MouseSpotlight mousePosition={mousePosition} isHovered={isHovered} />

            {/* Rim light for depth */}
            <directionalLight
                position={[-5, 5, -5]}
                intensity={0.8}
                color="#e0e7ff"
            />
            <directionalLight
                position={[5, -3, -5]}
                intensity={0.5}
                color="#fff5e1"
            />

            {/* 3D Polaroid Model */}
            <PolaroidModel
                mousePosition={mousePosition}
                isHovered={isHovered}
                onPositionUpdate={setModelPosition}
            />

            {/* Contact shadows for depth - follows model position */}
            <ContactShadows
                position={[modelPosition.x, -1.5, modelPosition.z]}
                opacity={0.4}
                scale={8}
                blur={2} // Reduced blur radius
                resolution={512} // Reduced from default (often 1024)
                far={4}
                color="#2a3240"
            />

            {/* Environment for realistic reflections */}
            <Environment preset="studio" />

            {/* Camera parallax controller */}
            <CameraController mousePosition={mousePosition} />
        </>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================
const PolaroidScene = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);
    const contextCleanupRef = useRef(null);

    // Track mouse position for parallax and spotlight
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize mouse position to -1 to 1 range
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Fade in the entire canvas on mount - faster for better UX
    useEffect(() => {
        if (containerRef.current) {
            gsap.to(containerRef.current,
                { opacity: 1, duration: 0.8, ease: 'power2.inOut', delay: 0.1 }
            );
        }
        
        // Cleanup WebGL context handlers on unmount
        return () => {
            if (contextCleanupRef.current) {
                contextCleanupRef.current();
                contextCleanupRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="polaroid-scene-container"
            style={{ opacity: 0 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Canvas
                dpr={[1, 1.5]} // Cap pixel ratio for performance
                shadows
                camera={{ position: [0, 0, 12], fov: 50 }}
                gl={{
                    antialias: false, // Disable MSAA as we have post-processing
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                    outputColorSpace: THREE.SRGBColorSpace,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true,
                    preserveDrawingBuffer: false, // Better performance
                    failIfMajorPerformanceCaveat: false
                }}
                onCreated={({ gl }) => {
                    gl.physicallyCorrectLights = true;
                    
                    // Handle WebGL context lost/restored events
                    const handleContextLost = (event) => {
                        event.preventDefault();
                        console.warn('WebGL context lost. The browser will attempt to restore it automatically.');
                    };
                    
                    const handleContextRestored = () => {
                        console.log('WebGL context restored. Reloading page to reinitialize scene...');
                        // Small delay before reload to ensure context is stable
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    };
                    
                    const canvas = gl.domElement;
                    canvas.addEventListener('webglcontextlost', handleContextLost, false);
                    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
                    
                    // Store cleanup function in ref for component cleanup
                    contextCleanupRef.current = () => {
                        canvas.removeEventListener('webglcontextlost', handleContextLost, false);
                        canvas.removeEventListener('webglcontextrestored', handleContextRestored, false);
                    };
                }}
            >
                <Scene mousePosition={mousePosition} isHovered={isHovered} />

                {/* Post-processing disabled for performance */}
            </Canvas>

            {/* Film grain overlay */}
            <div className="film-grain-overlay" />

            {/* Vignette overlay */}
            <div className="vignette-overlay" />
        </div>
    );
};

export default PolaroidScene;

useGLTF.preload(polaroidModelPath);
