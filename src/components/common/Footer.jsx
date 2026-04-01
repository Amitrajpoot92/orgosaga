import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Instagram, Youtube, ArrowUpRight, Globe, 
  ShieldCheck, Zap, X, ShieldAlert, FileText, Lock, Leaf 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState(null); 

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/products" },
    { name: "My Cart", path: "/cart" },
    { name: "Track Order", path: "/track-order" },
  ];

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-slate-100 relative font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* 1. Logo & Mission */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
              Orgo<span className="text-green-600">Saga</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
              Bringing the purest essence of nature to your home. Based in Bhopal.
            </p>
            
            {/* 🚀 Social Media */}
            <div className="flex gap-5">
              <a 
                href="https://www.instagram.com/gs_sports_mairwa?igsh=aG5pNTBkcnhqY2x5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-900 hover:text-green-600 transition-all hover:-translate-y-1"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com/@vikashthakur9046?si=dcKhg5STz4rSfWXd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-900 hover:text-red-600 transition-all hover:-translate-y-1"
              >
                <Youtube size={22} />
              </a>
            </div>
          </div>

          {/* 2. Explore Harvest */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600">Explore Harvest</h4>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm font-black uppercase italic text-slate-900 hover:text-green-600 transition-all flex items-center gap-1 group">
                    {item.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Support & Admin Access */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/admin/login" className="text-sm font-black uppercase italic text-green-600 hover:text-slate-900 transition-all flex items-center gap-2">
                  <Lock size={12} /> Admin Console
                </Link>
              </li>
              <li>
                <button onClick={() => setModalType('privacy')} className="text-sm font-black uppercase italic text-slate-900 hover:text-green-600 transition-all text-left">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => setModalType('terms')} className="text-sm font-black uppercase italic text-slate-900 hover:text-green-600 transition-all text-left">Terms & Conditions</button>
              </li>
              <li>
                <Link to="/about" className="text-sm font-black uppercase italic text-slate-900 hover:text-green-600 transition-all">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* 4. Quick Info */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600">Pure Quality</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Leaf size={14} className="text-green-600" />
                <span className="text-[11px] font-black uppercase italic tracking-tight">100% Organic Certified</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-[11px] font-black uppercase italic tracking-tight">Chemical Free Produce</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900">
                <Globe size={14} className="text-green-600" />
                <span className="text-[11px] font-black uppercase italic tracking-tight">Direct Farm Sourcing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black tracking-[0.4em] text-slate-400 uppercase">
            © {currentYear} Orgosaga Nature First
          </p>

          <a 
            href="https://codewebx.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-full hover:bg-green-600 transition-all duration-500 shadow-lg"
          >
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Architected By</span>
            <span className="text-[12px] font-black text-white uppercase tracking-tighter flex items-center gap-2">
              CodeWebX<span className="text-green-500 group-hover:text-white">.in</span>
              <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </span>
          </a>
        </div>
      </div>

      {/* --- POPUP MODAL SYSTEM --- */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setModalType(null)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 20, opacity: 0 }} 
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="bg-slate-950 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {modalType === 'privacy' ? <ShieldAlert className="text-green-600" /> : <FileText className="text-green-600" />}
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">
                    {modalType === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                  </h2>
                </div>
                <button onClick={() => setModalType(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-all"><X size={20}/></button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 text-slate-600 font-medium text-sm leading-relaxed">
                {modalType === 'privacy' ? (
                  <>
                    <p>At <span className="font-black text-slate-900 italic">ORGOSAGA</span>, we respect your health and privacy. This policy outlines how we protect your data.</p>
                    <div className="space-y-4">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic underline decoration-green-600">1. Data Protection</h3>
                      <p>We collect essential information (Name, Phone, Address) only to ensure your fresh harvest reaches you on time.</p>
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic underline decoration-green-600">2. Organic Integrity</h3>
                      <p>Your interaction data is never shared with third-party marketing agencies. We keep it pure, just like our products.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Welcome to the <span className="font-black text-slate-900 italic">ORGOSAGA</span> community. By choosing nature, you agree to these terms:</p>
                    <div className="space-y-4">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic underline decoration-green-600">1. Freshness Guarantee</h3>
                      <p>All orders are processed based on farm availability. Freshness is our priority, so delivery timelines may vary slightly with harvest cycles.</p>
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic underline decoration-green-600">2. Direct Verification</h3>
                      <p>To maintain transparency, orders are confirmed via direct WhatsApp coordination before dispatch.</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;