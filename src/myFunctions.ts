import { Matrix4, Mesh, Object3D, Vector3, Vector4 } from "three";
import * as THREE from "three";
import {
  isTypeOnlyImportOrExportDeclaration,
  resolveTypeReferenceDirective,
} from "typescript";

export function position(obj: any, x: number, y: number, z: number) {
  var matrix = new Matrix4();

  obj.position.set(x, y, z);
  //prettier-ignore
  matrix.set(
			1,0,0,x,
			0,1,0,y,
			0,0,1,z,
			0,0,0,1
		);
  obj.matrix = matrix;

  updateMatrixWorld(obj, obj.parent.matrixWorld);
}

// Rotation functions
function rotateX(obj: any, angle: number) {
  const tempAngle = (angle / 360) * 2 * Math.PI;
  const c = Math.cos(tempAngle);
  const s = Math.sin(tempAngle);
  const matrix = new Matrix4();
  //prettier-ignore
  matrix.set(
    1, 0, 0, 0,
    0, c, -s, 0,
    0, s, c, 0,
    0, 0, 0, 1,
  );

  obj.matrix = obj.matrix.multiply(matrix);

  obj.children.forEach((child: any) => {
    rotateX(child, angle);
  });

  updateChildren(obj);
}

function rotateY(obj: any, angle: number) {
  const tempAngle = (angle / 360) * 2 * Math.PI;
  const c = Math.cos(tempAngle);
  const s = Math.sin(tempAngle);
  const matrix = new Matrix4();
  //prettier-ignore
  matrix.set(
    c, 0, s, 0,
    0, 1, 0, 0,
    -s, 0, c, 0,
    0, 0, 0, 1,
  );

  obj.matrix = obj.matrix.multiply(matrix);

  obj.children.forEach((child: any) => {
    rotateY(child, angle);
  });
  updateChildren(obj);
}

function rotateZ(obj: any, angle: number) {
  const tempAngle = (angle / 360) * 2 * Math.PI;
  const c = Math.cos(tempAngle);
  const s = Math.sin(tempAngle);
  const matrix = new Matrix4();
  //prettier-ignore
  matrix.set(
    c, -s, 0, 0,
    s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  );

  obj.matrix = obj.matrix.multiply(matrix);

  obj.children.forEach((child: any) => {
    rotateZ(child, angle);
  });
  updateChildren(obj);
}

//Selects Object or Mesh from scene-graph to apply rotations and shows axis
export function select(obj: any) {
  let temp = obj;
  let parent = temp.parent;
  let childNum = 0;

  const colorYellow = new THREE.MeshPhongMaterial({
    color: "yellow",
  });
  const colorRed = new THREE.MeshPhongMaterial({
    color: "#FF3333",
  });

  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "s":
        let child = temp.children[0];
        if (!child) {
          break;
        }
        if (child.type === "AxesHelper") {
          child = child.children[0];
        }
        if (child) {
          temp.material = colorRed;
          temp = child;
          parent = temp.parent;
          temp.material = colorYellow;
        }

        break;
      case "d":
        if (temp.parent.name === "scene" || temp.parent.name === "Robot") {
          break;
        }

        if (parent.children.length > 1) {
          if (childNum === parent?.children.length - 1) {
            childNum = -1;
          }
          temp.material = colorRed;
          temp = parent.children[++childNum];
          temp.material = colorYellow;
        }

        break;
      case "a":
        if (temp.parent.name === "scene" || temp.parent.name === "Robot") {
          break;
        }
        if (parent.children.length === 1) {
          break;
        }

        if (childNum === 0) {
          childNum = parent?.children.length;
        }
        if (parent.children.length > 1) {
          temp.material = colorRed;
          temp = parent.children[--childNum];
          temp.material = colorYellow;
        }

        break;
      case "w":
        if (!parent || parent.name === "scene") {
          break;
        }

        if (parent.type === "AxesHelper") {
          parent = parent.parent;
        }

        temp.material = colorRed;
        temp = parent;
        parent = temp.parent;
        temp.material = colorYellow;

        break;
      case "c":
        temp.children[0].material.opacity = 1;
        temp.children[0].material.transparent = false;
        break;
      case "ArrowDown":
        let angleUp = 0;
        if (temp.name !== "left arm" && temp.name !== "right arm") {
          angleUp++;
          rotateX(temp, angleUp);
        } else if (temp.name === "right arm") {
          angleUp--;
          rotateZ(temp, angleUp);
        } else {
          angleUp++;
          rotateZ(temp, angleUp);
        }

        //updateChildren(temp);
        break;
      case "ArrowUp":
        let angleDown = 0;
        if (temp.name !== "left arm" && temp.name !== "right arm") {
          angleDown--;
          rotateX(temp, angleDown);
        } else if (temp.name === "right arm") {
          angleDown++;
          rotateZ(temp, angleDown);
        } else {
          angleDown--;
          rotateZ(temp, angleDown);
        }
        //updateChildren(temp);
        break;
      case "ArrowLeft":
        let angleLeft = 0;
        if (temp.name != "head") {
          angleLeft--;
          rotateY(temp, angleLeft);
        } else {
          angleLeft++;
          rotateZ(temp, angleLeft);
        }
        //updateChildren(temp);
        break;
      case "ArrowRight":
        let angleRight = 0;

        if (temp.name != "head") {
          angleRight++;
          rotateY(temp, angleRight);
        } else {
          angleRight--;
          rotateZ(temp, angleRight);
        }
        //updateChildren(temp);
        break;
    }
    window.addEventListener("keyup", function (event) {
      if (event.key === "c") {
        makeAxesInvisible(obj);
      }
    });
  });
}

//Update functions
export function updateMatrixWorld(obj: any, parentMatrixWorld: any) {
  if (parentMatrixWorld) {
    obj.matrixWorld = obj.matrix.multiply(parentMatrixWorld);
  } else {
    obj.worldMatrix.copy(obj.matrix);
  }

  obj.children.forEach((child: any) => {
    updateMatrixWorld(child, obj.matrixWorld);
  });
}

export function updateChildren(obj: any) {
  obj.children.forEach((child: any) => {
    const childPosition = child.position;
    child.matrix.copy(obj.matrix);

    var matrix = new Matrix4();

    //prettier-ignore
    matrix.set(
          1,0,0,childPosition.x,
          0,1,0,childPosition.y,
          0,0,1,childPosition.z,
          0,0,0,1
        );
    child.matrixWorld = child.matrix.multiply(matrix);

    updateChildren(child);
  });
}

//Creates an invisible AxesHelper
export function invisibleAxes(size: number) {
  const axes = new THREE.AxesHelper(size);
  axes;
  axes.material.opacity = 0;
  axes.material.transparent = true;
  return axes;
}

//Recursive function to make all the axes invisible
function makeAxesInvisible(obj: any) {
  if (!obj) {
    return;
  }

  if (obj.type === "AxesHelper") {
    obj.material.opacity = 0;
    obj.material.transparent = true;
  }

  obj.children.forEach((child: any) => {
    makeAxesInvisible(child);
  });
}

//Prints Scene-graph on console
export function printGraph(obj: THREE.Object3D) {
  console.group(" <" + obj.type + "> " + obj.name);

  obj.children.forEach(printGraph);

  console.groupEnd();
}
