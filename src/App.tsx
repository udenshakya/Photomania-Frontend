import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import AuthWrapper from "./components/AuthWrapper";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: (
          <AuthWrapper>
            <Profile />
          </AuthWrapper>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
