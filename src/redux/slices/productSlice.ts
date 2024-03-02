import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Option } from "../../types";


interface IProductState {
  view: string;
  category: string;
  color: string;
  size: string;
  price: string;
  type: string;
  sort: Option;
  searchTerm: string;
}

const initialState: IProductState = {
  view: "grid",
  category: "",
  color: "",
  price: "",
  size: "",
  type: "",
  sort:{ label: "Date added, newest to oldest", value: "Date added, newest to oldest" },
  searchTerm: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setView: (state, action) => {
      state.view = action.payload;
    },

    setSize: (state, action) => {
      state.size = action.payload;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSerachTerm: (state) => {
      state.searchTerm = "";
    },

    setColor: (state, action) => {
      state.color = action.payload;
    },

    setCategory: (state, action) => {
      state.category = action.payload;
    },

    setType: (state, action) => {
      state.type = action.payload;
    },

    setPrice: (state, action) => {
      state.price = action.payload;
    },

    setSort: (state, action) => {
      state.sort = action.payload;
    },

    reset: () => initialState,
  },
});

export const ProductState = (state: RootState) => state.product;

export const {
  reset,
  setView,
  setCategory,
  setColor,
  setPrice,
  setSize,
  setType,
  setSort,
  clearSerachTerm,
  setSearchTerm
} = productSlice.actions;

export default productSlice.reducer;
