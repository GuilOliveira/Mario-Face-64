import { useEffect, useRef, useState } from "react";
import { Vector3, PointLight } from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface CursorLightProps {
  color: string; // Define the type of color
}

const CursorLight: React.FC<CursorLightProps> = ({ color }) => {
  // Initialize ref with PointLight type
  const lightRef = useRef<PointLight>(null);
  const { viewport } = useThree();
  const [lightPosition, setLightPosition] = useState<Vector3>(
    new Vector3(0, 0, 0)
  );

  // Update light position based on mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates (-1 to +1) for both components
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Convert NDC to world position
      const x = mouseX * viewport.width;
      const y = mouseY * viewport.height;

      setLightPosition(new Vector3(x, y + 8.3, 8)); // Adjust z position as needed
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [viewport]);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(lightPosition);
    }
  });

  return (
    <>
      <pointLight ref={lightRef} color={color} intensity={18} distance={15} />
    </>
  );
};

export default CursorLight;
