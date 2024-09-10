import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import EventList from "./pages/EventList/EventList.tsx";
import VoucherList from "./pages/VoucherList/VoucherList.tsx";
import Navbar from "./components/Navbar.tsx";
import "./App.css";
import MainScreen from "./pages/ShakingGame/MainScreen.tsx";
import EventDetails from "./pages/EventDetails/EventDetails.tsx";
// import QuizGameLanding from "./pages/QuizGame/Landing/Landing.tsx";
// import QuizGameCreate from "./pages/QuizGame/Create/Create.tsx";
// import QuizGameQuizCreator from "./pages/QuizGame/QuizCreator/QuizCreator.tsx";
// import QuizGameHost from "./pages/QuizGame/Host/Host.tsx";
// import QuizGameHostGameView from "./pages/QuizGame/HostGameView/HostGameView.tsx";
// import QuizGameLobby from "./pages/QuizGame/Lobby/Lobby.tsx";
// import QuizGamePlayerGameView from "./pages/QuizGame/PlayerGameView/PlayerGameView.tsx";
// import QuizGameMain from "./pages/QuizGame/Main/Main.tsx";
import VoucherDetails from "./components/VoucherDetails/VoucherDetails.tsx";
import NotificationList from "./pages/NotificationList/NotificationList.tsx";
import NotificationDetails from "./pages/NotificationDetails/NotificationDetails.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import Login from "./pages/Login/Login.tsx";
import Signup from "./pages/Signup/Signup.tsx";

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
        element: <VoucherDetails />
      },
      {
        path: "/notification",
        element: <NotificationList />
      },
      {
        path: "/notification/notifcation-details",
        element: <NotificationDetails />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
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
