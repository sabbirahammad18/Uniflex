import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom"; // Use "react-router" for v7+
import Login from "../pages/Auth/Login";
import AuthLayout from "../layout/AuthLayout";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/profile/Profile.tsx";
import Project from "../pages/project/Project.tsx";
import Booking from "../pages/booking/Booking.tsx";
import Payment from "../pages/payment/Payment.tsx";
import Layout from "../app/Layout.tsx";
import Setting from "../pages/profile/Setting.tsx";
import Customer from "../pages/customer/Customer.tsx";
import Employee from "../pages/employee/Employee.tsx";
import Commission from "../pages/commission/Commission";
import All_Statement from "../pages/All_statement";
import Customerpayment from "../pages/customer/Customerpayment.tsx";
import Achievement from "../pages/Achievement";
import Paymentrequest from "../pages/payment/paymentrequest.tsx";
import PaymentDetails from "../pages/payment/PaymentDetails";
import CustomerProfile from "../pages/customer/CustomerProfile.tsx";
import MoneyReceipt from "../pages/booking/MoneyReceipt.tsx";
import ProjectDetails from "../pages/project/ProjectDetails.tsx";
import BookingDetails from "../pages/booking/BookingDetails.tsx";
import NotificationPage from "@/pages/Notification";
import { GuestRoute, ProtectedRoute } from "./AuthGuards";
import NewPassword from "@/pages/Auth/NewPassword.tsx";
import ForgetPassword from "@/pages/Auth/ForgetPassword.tsx";
import Otp from "@/pages/Auth/Otp.tsx";
import PaymentResult from "@/pages/PaymentResult.tsx";

const TestPage = lazy(() => import("@/pages/test.tsx"));
const ProjectMapPage = lazy(() => import("@/pages/profile/ProjectMapPage"));

const RouteLoader = () => (
  <div className="grid min-h-[calc(100dvh-120px)] place-items-center bg-white text-[#07277F]">
    <span className="material-symbols-outlined animate-pulse text-3xl">progress_activity</span>
  </div>
);

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
          <Route
            path="profile/map"
            element={
              <Suspense fallback={<RouteLoader />}>
                <ProjectMapPage />
              </Suspense>
            }
          />
          <Route path="project" element={<Project />} />
          <Route path="payment-result" element={<PaymentResult />} />
          <Route path="project/:id" element={<ProjectDetails />} />
          <Route path="booking" element={<Booking />} />
          <Route path="booking/:id" element={<BookingDetails />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="setting" element={<Setting />} />
          <Route path="customer" element={<Customer />} />
          <Route path="employee" element={<Employee />} />
          <Route path="CustomerProfile" element={<CustomerProfile />} />
          <Route path="PaymentDetails" element={<PaymentDetails />} />
          <Route path="MoneyReceipt" element={<MoneyReceipt />} />
          <Route path="allstatement" element={<All_Statement />} />
          <Route path="customerpayment" element={<Customerpayment />} />
          <Route element={<ProtectedRoute allowedRoles={["marketing"]} />}>
            <Route path="payment" element={<Payment title="Current Balance" amount="৳ 0" date="Live balance" />} />
            <Route path="commission" element={<Commission />} />
            <Route path="achievement" element={<Achievement />} />
            <Route path="request" element={<Paymentrequest />} />
          </Route>
          <Route
            path="map"
            element={
              <Suspense fallback={<RouteLoader />}>
                <TestPage />
              </Suspense>
            }
          />

          {/* Default route for unmatched paths */}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoute;
