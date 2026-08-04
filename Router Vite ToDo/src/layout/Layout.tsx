import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
};