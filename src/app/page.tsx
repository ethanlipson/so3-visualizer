"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function path(checkpoints: [Vector3, number][], t: number) {
  let lastCheckpoint = 0;
  for (let i = 1; i < checkpoints.length; i++) {
    if (t >= checkpoints[i][1]) lastCheckpoint++;
    else break;
  }
  t =
    (t - checkpoints[lastCheckpoint][1]) /
    (checkpoints[lastCheckpoint + 1][1] - checkpoints[lastCheckpoint][1]);

  return checkpoints[lastCheckpoint][0].clone().lerp(checkpoints[lastCheckpoint + 1][0], t);
}

export default function Home() {
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
      new THREE.Color(0x00ff00), // Green
      new THREE.Color(0x0000ff), // Blue
      new THREE.Color(0xffff00), // Yellow
      new THREE.Color(0xff00ff), // Magenta
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
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const axisMesh = new THREE.Line(axisGeometry, axisMaterial);
    scene.add(axisMesh);

    const topFaceGeometry = new THREE.BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
    ]);
    const topFaceMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const topFaceMesh = new THREE.Line(topFaceGeometry, topFaceMaterial);
    scene.add(topFaceMesh);

    const plusZGeometry = new THREE.BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 1),
    ]);
    const plusZMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const plusZMesh = new THREE.Line(plusZGeometry, plusZMaterial);
    scene.add(plusZMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff); // Soft white light
    scene.add(ambientLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // animation

    function animate(time: number) {
      const prog = (time / 20000) % 1;
      const iter = Math.floor(time / 20000);
      console.log(prog);

      const rot = path(
        [
          [new Vector3(0, 0, Math.PI), 0],
          [
            new Vector3(
              Math.PI * Math.sin((iter / 10) * Math.PI),
              0,
              Math.PI * -Math.cos((iter / 10) * Math.PI)
            ),
            0.5,
          ],
          [
            new Vector3(
              Math.PI * -Math.sin((iter / 10) * Math.PI),
              0,
              Math.PI * Math.cos((iter / 10) * Math.PI)
            ),
            0.5,
          ],
          [new Vector3(0, 0, -Math.PI), 1],
        ],
        prog
      );

      cubeMesh.setRotationFromAxisAngle(rot.clone().normalize(), rot.length());
      axisMesh.geometry = new THREE.BufferGeometry().setFromPoints([
        new Vector3(0, 0, 0),
        rot.clone().normalize().multiplyScalar(1),
      ]);
      topFaceMesh.setRotationFromAxisAngle(rot.clone().normalize(), rot.length());

      controls.update();
      renderer.render(scene, camera);
    }
  }, []);

  return <></>;
}
