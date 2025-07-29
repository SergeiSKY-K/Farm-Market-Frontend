// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    accessToken: string | null;
    role: 'USER' | 'SUPPLIER' | 'MODERATOR' | 'ADMIN' | null;
};

const initialState: AuthState = {
    accessToken: null,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<AuthState>) {
            state.accessToken = action.payload.accessToken;
            state.role = action.payload.role;
        },
        logout(state) {
            state.accessToken = null;
            state.role = null;
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;