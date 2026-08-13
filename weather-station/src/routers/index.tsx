import {createBrowserRouter} from "react-router-dom";
import {LoginRegister} from "../components";
import App from "../App.tsx";
import {Layout} from "../layout";

export const routers = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout/>,
            children: [
                {
                    index: true,
                    element: <App/>
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