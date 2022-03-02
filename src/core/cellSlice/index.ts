import { createSlice } from "@reduxjs/toolkit";
import { RootState, store } from "../store";
import { Genome } from "../genetic";
import { IEgg } from "../eggSlice";
import { IFood } from "../foodSlice";
import { EAT } from "../foodSaga";

const COST = 1;

export type ICell = {
  id: string;
  position: {
    x: number;
    y: number;
    a: number;
  };
  energy: number;
  genome: Genome | null;
  speed: number;
};

type CellContext = {
  cells: ICell[];
};

const initialState: CellContext = {
  cells: [],
};

function newCell({ id, genome, position }: IEgg) {
  return {
    id,
    genome,
    position: { ...position, a: Math.random() * 360 },
    energy: Math.round(1000 + (Math.random() - 0.5) * 10),
    speed: Math.round(10 + (Math.random() - 0.5) * 10),
  };
}

function moveForward(cell: ICell) {
  const angle = cell.position.a * (Math.PI / 180);
  cell.position.x = cell.position.x + Math.cos(Math.PI - angle) * cell.speed;
  cell.position.y = cell.position.y - Math.sin(Math.PI - angle) * cell.speed;
  cell.energy--;
  return cell;
}

function changeDirection(cell: ICell, a: number) {
  cell.position.a = a;
  return cell;
}

function eat(cell: ICell, prevFoods: IFood[]) {
  const filteredFood = prevFoods.filter((food) => {
    const hasCollid =
      food.position.x < cell.position.x + 20 &&
      food.position.x > cell.position.x - 20 &&
      food.position.y < cell.position.y + 20 &&
      food.position.y > cell.position.y - 20;

    cell.energy += food.energy;

    return !hasCollid;
  });

  const { energy } = cell;

  return { energy, filteredFood };
}

const CellSlice = createSlice({
  name: "CellsInfo",
  initialState,
  reducers: {
    addCell: (state, { payload: { egg } }: { payload: { egg: IEgg } }) => {
      if (state.cells.some((c) => c.id === egg.id)) return;
      const cell: ICell = newCell(egg);
      state.cells = [...state.cells, cell];
    },
    depleteEnergy: (state) => {
      state.cells = state.cells.reduce((acc: ICell[], cell) => {
        if (cell.energy - COST <= 0) {
          return acc;
        } else {
          return [...acc, { ...cell, energy: cell.energy - COST }];
        }
      }, []);
    },
    computeBehaviors: (
      state,
      { payload: { foods } }: { payload: { foods: IFood[] } }
    ) => {
      state.cells = state.cells.map((cell) => {
        cell = moveForward(cell);
        cell = changeDirection(cell, Math.random() * 360);
        const { energy, filteredFood } = eat(cell, foods);
        cell.energy = energy;
        // store.dispatch({ type: EAT, payload: filteredFood });
        return cell;
      });
    },
  },
});

export const selectCell = (state: RootState) => state.cells;

export const { addCell, depleteEnergy, computeBehaviors } = CellSlice.actions;

export default CellSlice.reducer;
