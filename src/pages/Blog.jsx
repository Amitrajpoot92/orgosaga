import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Calendar, Search, Leaf, Loader2, Play, ExternalLink, X, ImageIcon } from "lucide-react";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  
  // 🚀 Popup State
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubBlogs = onSnapshot(q, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubCat = onSnapshot(collection(db, "blog_categories"), (snap) => {
      const catList = snap.docs.map(d => d.data().name);
      setCategories(["All", ...catList]);
    });

    return () => { unsubBlogs(); unsubCat(); };
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedStory) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [selectedStory]);

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-green-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Unfolding Diaries...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 font-sans relative">
      
      {/* 🌿 1. Hero Header */}
      <section className="pt-32 md:pt-40 pb-16 px-6 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
            <Leaf size={14} /> The Harvest Journal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            OrgoSaga <span className="text-green-500 text-outline-white">Diaries</span>
          </motion.h1>
          <motion.p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">
            Premium organic insights curated by <b>Ashish Kumar</b>.
          </motion.p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black italic text-white/5 pointer-events-none select-none">OS</div>
      </section>

      {/* 🔍 2. Search & Filters */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 mb-16">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input type="text" placeholder="SEARCH THE DIARIES..." className="w-full bg-slate-50 py-4 pl-14 pr-4 rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 ring-green-600/10 transition-all tracking-widest" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-green-600 text-white border-green-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:text-green-600'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 📰 3. Blog Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, index) => (
              <motion.article key={blog.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-6 shadow-2xl bg-slate-100">
                  <img src={blog.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={blog.title}/>
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase text-green-700 shadow-lg tracking-[0.1em]">{blog.category}</span>
                  </div>
                </div>

                <div className="space-y-4 px-2 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-green-600"/> {blog.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-green-600"/> {blog.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-green-600 transition-colors leading-tight">{blog.title}</h2>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">{blog.excerpt}</p>

                  <div className="pt-4 mt-auto space-y-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-900 uppercase flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-900 text-green-500 rounded-full flex items-center justify-center font-black italic shadow-inner">A</div>
                        ASHISH KUMAR (ADMIN)
                      </span>
                      {/* 🚀 Click to Open Popup */}
                      <button onClick={() => setSelectedStory(blog)} className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 hover:text-green-600 transition-all group-hover:gap-2">
                        Experience Story <ArrowRight size={14}/>
                      </button>
                    </div>

                    {blog.videoUrl && (
                      <a href={blog.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-slate-900 hover:bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 transition-all group/btn shadow-xl active:scale-95">
                        <Play size={14} className="fill-white" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Watch Reel Story</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 🚀 4. DYNAMIC STORY MODAL (Popup) */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4 py-6 md:p-12">
            {/* Overlay */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStory(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            
            {/* Modal Content */}
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="relative bg-white w-full max-w-4xl max-h-full overflow-y-auto rounded-[2.5rem] shadow-2xl no-scrollbar">
              
              {/* Close Button */}
              <button onClick={() => setSelectedStory(null)} className="absolute top-6 right-6 z-20 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                <X size={20} />
              </button>

              <div className="flex flex-col">
                {/* Header Image */}
                <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden">
                   <img src={selectedStory.image} className="w-full h-full object-cover" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>

                {/* Body */}
                <div className="p-8 md:p-12 -mt-20 relative z-10 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-black text-green-600 uppercase tracking-[0.3em]">
                      <Leaf size={14} /> {selectedStory.category} • {selectedStory.date}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic leading-[0.95] tracking-tighter">
                      {selectedStory.title}
                    </h2>
                  </div>

                  {/* Detailed Story (Admin Content) */}
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">
                      {selectedStory.content}
                    </p>
                  </div>

                  {/* 🖼️ Gallery Section (If exists) */}
                  {selectedStory.gallery && selectedStory.gallery.length > 0 && (
                    <div className="space-y-4 border-t pt-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon size={14}/> Visual Gallery
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedStory.gallery.map((img, i) => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md">
                            <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Action */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t pt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-950 text-green-500 rounded-full flex items-center justify-center font-black italic shadow-xl">A</div>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">Ashish Kumar</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Chief Editorial, OrgoSaga</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedStory(null)} className="px-8 py-3 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
                      Close Diary
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📬 5. Newsletter Footer (Standard OrgoSaga design) */}
      <section className="max-w-6xl mx-auto px-6 mt-32">
        <div className="bg-slate-950 rounded-[3rem] p-10 md:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl border-b-8 border-green-600">
          <div className="absolute top-0 right-0 w-80 h-80 bg-green-600/10 rounded-full blur-[120px]" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">The <span className="text-green-500">Organic</span> Circle</h2>
            <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto pt-6">
              <input type="email" placeholder="ENTER YOUR EMAIL" className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white text-[11px] font-black outline-none focus:border-green-500 transition-all tracking-widest" />
              <button className="bg-green-600 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl active:scale-95">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;