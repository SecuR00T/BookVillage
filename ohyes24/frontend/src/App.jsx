import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import BookDetail from "./pages/BookDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookSearch from "./pages/BookSearch";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Mypage from "./pages/Mypage";
import Admin from "./pages/Admin";
import CustomerService from "./pages/CustomerService";
import Board from "./pages/Board";
import GuestOrderLookup from "./pages/GuestOrderLookup";
import SecurityLabs from "./pages/SecurityLabs";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
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
              <Route path="/register" element={<Register />} />
              <Route path="/terms/service" element={<TermsOfService />} />
              <Route path="/terms/privacy" element={<PrivacyPolicy />} />
              <Route path="/guest-orders" element={<GuestOrderLookup />} />
              <Route path="/security-labs" element={<SecurityLabs />} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/mypage" element={<PrivateRoute><Mypage /></PrivateRoute>} />
              <Route path="/customer-service" element={<PrivateRoute><CustomerService /></PrivateRoute>} />
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
