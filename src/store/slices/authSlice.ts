// src/store/slices/authSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    accessToken: string | null;
    roles: string[]; // теперь массив строк
};

const initialState: AuthState = {
    accessToken: null,
    roles: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<AuthState>) {
            state.accessToken = action.payload.accessToken;
            state.roles = action.payload.roles;
        },
        logout(state) {
            state.accessToken = null;
            state.roles = [];
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
