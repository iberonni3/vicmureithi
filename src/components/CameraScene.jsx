import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import cameraModelPath from '../assets/polaroid_camera.glb?url';

function Model(props) {
    const { scene } = useGLTF(cameraModelPath);
    return <primitive object={scene} {...props} />;
}

function MovingLight() {
    const lightRef = useRef();

    useFrame((state) => {
        // Move light based on pointer position (normalized -1 to 1)
        const x = state.pointer.x * 10;
        const y = state.pointer.y * 10;

        if (lightRef.current) {
            lightRef.current.position.lerp(new THREE.Vector3(x, y, 5), 0.1);
        }
    });

    return (
        <spotLight
            ref={lightRef}
            position={[0, 0, 5]}
            angle={0.5}
            penumbra={1}
            intensity={200}
            castShadow
            shadow-mapSize={1024}
            color="#ffffff"
        />
    );
}

const CameraScene = () => {
    return (
        <div className="camera-scene-container">
            <Canvas shadows camera={{ position: [0, 0, 15], fov: 45 }}>
                <color attach="background" args={['#f0f0f0']} />

                {/* Ambient light for subtle visibility */}
                <ambientLight intensity={0.2} />

                {/* The interactive light */}
                <MovingLight />

                <group position={[0, -1, 0]} rotation={[0, -0.5, 0]}>
                    <Model scale={0.8} />
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                </group>

                {/* Environment for reflections */}
                <Environment preset="studio" />
            </Canvas>
        </div>
    );
};

// Preload the model
useGLTF.preload(cameraModelPath);

export default CameraScene;
