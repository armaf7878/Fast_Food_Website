import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/common/LoginPage";
import RegisterPage from "./pages/common/RegisterPage";
import HomePage from "./pages/common/HomePage.jsx";
import DashboardPage from "./pages/admin/DashboardPage";
import AccountPage from "./pages/user/AccountPage";
import UserLayout from "./layouts/UserLayout";
import MenuPage from "./pages/common/MenuPage.jsx";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/cart/CheckoutPage";
import StaffPage from "./pages/staff/StaffPage.jsx";
import ShipperPage from "./pages/shipper/ShipperPage.jsx";
import PromotionsPage from "./pages/common/PromotionsPage.jsx"; 
import PopularRestaurantsPage from "./pages/common/PopularRestaurantsPage.jsx"; 
import ApplicationForm from "./pages/common/ApplicationForm.jsx"; 
import { jwtDecode } from "jwt-decode";
import OrderTrackingPage from "./pages/cart/OrderTrackingPage.jsx"; 
import 'leaflet/dist/leaflet.css';

// Component bảo vệ route dựa trên vai trò người dùng (Giữ nguyên)
function ProtectedRoute({ children, roles }) {
  const currentUser = localStorage.getItem("currentUser") ;
  if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

  const user = jwtDecode(currentUser);
  
  if (roles && !roles.includes(user.role)) {
    alert("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:cateId" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/promotions" element={<PromotionsPage />} /> 
        <Route path="/restaurants" element={<PopularRestaurantsPage />} /> 

        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        
        <Route path="/apply" element={<ApplicationForm />} /> 

        <Route
          path="/account"
          element={
            <UserLayout>
              <ProtectedRoute roles={["user", "admin", "staff", "shipper"]}>
                <AccountPage />
              </ProtectedRoute>
            </UserLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["admin", "staff", "shipper"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute roles={["staff"]}>
              <StaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipper/dashboard"
          element={
            <ProtectedRoute roles={["shipper"]}>
              <ShipperPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
