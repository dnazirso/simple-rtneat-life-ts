import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import IEgg from "../../models/EggModel";
import CellModel from "../../models/CellModel";
import IFood from "../../models/FoodModel";
import { initEggsList } from "./initEggsList";
import { initFoodList } from "./initFoodList";
import addCellToList from "./addCellToList";
import computeEachCellBehavior from "./computeEachCellBehavior";

export const COST = 1;

export type AppContext = {
  cells: CellModel[];
  eggs: IEgg[];
  food: IFood[];
};

const initialState: AppContext = {
  cells: [],
  eggs: [],
  food: [],
};

export const AppSlice = createSlice({
  name: "AppInfo",
  initialState,
  reducers: {
    initFood: initFoodList,
    initEggs: initEggsList,
    addCell: addCellToList,
    computeBehaviors: computeEachCellBehavior,
    depleteEnergy: (state) => {
      state.cells = state.cells.reduce((acc: CellModel[], cell) => {
        if (cell.energy - COST <= 0) {
          return acc;
        } else {
          return [...acc, { ...cell, energy: cell.energy - COST }];
        }
      }, []);
    },
  },
});

export const selectApp = (state: RootState) => state.app;

export const { initFood, initEggs, addCell, depleteEnergy, computeBehaviors } =
  AppSlice.actions;

export default AppSlice.reducer;
