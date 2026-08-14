import {createBrowserRouter} from "react-router-dom";
import {LoginRegister} from "../components";
import App from "../App.tsx";
import {Layout} from "../layout";
import {ProtectedRoute} from "../components/auth/ProtectedRoute.tsx";
import {ExceptionPage} from "../components/exceptions";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout/>,
            errorElement: <ExceptionPage/>,
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute>
                            <App/>
                        </ProtectedRoute>
                    )
                },
                {
                    path: "login",
                    element: <LoginRegister isLogin={true}/>
                },
                {
                    path: "register",
                    element: <LoginRegister isLogin={false}/>
                }
            ]
        }
    ]
)