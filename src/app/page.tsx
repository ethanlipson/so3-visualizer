"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function Home() {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = window.innerWidth,
      height = window.innerHeight;

    // init

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 5;

    const scene = new THREE.Scene();

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const colors = new Float32Array(cubeGeometry.attributes.position.count * 3);
    const faceColors = [
      new THREE.Color(0xff0000), // Red
      new THREE.Color(0xff00ff), // Magenta
      new THREE.Color(0x0000ff), // Blue
      new THREE.Color(0xffff00), // Yellow
      new THREE.Color(0x00ff00), // Green
      new THREE.Color(0x00ffff), // Cyan
    ];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        const vertexIndex = (i * 4 + j) * 3;
        const color = faceColors[i];

        colors[vertexIndex + 0] = color.r;
        colors[vertexIndex + 1] = color.g;
        colors[vertexIndex + 2] = color.b;
      }
    }

    cubeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const cubeMaterial = new THREE.MeshStandardMaterial({ vertexColors: true });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cubeMesh);

    const axisGeometry = new THREE.BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
    ]);
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const axisMesh = new THREE.Line(axisGeometry, axisMaterial);
    scene.add(axisMesh);

    const topFaceGeometry = new THREE.BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
    ]);
    const topFaceMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const topFaceMesh = new THREE.Line(topFaceGeometry, topFaceMaterial);
    scene.add(topFaceMesh);

    const frontFaceGeometry = new THREE.BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 1),
    ]);
    const frontFaceMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const frontFaceMesh = new THREE.Line(frontFaceGeometry, frontFaceMaterial);
    scene.add(frontFaceMesh);

    const sideFaceGeometry = new THREE.BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
    ]);
    const sideFaceMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const sideFaceMesh = new THREE.Line(sideFaceGeometry, sideFaceMaterial);
    scene.add(sideFaceMesh);

    // const plusZGeometry = new THREE.BufferGeometry().setFromPoints([
    //   new Vector3(0, 0, 0),
    //   new Vector3(0, 0, 1),
    // ]);
    // const plusZMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    // const plusZMesh = new THREE.Line(plusZGeometry, plusZMaterial);
    // scene.add(plusZMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff); // Soft white light
    scene.add(ambientLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // animation
    const pathDurationInMs = 5000;

    function animate(time: number) {
      const iter = Math.floor(time / pathDurationInMs);
      const prog = iter <= 10 ? (time / pathDurationInMs) % 1 : 0;
      const totalAngle = 2 * Math.PI * Math.min(1, 2 - iter / 5);
      const part2StartAngle = 2 * Math.PI * Math.max(0, iter / 5 - 1);

      let tiltAngle;
      let rotAngle;
      if (prog < 0.5) {
        tiltAngle = (Math.min(iter / 5, 1) * Math.PI) / 2;
        rotAngle = prog * 2 * totalAngle;
      } else {
        tiltAngle = -(Math.min(iter / 5, 1) * Math.PI) / 2;
        rotAngle = (prog - 0.5) * 2 * totalAngle + part2StartAngle;
      }

      const rot = new Vector3(
        -Math.sin(tiltAngle),
        Math.cos(tiltAngle),
        0
      ).multiplyScalar(rotAngle);

      cubeMesh.setRotationFromAxisAngle(rot.clone().normalize(), rot.length());
      axisMesh.geometry = new THREE.BufferGeometry().setFromPoints([
        new Vector3(0, 0, 0),
        rot.clone().normalize().multiplyScalar(1),
      ]);
      topFaceMesh.setRotationFromAxisAngle(
        rot.clone().normalize(),
        rot.length()
      );
      frontFaceMesh.setRotationFromAxisAngle(
        rot.clone().normalize(),
        rot.length()
      );
      sideFaceMesh.setRotationFromAxisAngle(
        rot.clone().normalize(),
        rot.length()
      );

      controls.update();
      renderer.render(scene, camera);

      progressBarRef.current!.style.width = `${prog * 100}%`;
    }
  }, []);

  return (
    <div
      ref={progressBarRef}
      className="absolute top-0 left-0 h-[0.3rem] bg-red-500 z-50"
    />
  );
}
