import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AccountRecovery from "./features/auth/pages/AccountRecovery";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Admin from "./features/admin/pages/Admin";
import Board from "./features/board/pages/Board";
import BookDetail from "./features/books/pages/BookDetail";
import BookSearch from "./features/books/pages/BookSearch";
import Cart from "./features/cart/pages/Cart";
import Index from "./features/home/pages/Index";
import SecurityLabs from "./features/labs/pages/SecurityLabs";
import Mypage from "./features/mypage/pages/Mypage";
import GuestOrderLookup from "./features/orders/pages/GuestOrderLookup";
import OrderDetail from "./features/orders/pages/OrderDetail";
import Orders from "./features/orders/pages/Orders";
import CustomerService from "./features/support/pages/CustomerService";
import Events from "./features/support/pages/Events";
import PrivacyPolicy from "./features/support/pages/PrivacyPolicy";
import TermsOfService from "./features/support/pages/TermsOfService";
import NotFound from "./features/system/pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/books" element={<BookSearch />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account-recovery" element={<AccountRecovery />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms/service" element={<TermsOfService />} />
              <Route path="/terms/privacy" element={<PrivacyPolicy />} />
              <Route path="/guest-orders" element={<GuestOrderLookup />} />
              <Route path="/events" element={<Events />} />
              <Route path="/security-labs" element={<SecurityLabs />} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/orders/:orderId" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
              <Route path="/mypage/*" element={<PrivateRoute><Mypage /></PrivateRoute>} />
              <Route path="/customer-service" element={<CustomerService />} />
              <Route path="/board" element={<PrivateRoute><Board /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
