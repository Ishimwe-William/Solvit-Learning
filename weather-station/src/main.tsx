import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./store";
import {routers} from "./routers";
import {RouterProvider} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={routers}/>
        </Provider>
    </StrictMode>,
)
