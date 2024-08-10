import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import EventList from "./pages/EventList/EventList.tsx";
import VoucherList from "./pages/VoucherList/VoucherList.tsx";
import Navbar from "./components/Navbar.tsx";
import "./App.css";
import MainScreen from "./pages/ShakingGame/MainScreen.tsx";
import EventDetails from "./pages/EventDetails/EventDetails.tsx";
import VoucherDetails from "./components/VoucherDetails/VoucherDetails.tsx";
import NotificationList from "./pages/NotificationList/NotificationList.tsx";
import NotificationDetails from "./pages/NotificationDetails/NotificationDetails.tsx";
import Profile from "./pages/Profile/Profile.tsx";

const Layout = () => {
  return (
    <>
      <Outlet />
      <Navbar />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <EventList />,
      },
      {
        path: "/discover",
        element: <EventList />,
      },
      {
        path: "/voucher",
        element: <VoucherList />,
      },
      {
        path: "/event/:id",
        element: <EventDetails />,
      },
      {
        path: "/voucher-details",
        element: <VoucherDetails />
      },
      {
        path: "/notification",
        element: <NotificationList />
      },
      {
        path: "/notification/:id",
        element: <NotificationDetails />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ],
  },
  {
    path: "shaking-game",
    children: [
      {
        path: "main",
        element: <MainScreen />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Page not found</div>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
