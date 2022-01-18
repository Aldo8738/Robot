// external dependencies
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import RenderWidget from "./lib/rendererWidget";
import { Application, createWindow, Window } from "./lib/window";

import * as helper from "./helper";
// put your imports here
import { Matrix4, Mesh, Object3D, Vector4 } from "three";
import * as myFunct from "./myFunctions";
/*******************************************************************************
 * Main entrypoint. Previouly declared functions get managed/called here.
 * Start here with programming.
 ******************************************************************************/

var camera: THREE.PerspectiveCamera;
var controls: OrbitControls;
var rendererDiv: Window;

// Creating forms //
var head: THREE.Mesh;
var torax: THREE.Mesh;
var leftLeg: THREE.Mesh;
var rightLeg: THREE.Mesh;
var leftArm: THREE.Mesh;
var rightArm: THREE.Mesh;
var leftFoot: THREE.Mesh;
var rightFoot: THREE.Mesh;

function main() {
  // setup/layout root Application.
  // Its the body HTMLElement with some additional functions.
  // More complex layouts are possible too.
  var root = Application("Robot");
  root.setLayout([["renderer"]]);
  root.setLayoutColumns(["100%"]);
  root.setLayoutRows(["100%"]);
  // ---------------------------------------------------------------------------
  // create RenderDiv
  rendererDiv = createWindow("renderer");
  root.appendChild(rendererDiv);

  // create renderer
  var renderer = new THREE.WebGLRenderer({
    antialias: true, // to enable anti-alias and get smoother output
  });

  // important exercise specific limitation, do not remove this line
  THREE.Object3D.DefaultMatrixAutoUpdate = false;
  // create scene
  var scene = new THREE.Scene();
  scene.name = "scene";
  const robot = new THREE.Object3D();
  robot.name = "Robot";
  scene.add(robot);

  //Setup

  const robotColor = "#FF3333";
  head = helper.setupGeometry("sphere", robotColor, scene);
  head.name = "head";
  torax = helper.setupGeometry("box", robotColor, scene);
  torax.name = "torax";
  leftLeg = helper.setupGeometry("leg", robotColor, scene);
  leftLeg.name = "left leg";
  rightLeg = helper.setupGeometry("leg", robotColor, scene);
  rightLeg.name = "right leg";
  leftArm = helper.setupGeometry("arm", robotColor, scene);
  leftArm.name = "left arm";
  rightArm = helper.setupGeometry("arm", robotColor, scene);
  rightArm.name = "right arm";
  rightFoot = helper.setupGeometry("foot", robotColor, scene);
  rightFoot.name = "right foot";
  leftFoot = helper.setupGeometry("foot", robotColor, scene);
  leftFoot.name = "left foot";

  // //Initial Coordinates

  myFunct.position(leftFoot, -0.2, -1.33, 0.25);
  myFunct.position(rightFoot, 0.2, -1.33, 0.25);
  myFunct.position(head, 0, 0.5, 0);
  myFunct.position(leftArm, -0.4, 0.4, 0);
  myFunct.position(rightArm, 0.4, 0.4, 0);

  //Geometry modification
  leftLeg.geometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(-0.2, -1, 0)
  );
  rightLeg.geometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(0.2, -1, 0)
  );
  leftArm.geometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(-0.4, 0, 0)
  );
  rightArm.geometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(0.4, 0, 0)
  );
  head.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.4, 0));

  // Axes
  const nodeTorax = myFunct.invisibleAxes(1);
  const nodeLeftLeg = myFunct.invisibleAxes(0.5);
  const nodeLeftFoot = myFunct.invisibleAxes(0.5);
  const nodeRightLeg = myFunct.invisibleAxes(0.5);
  const nodeRightFoot = myFunct.invisibleAxes(0.5);
  const nodeLeftArm = myFunct.invisibleAxes(0.5);
  const nodeRightArm = myFunct.invisibleAxes(0.5);
  const nodeHead = myFunct.invisibleAxes(0.5);

  nodeLeftLeg.geometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(-0.2, -0.6, 0)
  );
  nodeRightLeg.geometry.applyMatrix4(
    new THREE.Matrix4().makeTranslation(0.2, -0.6, 0)
  );

  nodeHead.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0));

  //SceneGraph

  //Torax
  robot.add(torax);
  torax.add(nodeTorax);
  nodeTorax.add(leftLeg);
  nodeTorax.add(rightLeg);
  nodeTorax.add(rightArm);
  nodeTorax.add(head);
  nodeTorax.add(leftArm);

  //Left Leg
  leftLeg.add(nodeLeftLeg);
  nodeLeftLeg.add(leftFoot);
  leftFoot.add(nodeLeftFoot);

  //Right Leg
  rightLeg.add(nodeRightLeg);
  nodeRightLeg.add(rightFoot);
  rightFoot.add(nodeRightFoot);

  //Arms
  leftArm.add(nodeLeftArm);
  rightArm.add(nodeRightArm);

  //Head
  head.add(nodeHead);

  // manually set matrixWorld

  scene.matrixWorld.copy(scene.matrix);
  helper.setupLight(scene);
  scene.background = new THREE.Color("skyblue");
  myFunct.updateMatrixWorld(scene, scene.matrixWorld);

  // create camera
  camera = new THREE.PerspectiveCamera();
  helper.setupCamera(camera, scene);

  // create controls
  controls = new OrbitControls(camera, rendererDiv);
  helper.setupControls(controls);

  // fill the renderDiv. In RenderWidget happens all the magic.
  // It handles resizes, adds the fps widget and most important defines the main animate loop.
  // You dont need to touch this, but if feel free to overwrite RenderWidget.animate
  var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
  wid.animate();
  // Prints in console the Scenegraph
  // myFunct.printGraph(scene);
  // console.log(leftFoot.position);

  //Select
  document.addEventListener("keypress", myFunct.select(robot));

  //Restore robot
  window.addEventListener("keypress", function (event) {
    if (event.key === "r") {
      myFunct.position(robot, 0, 0, 0);
      myFunct.updateChildren(robot);
    }
  });
}

// call main entrypoint
main();
