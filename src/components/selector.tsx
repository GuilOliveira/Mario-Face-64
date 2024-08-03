import { Slider, Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import "../App.css";

interface SelectorProps {
  setReturnSpeed: Dispatch<SetStateAction<number>>;
  setDamping: Dispatch<SetStateAction<number>>;
  setStiffness: Dispatch<SetStateAction<number>>;
}

const Selector: React.FC<SelectorProps> = ({
  setReturnSpeed,
  setDamping,
  setStiffness,
}) => {
  const handleSliderChange =
    (setter: Dispatch<SetStateAction<number>>) =>
    (_event: Event, value: number | number[]) => {
      setter(value as number);
    };

  return (
    <div className="selector">
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <span>Elastic Force</span>
        <Slider
          aria-label="returnSpeed"
          defaultValue={40}
          min={10}
          max={90}
          valueLabelDisplay="auto"
          onChange={handleSliderChange(setReturnSpeed)}
        />
      </Stack>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <span>Damping</span>
        <Slider
          aria-label="damping"
          defaultValue={0.3}
          min={0.05}
          max={0.47}
          step={0.01}
          valueLabelDisplay="auto"
          onChange={handleSliderChange(setDamping)}
        />
      </Stack>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <span>Stiffness</span>
        <Slider
          aria-label="stiffness"
          defaultValue={20}
          min={1}
          max={100}
          valueLabelDisplay="auto"
          onChange={handleSliderChange(setStiffness)}
        />
      </Stack>
    </div>
  );
};

export default Selector;
