import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import EventList from "./pages/EventList/EventList.tsx";
import VoucherList from "./pages/VoucherList/VoucherList.tsx";
import Navbar from "./components/Navbar.tsx";
import "./App.css";
import MainScreen from "./pages/ShakingGame/MainScreen.tsx";
import EventDetails from "./pages/EventDetails/EventDetails.tsx";
import QuizGameMain from "./pages/QuizGame/Main/Main.tsx";
import VoucherDetails from "./components/VoucherDetails/VoucherDetails.tsx";
import NotificationList from "./pages/NotificationList/NotificationList.tsx";
import NotificationDetails from "./pages/NotificationDetails/NotificationDetails.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import Signup from "./pages/Signup/Signup.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import LoginPage from "./pages/Login.tsx";
import VerificationSuccess from "./pages/VerificationSuccess.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";

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
    path: "/verification-success",
    element: <VerificationSuccess />,
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
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
        path: "/favorites",
        element: <EventList />,
      },
      {
        path: "/voucher",
        element: <VoucherList />,
      },
      {
        path: "/sale-events/:eventId",
        element: <EventDetails />,
      },
      {
        path: "/voucher-details",
        element: <VoucherDetails />,
      },
      {
        path: "/notification",
        element: <NotificationList />,
      },
      {
        path: "/notification/:id",
        element: <NotificationDetails />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
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
    path: "quiz-game",
    children: [
      {
        path: "main/:id",
        element: <QuizGameMain />,
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
