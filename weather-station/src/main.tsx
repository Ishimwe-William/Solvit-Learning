import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./store";
import {router} from "./routers";
import {RouterProvider} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </Provider>
    </StrictMode>
)
