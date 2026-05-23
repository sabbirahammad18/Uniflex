import { Routes, Route } from "react-router-dom"; // Use "react-router" for v7+
import Login from "../pages/Auth/Login";
import AuthLayout from "../layout/AuthLayout";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Project from "../pages/Project";
import Booking from "../pages/Booking";
import Payment from "../pages/Payment";
import Layout from "../app/Layout.tsx";
import Setting from "../pages/Setting";
import Customer from "../pages/Customer";
import Employee from "../pages/Employee";
import Commission from "../pages/commission/Commission";
import All_Statement from "../pages/All_statement";
import Customerpayment from "../pages/Customerpayment";
import Achievement from "../pages/Achievement";
import Paymentrequest from "../pages/paymentrequest";
import PaymentDetails from "../pages/PaymentDetails";
import CustomerProfile from "../pages/CustomerProfile";
import MoneyReceipt from "../pages/MoneyReceipt";
import ProjectDetails from "../pages/ProjectDetails";
import BookingDetails from "../pages/BookingDetails";
import { GuestRoute, ProtectedRoute } from "./AuthGuards";
import NewPassword from "@/pages/Auth/NewPassword.tsx";
import ForgetPassword from "@/pages/Auth/ForgetPassword.tsx";
import Otp from "@/pages/Auth/Otp.tsx";
const AppRoute = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="forgetpassword" element={<ForgetPassword />} />
          <Route path="otp" element={<Otp />} />
          <Route path="newpassword" element={<NewPassword />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="project" element={<Project />} />
          <Route path="project/:id" element={<ProjectDetails />} />
          <Route path="booking" element={<Booking />} />
          <Route path="booking/:id" element={<BookingDetails />} />
          <Route path="payment" element={<Payment title="Current Balance" amount="৳ 0" date="Live balance" />} />
          <Route path="setting" element={<Setting />} />
          <Route path="customer" element={<Customer />} />
          <Route path="employee" element={<Employee />} />
          <Route path="CustomerProfile" element={<CustomerProfile />} />
          <Route path="PaymentDetails" element={<PaymentDetails />} />
          <Route path="commission" element={<Commission />} />
          <Route path="MoneyReceipt" element={<MoneyReceipt />} />
          <Route path="allstatement" element={<All_Statement />} />
          <Route path="customerpayment" element={<Customerpayment />} />
          <Route path="achievement" element={<Achievement />} />
          <Route path="request" element={<Paymentrequest />} />
          {/* Default route for unmatched paths */}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoute;
