import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { TaskDetails } from "../pages/TaskDetails";
import { CreateEditTask } from "../pages/CreateEditTask";
import { ErrorDemo } from "../pages/ErrorDemo";
import { PageNotFound } from "../pages/404";
import { Layout } from "../layout/Layout";

export const Routes = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "tasks",
        Component: Home,
      },
      {
        path: "home",
        Component: Home,
      },
      {
        path: "tasks/create",
        Component: CreateEditTask,
      },
      {
        path: "tasks/:id",
        Component: TaskDetails,
      },
      {
        path: "tasks/:id/edit",
        Component: CreateEditTask,
      },
      {
        path: "syntax-error",
        Component: ErrorDemo,
      },
      {
        path: "error-demo",
        Component: ErrorDemo,
      },
    ],
  },
  {
    path: "*",
    Component: PageNotFound,
  },
]);