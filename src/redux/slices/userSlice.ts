import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { lookInInLocalStorage } from "../../config/localstorage";
import { IUser, TAddress } from "../../types";

export interface IUserState {
  isAuth: boolean;
  token: string | null;
  user: IUser | null;
  addresses: TAddress[];
}

const initialState: IUserState = {
  isAuth: lookInInLocalStorage("firstlinks_access_token") ? true : false,
  token: lookInInLocalStorage("firstlinks_access_token"),
  user: null,
  addresses: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, customer } = action.payload;
      state.token = access_token;
      state.isAuth = true;
      state.user = customer;
    },

    setAddresses: (state, action: PayloadAction<TAddress[]>) => {
      state.addresses = action.payload;
    },

    setSaveAddress: (state, action: PayloadAction<TAddress>) => {
      state.addresses = [action.payload, ...state.addresses];
    },

    setEditAddress: (state, action) => {
      const addressId = action.payload._id;
      state.addresses = state.addresses.map((address) => {
        return address._id === addressId ? { ...action.payload } : address;
      });
    },

    setDeleteAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.filter((address) => {
        return address._id !== addressId;
      });
    },

    setToggleActiveAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.map((address) => {
        return address._id === addressId
          ? { ...address, isActive: !address.isActive }
          : address;
      });
    },

    setUserProfile: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },

    logOut: () => initialState,
  },
});

export const UserState = (state: RootState) => state.user;

export const {
  setCredentials,
  logOut,
  setAddresses,
  setEditAddress,
  setUserProfile,
  setDeleteAddress,
  setSaveAddress,
  setToggleActiveAddress,
} = userSlice.actions;

export default userSlice.reducer;
