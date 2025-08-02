import RootLayout from './layout';
import HomePage from './pages/home/HomePage';
import NotFoundPage from './pages/home/NotFoundPage';
import AuthLayout from './pages/auth/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';

// API Configuration
const API_GATEWAY_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:3001";

// Root loader - can fetch global data if needed
export async function rootLoader() {
    // You can fetch global data here that's needed across all routes
    return {
        apiGatewayUrl: API_GATEWAY_URL,
        userServiceUrl: USER_SERVICE_URL,
    };
}

// Define route configuration using React Router v7 Data mode
export const routes = [
    {
        path: "/",
        id: "root",
        loader: rootLoader,
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: HomePage,
            },
            {
                path: "auth",
                Component: AuthLayout,
                children: [
                    {
                        path: "login",
                        Component: LoginPage,
                    },
                    {
                        path: "register",
                        Component: RegisterPage,
                    },
                ],
            },
            {
                path: "dashboard",
                Component: DashboardLayout,
                children: [
                    {
                        index: true,
                        Component: DashboardPage,
                    },
                    // Add more dashboard sub-routes here
                    // {
                    //   path: "overview",
                    //   Component: DashboardOverviewPage,
                    // },
                    // {
                    //   path: "settings",
                    //   Component: DashboardSettingsPage,
                    // },
                ],
            },
            // Add more routes here as your app grows
            // {
            //   path: "about",
            //   Component: AboutPage,
            // },
        ],
    },
    {
        path: "*",
        Component: NotFoundPage,
    }
];