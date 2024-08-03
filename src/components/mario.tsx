/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { Group, Mesh, Vector2, Vector3, Raycaster } from "three";

interface MarioProps {
  isClicked: boolean;
  mouse: Vector2;
  returnSpeed: number;
  damping: number;
  stiffness: number;
}

function Mario({
  isClicked,
  mouse,
  returnSpeed,
  damping,
  stiffness,
}: MarioProps) {
  const groupRef = useRef<Group>(null as any);
  const headRef = useRef<Mesh>(null as any);
  const cloneRef = useRef<Mesh>(null as any);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [accelerationArray, setAccelerationArray] = useState<Float32Array>(
    new Float32Array()
  );

  const { camera, size } = useThree();

  const materials = useLoader(
    MTLLoader,
    "src/assets/Marios Head/mariohead.mtl"
  );
  const obj = useLoader(
    OBJLoader,
    "src/assets/Marios Head/mariohead.obj",
    (loader) => {
      materials.preload();
      loader.setMaterials(materials);
    }
  );
  const materialsClone = useLoader(
    MTLLoader,
    "src/assets/Marios Head/mariohead2.mtl"
  );
  const objClone = useLoader(
    OBJLoader,
    "src/assets/Marios Head/mariohead2.obj",
    (loader) => {
      materialsClone.preload();
      loader.setMaterials(materialsClone);
    }
  );

  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [selectedForces, setSelectedForces] = useState<number[]>([]);
  const contact = new Vector3();
  const pointer = new Vector2();
  const oldMouse = useRef(new Vector2());
  const raycaster = new Raycaster();

  function initAccelerationArray() {
    if (headRef.current && headRef.current.geometry) {
      const pos = headRef.current.geometry.getAttribute("position");
      setAccelerationArray(new Float32Array(pos.array.length).fill(0));
    }
  }

  function revertToOriginal(dt: number) {
    if (!headRef.current || !headRef.current.geometry || !accelerationArray)
      return;

    const pos = headRef.current.geometry.getAttribute("position");
    const currentArray = pos.array;
    const initialArray =
      cloneRef.current.geometry.getAttribute("position").array;
    const accelerationPositions = accelerationArray;

    for (let i = 0; i < initialArray.length; i++) {
      const distance = initialArray[i] - currentArray[i];

      if (Math.abs(distance) > initialArray[i] * 0.01) {
        // F = -k * x - c * v
        const force =
          -stiffness * -distance + damping * -accelerationPositions[i];

        accelerationPositions[i] += force * dt * returnSpeed;
        currentArray[i] += accelerationPositions[i] * dt;
      } else {
        accelerationPositions[i] = 0;
      }
    }

    setAccelerationArray(accelerationPositions);
    pos.needsUpdate = true;
  }

  function selectPoints() {
    if (!headRef.current || !headRef.current.geometry) return;

    const points: number[] = [];
    const forces: number[] = [];
    const pos = headRef.current.geometry.getAttribute("position");
    const v = new Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      const force = v.distanceTo(contact) * 0.4;
      if (force < 1) {
        points.push(i);
        forces.push((0.5 + 0.5 * Math.cos(Math.PI * force)) / 185);
      }
    }
    setSelectedPoints(points);
    setSelectedForces(forces);
  }

  function dragPoints() {
    if (!headRef.current || !headRef.current.geometry) return;

    const pos = headRef.current.geometry.getAttribute("position");

    selectedPoints.forEach((i, index) => {
      if (mouse && oldMouse.current) {
        const deltaX = mouse.x - oldMouse.current.x;
        const deltaY = mouse.y - oldMouse.current.y;

        pos.setX(i, pos.getX(i) + selectedForces[index] * deltaX);
        pos.setY(i, pos.getY(i) - selectedForces[index] * deltaY);
      }
    });
    oldMouse.current.copy(mouse);
    pos.needsUpdate = true;
  }

  function hasPointOfContact() {
    pointer.x = (2 * mouse.x) / size.width - 1;
    pointer.y = -(2 * mouse.y) / size.height + 1;

    raycaster.setFromCamera(pointer, camera);
    headRef.current?.updateMatrixWorld(true);

    const intersects = raycaster.intersectObject(headRef.current, true);
    if (intersects.length > 0) {
      contact.copy(intersects[0].point);
      return true;
    }
    return false;
  }

  useFrame((state, delta) => {
    if (isClicked && isHovered && hasPointOfContact() && !isDragging) {
      setSelectedForces([]);
      setSelectedPoints([]);
      selectPoints();
      setIsDragging(true);
      oldMouse.current.copy(mouse);
    }
    if (isDragging) {
      dragPoints();
      if (!isClicked) {
        setIsDragging(false);
      }
    }
    if (!isClicked || (!isDragging && !hasPointOfContact())) {
      revertToOriginal(delta);
    }
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) * 0.2;
    }
    if (cloneRef.current) {
      cloneRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      cloneRef.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) * 0.2;
    }
  });

  useEffect(() => {
    if (obj && obj.children.length > 0) {
      const mesh = obj.children[0] as Mesh;
      if (headRef.current) {
        headRef.current.geometry = mesh.geometry; // Ensure you are not directly assigning ref.current
        initAccelerationArray();
      }
    }
    if (objClone && objClone.children.length > 0) {
      const meshClone = objClone.children[0] as Mesh;
      if (cloneRef.current) {
        cloneRef.current.geometry = meshClone.geometry; // Ensure you are not directly assigning ref.current
      }
    }
  }, [obj, objClone]);

  return (
    <group ref={groupRef}>
      <primitive
        object={obj}
        ref={headRef}
        rotation={[0, 0, 0]}
        onPointerEnter={(event: PointerEvent) => {
          event.stopPropagation();
          setIsHovered(true);
        }}
        onPointerLeave={() => setIsHovered(false)}
        onPointerCancel={() => setIsHovered(false)}
      />

      <primitive
        object={objClone}
        visible={false}
        ref={cloneRef}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default Mario;
