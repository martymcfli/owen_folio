import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  generateTemperatureField,
  createDefaultWellbore,
  createDefaultRockProperties,
  SimulationParameters,
  TemperatureField,
} from '@/lib/heatSimulation';

interface HeatFlowVisualizationProps {
  simulationTime: number;
  heatExtractionRate: number;
  onDrawdownChange?: (drawdown: number) => void;
}

export const HeatFlowVisualization: React.FC<HeatFlowVisualizationProps> = ({
  simulationTime,
  heatExtractionRate,
  onDrawdownChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const wellboreRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      50000
    );
    camera.position.set(2000, 2000, 1500);
    camera.lookAt(0, 0, -1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1000, 1500, 1000);
    scene.add(directionalLight);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging && camera) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        const rotationSpeed = 0.005;
        const spherical = new THREE.Spherical().setFromVector3(camera.position);
        spherical.theta -= deltaX * rotationSpeed;
        spherical.phi -= deltaY * rotationSpeed;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, -1000);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });

    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (camera) {
        const zoomSpeed = 0.1;
        const currentDistance = camera.position.length();
        const newDistance = currentDistance * (1 + (e.deltaY > 0 ? zoomSpeed : -zoomSpeed));
        const direction = camera.position.normalize();
        camera.position.copy(direction.multiplyScalar(Math.max(500, Math.min(10000, newDistance))));
      }
    });

    const handleResize = () => {
      if (containerRef.current && camera && renderer) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const wellbore = createDefaultWellbore(2000, 3);
    const rock = createDefaultRockProperties();

    const params: SimulationParameters = {
      wellbore,
      rock,
      heatExtractionRate,
      simulationTime,
    };

    const temperatureField = generateTemperatureField(params, 25);

    if (pointsRef.current) {
      sceneRef.current.remove(pointsRef.current);
      pointsRef.current.geometry.dispose();
      (pointsRef.current.material as THREE.Material).dispose();
    }

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    const { bounds, values, gridSize } = temperatureField;
    const minTemp = Math.min(...values);
    const maxTemp = Math.max(...values);
    const tempRange = maxTemp - minTemp || 1;

    const getColorForTemperature = (temp: number): [number, number, number] => {
      const normalized = (temp - minTemp) / tempRange;

      if (normalized < 0.15) {
        const t = normalized / 0.15;
        return [0, 0.2 + t * 0.4, 1];
      } else if (normalized < 0.3) {
        const t = (normalized - 0.15) / 0.15;
        return [0, 0.6 + t * 0.4, 1 - t * 0.3];
      } else if (normalized < 0.45) {
        const t = (normalized - 0.3) / 0.15;
        return [0, 1, 0.7 - t * 0.7];
      } else if (normalized < 0.6) {
        const t = (normalized - 0.45) / 0.15;
        return [t, 1, 0];
      } else if (normalized < 0.75) {
        const t = (normalized - 0.6) / 0.15;
        return [1, 1 - t * 0.5, 0];
      } else if (normalized < 0.9) {
        const t = (normalized - 0.75) / 0.15;
        return [1, 0.5 - t * 0.5, 0];
      } else {
        return [1, 0, 0];
      }
    };

    let index = 0;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        for (let k = 0; k < gridSize; k++) {
          const x = bounds.minX + (i / (gridSize - 1)) * (bounds.maxX - bounds.minX);
          const y = bounds.minY + (j / (gridSize - 1)) * (bounds.maxY - bounds.minY);
          const z = bounds.minZ + (k / (gridSize - 1)) * (bounds.maxZ - bounds.minZ);

          positions.push(x, y, z);

          const temp = values[index];
          const [r, g, b] = getColorForTemperature(temp);
          colors.push(r, g, b);

          index++;
        }
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    const material = new THREE.PointsMaterial({
      size: 35,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
    });

    const points = new THREE.Points(geometry, material);
    sceneRef.current.add(points);
    pointsRef.current = points;

    if (wellboreRef.current) {
      sceneRef.current.remove(wellboreRef.current);
    }

    const wellboreGroup = new THREE.Group();

    const wellboreGeometry = new THREE.CylinderGeometry(wellbore.radius * 100, wellbore.radius * 100, wellbore.depth, 16);
    const wellboreMaterial = new THREE.MeshPhongMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.3,
    });
    const wellboreMesh = new THREE.Mesh(wellboreGeometry, wellboreMaterial);
    wellboreMesh.position.z = -wellbore.depth / 2;
    wellboreGroup.add(wellboreMesh);

    for (const lateral of wellbore.laterals) {
      const lateralLength = Math.sqrt(
        Math.pow(lateral.endX - lateral.startX, 2) +
        Math.pow(lateral.endY - lateral.startY, 2) +
        Math.pow(lateral.endZ - lateral.startZ, 2)
      );

      const lateralGeometry = new THREE.CylinderGeometry(wellbore.radius * 80, wellbore.radius * 80, lateralLength, 8);
      const lateralMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff99,
        emissive: 0x00ff99,
        emissiveIntensity: 0.2,
      });
      const lateralMesh = new THREE.Mesh(lateralGeometry, lateralMaterial);

      const midX = (lateral.startX + lateral.endX) / 2;
      const midY = (lateral.startY + lateral.endY) / 2;
      const midZ = (lateral.startZ + lateral.endZ) / 2;
      lateralMesh.position.set(midX, midY, midZ);

      const direction = new THREE.Vector3(
        lateral.endX - lateral.startX,
        lateral.endY - lateral.startY,
        lateral.endZ - lateral.startZ
      ).normalize();

      const up = new THREE.Vector3(0, 0, 1);
      const axis = new THREE.Vector3().crossVectors(up, direction).normalize();
      const angle = Math.acos(up.dot(direction));

      if (axis.length() > 0) {
        lateralMesh.setRotationFromAxisAngle(axis, angle);
      }

      wellboreGroup.add(lateralMesh);
    }

    sceneRef.current.add(wellboreGroup);
    wellboreRef.current = wellboreGroup;

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    if (onDrawdownChange) {
      const avgDrawdown = Math.max(...values) - Math.min(...values);
      onDrawdownChange(avgDrawdown);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [simulationTime, heatExtractionRate, onDrawdownChange]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
};
