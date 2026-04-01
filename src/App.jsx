import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// --- Magic Scroll Component ---
import ScrollToTop from "./components/ScrollToTop"; 

// --- User Components & Pages ---
import Navbar from "./components/common/Navbar"; 
import Footer from "./components/common/Footer"; 
import Home from "./pages/home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout"; 
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/about"; 
import Blog from "./pages/Blog"; 

// --- Admin Components & Pages ---
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import AddProduct from "./admin/pages/AddProduct";
import AllProducts from "./admin/pages/AllProducts";
import Orders from "./admin/pages/Orders";
import AdminLogin from "./admin/pages/Login";
import Customers from "./admin/pages/customers"; 
import Revenue from "./admin/pages/revenue";
import AddBlog from "./admin/pages/AddBlog"; // 🚀 Fixed Import (Pehle yahan Revenue likha tha)

// Protected Route Component (100% Secured for Admin)
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  // 1. Security Check: अगर कोई लॉगिन नहीं है, तो एडमिन लॉगिन पेज पर भेजें
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. MAIN SECURITY Check: अगर यूजर लॉगिन है, लेकिन एडमिन नहीं है
  if (user.role !== "admin") {
    alert("🚨 Access Denied! You are not an Admin.");
    return <Navigate to="/" replace />; 
  }

  // 3. अगर वो असली एडमिन है, तब ही एडमिन पैनल देखने दें
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          
          <Routes>
            
            {/* 1. PUBLIC WEBSITE ROUTES */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/about" element={<About />} /> 
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />

            {/* 2. ADMIN LOGIN ROUTE */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 3. PROTECTED ADMIN PANEL ROUTES */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute> 
                  <AdminLayout /> 
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="all-products" element={<AllProducts />} />
              <Route path="orders" element={<Orders />} />
              <Route path="revanue" element={<Revenue />} />
              <Route path="customer" element={<Customers />} />
              <Route path="add-blog" element={<AddBlog />} /> {/* 👈 Naya Diary/Blog Route */}
              
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* 🔄 GLOBAL REDIRECTION */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;