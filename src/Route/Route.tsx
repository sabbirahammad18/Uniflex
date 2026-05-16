import { Routes, Route } from "react-router-dom"; // Use "react-router" for v7+
import Login from "../pages/Auth/Login";
import AuthLayout from "../layout/AuthLayout";
import Forget from "../pages/Auth/Forget";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Project from "../pages/Project";
import Booking from "../pages/Booking";
import Payment from "../pages/Payment";
import Component from "../Componenets/Component";
import Setting from "../pages/Setting";
import Customer from "../pages/Customer";
import Employee from "../pages/Employee";
import Profile_Customer from "../pages/Profile_customer";
import Payment_History from "../pages/Payment_history";
import Commission from "../pages/commission/Commission";
import Money_receipt from "../pages/Money_receipt";
import All_Statement from "../pages/All_statement";
import Customerpayment from "../pages/Customerpayment";
import Achievement from "../pages/Achievement";
import Paymentrequest from "../pages/paymentrequest";
const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="Forget" element={<Forget />} />
      </Route>

      <Route path="/" element={<Component />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="project" element={<Project />} />
        <Route path="booking" element={<Booking />} />
        <Route path="payment" element={<Payment />} />
        <Route path="setting" element={<Setting />} />
        <Route path="customer" element={<Customer />} />
        <Route path="employee" element={<Employee />} />
        <Route path="profilecustomer" element={<Profile_Customer />} />
        <Route path="paymenthistory" element={<Payment_History />} />
        <Route path="commission" element={<Commission />} />
        <Route path="Moneyreceipt" element={<Money_receipt />} />
        <Route path="allstatement" element={<All_Statement />} />
        <Route path="customerpayment" element={<Customerpayment />} />
        <Route path="achievement" element={<Achievement />} />
        <Route path="request" element={<Paymentrequest />} />
        {/* Default route for unmatched paths */}
      </Route>
    </Routes>
  );
};

export default AppRoute;
