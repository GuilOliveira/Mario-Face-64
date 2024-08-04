import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useRef } from "react";

interface WallProps {
  position: [number, number, number];
  size: [number, number, number];
}

const Wall: React.FC<WallProps> = ({ position, size }) => {
  const texture = useLoader(TextureLoader, "assets/texture.png");

  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(20, 20);

  const ref = useRef(null);

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Wall;
