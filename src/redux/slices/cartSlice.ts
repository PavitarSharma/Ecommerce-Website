import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ICartItem } from "../../types";

interface ICartState {
  carts: ICartItem[];
}

const initialState: ICartState = {
  carts: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductsToCart: (state, action) => {
      const existingCartItem = state.carts.find(
        (item: ICartItem) => item.product._id === action.payload._id
      );
      if (existingCartItem) {
        existingCartItem.quantity += 1;
      } else {
        state.carts = [
          { product: action.payload, quantity: 1 },
          ...state.carts,
        ];
      }
    },

    setCart: (state, action: PayloadAction<ICartItem[]>) => {
      state.carts = action.payload;
    },

    removeProductFromCart: (state, action) => {
      state.carts = state.carts.filter(
        (item: ICartItem) => item.product._id !== action.payload
      );
    },

    incrementQuantity: (state, action) => {
      const productId = action.payload;

      
      const existingCartItem = state.carts.find(
        (item: ICartItem) => item.product._id === productId
      );
    
      

      if (existingCartItem) {
        if (existingCartItem.quantity < existingCartItem.product.stock) {
          existingCartItem.quantity += 1;
        }
      }
    },

    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const existingCartItem = state.carts.find(
        (item: ICartItem) => item.product._id === productId
      );

      if (existingCartItem) {
        existingCartItem.quantity -= 1;
        if (existingCartItem.quantity === 0) {
          state.carts = state.carts.filter(
            (item) => item.product._id !== productId
          );
        }
      }
    },

    removeAllFromCart: (state) => {
      state.carts = [];
    },
  },
});

export const CartState = (state: RootState) => state.cart;

export const {
  addProductsToCart,
  setCart,
  removeProductFromCart,
  incrementQuantity,
  decrementQuantity,
  removeAllFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
