import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ApiUser } from "@/queries/types";

type AuthState = {
  user: ApiUser | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<ApiUser>) => {
      state.user = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
