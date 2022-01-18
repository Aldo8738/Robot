import * as THREE from "three";

import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function setupGeometry(form: string, color: string, scene: THREE.Scene) {
  var geometry;
  var material = new THREE.MeshPhongMaterial({ color: color });
  switch (form) {
    case "sphere":
      geometry = new THREE.SphereGeometry(0.3, 30, 30);
      break;
    case "box":
      geometry = new THREE.BoxGeometry(0.6, 1, 0.4);
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(5, 10, 40, 40);
      break;
    case "leg":
      geometry = new THREE.BoxGeometry(0.2, 0.8, 0.3);
      break;
    case "arm":
      geometry = new THREE.BoxGeometry(0.8, 0.2, 0.3);
      break;
    case "foot":
      geometry = new THREE.BoxGeometry(0.2, 0.15, 0.2);
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
  }

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

export function setupLight(scene: THREE.Scene) {
  // add two point lights and a basic ambient light
  // https://threejs.org/docs/#api/lights/PointLight
  var light = new THREE.PointLight(0xffffcc, 1, 100);
  light.position.set(10, 30, 15);
  light.matrixAutoUpdate = true;
  scene.add(light);

  var light2 = new THREE.PointLight(0xffffcc, 1, 100);
  light2.position.set(10, -30, -15);
  light2.matrixAutoUpdate = true;
  scene.add(light2);

  //https://threejs.org/docs/#api/en/lights/AmbientLight
  scene.add(new THREE.AmbientLight(0x999999));
  return scene;
}

// define camera that looks into scene
export function setupCamera(
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene
) {
  // https://threejs.org/docs/#api/cameras/PerspectiveCamera
  camera.near = 0.01;
  camera.far = 10;
  camera.fov = 70;
  camera.position.z = 3;
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix();
  camera.matrixAutoUpdate = true;
  return camera;
}

// define controls (mouse interaction with the renderer)
export function setupControls(controls: OrbitControls) {
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.enableZoom = true;
  controls.enableKeys = false;
  controls.minDistance = 0.1;
  controls.maxDistance = 5;
  return controls;
}
