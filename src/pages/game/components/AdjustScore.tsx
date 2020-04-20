import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
} from "@material-ui/core";

interface Props {
  open: boolean;
  points: number;
  doom: number;
  onCancel: () => any;
  onUpdate: (points: number, doom: number) => any;
}

export const AdjustScore: FC<Props> = (props) => {
  const { open, points, doom, onCancel, onUpdate } = props;
  const [newPoints, setPoints] = useState(points);
  const [newDoom, setDoom] = useState(doom);

  useEffect(() => {
    setPoints(points);
    setDoom(doom);
  }, [points, doom]);

  return (
    <Dialog open={open}>
      <DialogContent style={{ padding: 24, textAlign: "center" }}>
        <Input
          label="Points"
          value={newPoints}
          onChange={(e) => setPoints(e.target.value as number)}
        />
        <Input
          label="Doom"
          value={newDoom}
          onChange={(e) => setDoom(e.target.value as number)}
        />
      </DialogContent>
      <DialogActions style={{ paddingLeft: 24, paddingRight: 24 }}>
        <Button variant="outlined" color="secondary" onClick={() => onCancel()}>
          No
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onUpdate(newPoints, newDoom)}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface InputProps {
  label: string;
  value: number;
  onChange: SelectProps["onChange"];
}
const Input: FC<InputProps> = ({ label, value, onChange }) => {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <FormControl>
      <InputLabel id={`${id}-entry`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={`${id}-entry`}
        value={value}
        onChange={onChange}>
        {pointValues.map((v) => (
          <MenuItem key={v} value={v}>
            {v}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const pointValues = new Array(8).fill(1).map((_, v) => v);
