import { createSlice } from "@reduxjs/toolkit";

const logInSlice = createSlice({
    name: "logIn",
    initialState: {
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.token = action.payload;
            state.loading = false;
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {loginStart, loginSuccess, loginFailure} = logInSlice.actions; 
export default logInSlice.reducer;