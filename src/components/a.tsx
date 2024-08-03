import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useRef } from "react";

const Wall = ({ position : number[], size:number[] }) => {
  const texture = useLoader(TextureLoader, "src/assets/texture.png"); // Ensure correct path

  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(20, 20);

  const ref = useRef();

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Wall;
