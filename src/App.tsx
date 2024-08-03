import { Canvas } from "@react-three/fiber";
import "./App.css";
import { PerspectiveCamera } from "@react-three/drei";
import { useState } from "react";
import { Vector2 } from "three";
import Selector from "./components/selector";
import Mario from "./components/mario";
import Wall from "./components/wall";
import CursorLight from "./components/cursorLight";
function App() {
  const [isClicked, setIsClicked] = useState(false);
  const [mousePos, setMousePos] = useState(new Vector2());
  const [returnSpeed, setReturnSpeed] = useState(40); // Control strength of return
  const [damping, setDamping] = useState(0.3); // Control damping effect
  const [stiffness, setStiffness] = useState(20); // Control how "stiff" the spring is

  return (
    <div
      className="app-container"
      onPointerDown={() => setIsClicked(true)}
      onPointerUp={() => setIsClicked(false)}
      onPointerMove={(e) => setMousePos(new Vector2(e.clientX, e.clientY))}
    >
      <Selector
        setDamping={setDamping}
        setReturnSpeed={setReturnSpeed}
        setStiffness={setStiffness}
      />
      <div className="canvas-container">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 3, 16]} fov={75} />
          <directionalLight position={[0, 0, 300]} intensity={0.7} />
          <ambientLight intensity={0.3} />
          <CursorLight color="white" />
          <Mario
            isClicked={isClicked}
            mouse={mousePos}
            returnSpeed={returnSpeed}
            damping={damping}
            stiffness={stiffness}
          />
          <Wall position={[0, 0, -2]} size={[100, 80, 0.1]} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
