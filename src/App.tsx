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
import AuthLayout from "./layouts/AuthLayout.tsx";
import LoginPage from "./pages/Login.tsx";
import VerificationSuccess from "./pages/VerificationSuccess.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import RegisterPage from "./pages/SignUp/SignUp.tsx";
import VerifyOTPForm from "./components/Auth/VerifyOTPForm.tsx";

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
    path: "/auth",
    element: <AuthLayout />, // Common layout for both login and register
    children: [
      {
        path: "login",
        element: <LoginPage />, // Direct login route
      },
      {
        path: "register",
        element: <RegisterPage />, // Direct register route
      },
      {
        path: "verify-otp",
        element: <VerifyOTPForm />,
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
  // {
  //   path: "quiz-game",
  //   children: [
  //     {
  //       path: "",
  //       element: <QuizGameLanding />,
  //     },
  //     {
  //       path: "landing",
  //       element: <QuizGameLanding />,
  //     },
  //     {
  //       path: "create",
  //       element: <QuizGameCreate />,
  //     },
  //     {
  //       path: "quiz-creator",
  //       element: <QuizGameQuizCreator />,
  //     },
  //     {
  //       path: "host",
  //       children: [
  //         {
  //           path: "",
  //           element: <QuizGameHost />,
  //         },
  //         {
  //           path: "game",
  //           element: <QuizGameHostGameView />,
  //         },
  //       ],
  //     },
  //     {
  //       path: "player",
  //       children: [
  //         {
  //           path: "",
  //           element: <QuizGameLobby />,
  //         },
  //         {
  //           path: "game",
  //           element: <QuizGamePlayerGameView />,
  //         },
  //       ],
  //     },
  //     {
  //       path: "main/:id",
  //       element: <QuizGameMain />,
  //     },
  //   ],
  // },
  {
    path: "*",
    element: <div>Page not found</div>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
