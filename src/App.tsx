import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom';
import EventList from './pages/EventList/EventList.tsx';
import VoucherList from './pages/VoucherList/VoucherList.tsx';
import Navbar from './components/Navbar.tsx';
import './App.css';

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
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <EventList />,
			},
			{
				path: '/discover',
				element: <EventList />,
			},
			{
				path: '/voucher',
				element: <VoucherList />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
