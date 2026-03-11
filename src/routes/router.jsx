import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AllTickets from "../pages/AllTickets/AllTickets";
import AuthLayout from "../layouts/AuthLayout";
import LogIn from "../pages/Auth/LogIn";
import Register from "../pages/Auth/Register";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AddTicket from "../pages/Dashboard/AddTicket/AddTicket";
import MyAddedTickets from "../pages/Dashboard/MyAddedTickets/MyAddedTickets";
import RequestedBooking from "../pages/Dashboard/RequestedBooking/RequestedBooking";
import RevenueOverview from "../pages/Dashboard/RevenueOverview/RevenueOverview";
import Error from "../components/Error/Error";
import TicketDetails from "../pages/Home/LatestTickets/TicketDetails";
import MyBookedTickets from "../pages/Dashboard/MyBookedTickets/MyBookedTickets";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancel from "../pages/Dashboard/Payment/PaymentCancel";
import TransactionHistory from "../pages/Dashboard/TransactionHistory/TransactionHistory";
import ManageTickets from "../pages/Dashboard/ManageTickets/ManageTickets";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import AdvertiseTickets from "../pages/Dashboard/AdvertiseTickets/AdvertiseTickets";
import AdminRoute from "./AdminRoute";
import VendorRoute from "./VendorRoute";
import Loader from "../components/Loading/Loading";
import UserRoute from "./userRoute";
import VendorProfile from "../pages/Dashboard/DashboardProfile/VendorProfile";
import UserProfile from "../pages/Dashboard/DashboardProfile/UserProfile";
import AdminProfile from "../pages/Dashboard/DashboardProfile/AdminProfile";
import Contact from "../pages/Contact/Contact";
// import TicketDetails from "../pages/Home/LatestTickets/TicketDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    hydrateFallbackElement: <Loader></Loader>,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: '/allTickets',
        element: <PrivateRoute>
          <AllTickets></AllTickets>
        </PrivateRoute>
      },
      {
        path: '/seeDetails/:id',
        element: <PrivateRoute><TicketDetails></TicketDetails></PrivateRoute>
      },
      {
        path: '/contact',
        Component: Contact
      },
      {
        path: '*',
        Component: Error
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: 'login',
        Component: LogIn
      },
      {
        path: '/register',
        Component: Register
      },
      {
        path: 'forget-password',
        Component: ForgetPassword
      }


    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children: [
      {
        path: 'userProfile',
        Component: UserProfile
      },
      {
        path: 'vendorProfile',
        Component: VendorProfile
      },
      {
        path: 'adminProfile',
        Component: AdminProfile
      },

      {
        path: 'myBookedTickets',
        element: <UserRoute><MyBookedTickets></MyBookedTickets></UserRoute>
      },
      {
        path: 'transactionHistory',
        // Component:TransactionHistory
        element: <UserRoute><TransactionHistory></TransactionHistory></UserRoute>
      },
      {
        path: 'payment/:ticketId',
        element: <UserRoute><Payment></Payment></UserRoute>
      },
      {
        path: 'payment-success',
        element: <UserRoute><PaymentSuccess></PaymentSuccess></UserRoute>
      },
      {
        path: 'payment-canceled',
        element: <UserRoute><PaymentCancel></PaymentCancel></UserRoute>
      },
      {
        path: 'addTicket',
        loader: () => fetch('/serviceCenter.json').then(res => res.json()),
        element: <VendorRoute><AddTicket></AddTicket> </VendorRoute>
      },
      {
        path: 'myAddedTickets',
        element: <VendorRoute><MyAddedTickets></MyAddedTickets></VendorRoute>
      },
      {
        path: 'RequestedBooking',
        element: <VendorRoute><RequestedBooking></RequestedBooking> </VendorRoute>
      },
      {
        path: 'RevenueOverview',
        element: <VendorRoute><RevenueOverview></RevenueOverview> </VendorRoute>
      },
      {
        path: 'manageTickets',
        element: <AdminRoute><ManageTickets></ManageTickets> </AdminRoute>
      },
      {
        path: 'mangeUsers',
        // Component:ManageUsers
        element: <AdminRoute><ManageUsers></ManageUsers> </AdminRoute>
      },
      {
        path: 'advertiseTickets',
        element: <AdminRoute><AdvertiseTickets></AdvertiseTickets></AdminRoute>
      },


    ]
  }
]);