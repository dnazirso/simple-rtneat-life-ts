import { useAppSelector } from "../../core/store";
import Cell from "../Cell";
import Food from "../Food";

export default function PetriBox() {
  const { cells } = useAppSelector((state) => state.cells);
  const { food } = useAppSelector((state) => state.foods);

  return (
    <div className="App">
      {cells.map((c) => (
        <Cell key={c.id} x={c.position.x} y={c.position.y} />
      ))}
      {food.map((f) => (
        <Food key={f.id} x={f.position.x} y={f.position.y} />
      ))}
    </div>
  );
}
