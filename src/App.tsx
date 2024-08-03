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
      <a
        href="https://github.com/GuilOliveira/Mario-Face-64"
        target="_blank"
        rel="noopener noreferrer"
        className="github-icon"
      >
        <svg
          xmlns="./assets/github.svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="icon icon-tabler icon-tabler-brand-github"
          width="32"
          height="32"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 3c-4.97 0 -9 4.03 -9 9 0 4.03 2.75 7.43 6.53 8.62 .48 .09 .65 -.21 .65 -.47v-1.84c-2.66 .58 -3.22 -1.26 -3.22 -1.26 -.43 -1.1 -1.05 -1.39 -1.05 -1.39 -.86 -.59 .07 -.58 .07 -.58 .95 .07 1.45 1.08 1.45 1.08 .84 1.43 2.21 1.02 2.75 .78 .09 -.61 .33 -1.02 .6 -1.26 -2.15 -.24 -4.42 -1.07 -4.42 -4.78 0 -1.06 .38 -1.93 1.02 -2.61 -.1 -.25 -.45 -1.26 .1 -2.64 0 0 .82 -.26 2.68 1.02 .78 -.22 1.61 -.34 2.44 -.34 .83 0 1.66 .12 2.44 .34 1.86 -1.28 2.68 -1.02 2.68 -1.02 .55 1.38 .2 2.39 .1 2.64 .64 .68 1.02 1.55 1.02 2.61 0 3.71 -2.27 4.54 -4.42 4.78 .34 .29 .66 .88 .66 1.78v2.61c0 .26 .17 .56 .65 .47 3.78 -1.19 6.53 -4.59 6.53 -8.62 0 -4.97 -4.03 -9 -9 -9z" />
        </svg>
      </a>
    </div>
  );
}

export default App;