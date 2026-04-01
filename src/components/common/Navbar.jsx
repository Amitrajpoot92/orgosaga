import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ShoppingBasket, Leaf } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  // 🚀 Added "Blog" to the navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Blog", path: "/blog" }, // 👈 New Option
    { name: "Cart", path: "/cart" },
    { name: "Track Order", path: "/track-order" },
  ];

  const getUserDisplayName = () => {
    if (!user) return null;
    return user.name || user.displayName || user.email?.split("@")[0] || "Guest";
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full transition-all duration-500 z-[999] ${
          scrolled || isOpen ? "bg-slate-950 py-3 border-b border-white/10 shadow-2xl" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Logo Section */}
          <Link to="/" onClick={() => setIsOpen(false)} className="relative z-[1001] flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-600/20">
              <Leaf className="text-white" size={16} />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white italic uppercase leading-none tracking-tighter">
              Orgo<span className="text-green-500">Saga</span>
            </h1>
          </Link>

          {/* Desktop Navigation - Adjusted spacing for 5 links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-[9px] font-black uppercase tracking-[0.25em] transition-all hover:text-green-500 ${
                  location.pathname === link.path ? "text-green-500" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-4 relative z-[1001]">
            {user && user.email ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end leading-none">
                  <span className="text-[7px] font-black text-green-500 uppercase italic tracking-widest leading-none">Organic Member</span>
                  <span className="text-white font-bold text-[10px] uppercase truncate max-w-[100px]">
                    {getUserDisplayName()}
                  </span>
                </div>
                <button 
                  onClick={() => { if(window.confirm("Bhai, logout karna hai?")) logout(); }}
                  className="w-8 h-8 bg-white/5 text-white rounded-lg flex items-center justify-center hover:bg-red-600/20 hover:text-red-500 transition-all border border-white/10"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all shadow-lg shadow-green-600/10 active:scale-95 leading-tight flex items-center justify-center min-h-[32px]"
              >
                Join Store
              </button>
            )}

            <button className="lg:hidden text-white w-8 h-8 flex items-center justify-center" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar System */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-[#050805] z-[998] flex flex-col justify-between p-8 pt-28"
          >
            <div className="space-y-6 relative z-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                  className={`text-4xl font-black italic uppercase tracking-tighter block transition-colors ${
                    location.pathname === link.path ? "text-green-600" : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-6 border-t border-white/5">
                {user && user.email ? (
                  <div className="space-y-4">
                    <p className="text-green-500 font-black italic text-xl uppercase tracking-tighter">
                      Hi, {getUserDisplayName()}!
                    </p>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-white/30 font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
                      <LogOut size={14} /> Logout Session
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setIsLoginModalOpen(true); setIsOpen(false); }} className="w-full py-4 bg-green-600 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-xl italic shadow-xl active:scale-95">
                    Member Login
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Footer Context */}
            <div className="relative z-10 border-t border-white/10 pt-8 flex justify-between items-center text-white">
               <div className="space-y-1">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Customer Support</p>
                 <p className="text-sm font-black italic">+91 79 7980 1929</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black italic text-green-500">OS</div>
            </div>

            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
               <h2 className="text-[45vw] font-black italic text-white uppercase leading-none">OS</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Navbar;