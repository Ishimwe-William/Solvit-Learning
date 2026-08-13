import {configureStore} from "@reduxjs/toolkit";
import {weatherApi} from "../service/apiSlice.ts";

export const store = configureStore({
    reducer: {
        [weatherApi.reducerPath]: weatherApi.reducer
    },

    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(weatherApi.middleware)
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;