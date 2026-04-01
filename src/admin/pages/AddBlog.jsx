import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { UploadCloud, X, Loader2, Image as ImageIcon, Send, Plus, Trash2, Edit3, Layers, Video } from "lucide-react";

const AddBlog = () => {
  const [formData, setFormData] = useState({ 
    title: "", category: "", excerpt: "", content: "", author: "Ashish Kumar", readTime: "", videoUrl: "" 
  });
  
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [previews, setPreviews] = useState({ main: "", gallery: [] });
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const CLOUD_NAME = "ddnzmeqmc"; 
  const UPLOAD_PRESET = "orgosaga";

  useEffect(() => {
    const unsubCat = onSnapshot(collection(db, "blog_categories"), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCategories(list);
      if (list.length > 0 && !formData.category) setFormData(prev => ({ ...prev, category: list[0].name }));
    });

    const qBlogs = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubBlogs = onSnapshot(qBlogs, (snap) => {
      setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubCat(); unsubBlogs(); };
  }, []);

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviews(prev => ({ ...prev, main: URL.createObjectURL(file) }));
    }
  };

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => ({ ...prev, gallery: [...prev.gallery, ...newPreviews] }));
  };

  const addCategory = async () => {
    if (!newCat) return;
    await addDoc(collection(db, "blog_categories"), { name: newCat });
    setNewCat("");
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Delete category?")) await deleteDoc(doc(db, "blog_categories", id));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
    const resData = await res.json();
    return resData.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage && !editingId) return alert("Bhai, image upload karo!");
    setUploading(true);

    try {
      let mainImageUrl = formData.image || "";
      if (mainImage) mainImageUrl = await uploadToCloudinary(mainImage);

      const galleryUrls = editingId ? [...(formData.gallery || [])] : [];
      for (const img of galleryImages) {
        const url = await uploadToCloudinary(img);
        galleryUrls.push(url);
      }

      const finalData = {
        ...formData,
        image: mainImageUrl,
        gallery: galleryUrls,
        updatedAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      if (editingId) {
        await updateDoc(doc(db, "blogs", editingId), finalData);
        alert("Updated! 🌿");
      } else {
        await addDoc(collection(db, "blogs"), { ...finalData, createdAt: serverTimestamp() });
        alert("Published! 🌿");
      }
      resetForm();
    } catch (err) {
      alert("Error uploading.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: categories[0]?.name || "", excerpt: "", content: "", author: "Ashish Kumar", readTime: "", videoUrl: "" });
    setMainImage(null); setGalleryImages([]);
    setPreviews({ main: "", gallery: [] });
    setEditingId(null);
  };

  const handleEdit = (blog) => {
    setFormData(blog);
    setEditingId(blog.id);
    setPreviews({ main: blog.image, gallery: blog.gallery || [] });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 italic leading-none">
              Diary <span className="text-green-600">Engine</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 ml-1">Editorial Control Suite</p>
          </div>
          {editingId && <button onClick={resetForm} className="w-full md:w-auto bg-red-50 text-red-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm active:scale-95">Cancel Edit</button>}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-2xl">
              <div className="space-y-6">
                <input required type="text" placeholder="STORY HEADLINE" className="w-full bg-slate-50 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-green-600/20 shadow-inner" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2"><Video size={12} /> Video Link (YT/Insta)</label>
                  <input type="url" placeholder="VIDEO URL..." className="w-full bg-slate-50 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-green-600/20 shadow-inner" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select className="w-full bg-slate-50 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-green-600/20 shadow-inner appearance-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <input required type="text" placeholder="READ TIME (5 MIN)" className="w-full bg-slate-50 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-green-600/20 shadow-inner" value={formData.readTime} onChange={(e) => setFormData({...formData, readTime: e.target.value})} />
                </div>

                <textarea required rows="2" placeholder="SHORT INTRO..." className="w-full bg-slate-50 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-green-600/20 shadow-inner" value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} />
                <textarea required rows="8" placeholder="STORY CONTENT..." className="w-full bg-slate-50 p-4 md:p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-green-600/20 shadow-inner font-medium" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
              </div>

              {/* Gallery Preview */}
              {previews.gallery.length > 0 && (
                <div className="mt-6 grid grid-cols-4 md:grid-cols-6 gap-3 p-4 bg-slate-50 rounded-2xl">
                  {previews.gallery.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden relative group border border-white shadow-sm">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => {
                        setGalleryImages(galleryImages.filter((_, idx) => idx !== i));
                        setPreviews(p => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }));
                      }} className="absolute inset-0 bg-red-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} className="text-white"/></button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-green-600 transition-all flex items-center justify-center gap-4 mt-8 shadow-xl active:scale-95 disabled:opacity-50">
                {uploading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18}/> {editingId ? "Update Story" : "Publish Story"}</>}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Visuals Sidebar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Main Cover</p>
                <label className="block aspect-[4/5] cursor-pointer border-2 border-dashed border-slate-100 rounded-2xl relative overflow-hidden group">
                  {previews.main ? <img src={previews.main} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-slate-300"><UploadCloud size={30}/><span className="text-[8px] font-black uppercase mt-2">Upload Cover</span></div>}
                  <input type="file" hidden onChange={handleMainImage} accept="image/*" />
                </label>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Plus size={14}/> Add Gallery</p>
                <label className="flex items-center justify-center h-14 cursor-pointer border-2 border-dashed border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-300">
                  <Plus size={20}/>
                  <input type="file" hidden multiple onChange={handleGalleryImages} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Category Sidebar */}
            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-2xl space-y-6">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> Channels</p>
              <div className="flex gap-2">
                <input type="text" placeholder="NEW..." className="flex-1 bg-white/5 p-3 rounded-xl text-[10px] font-bold outline-none border border-white/10" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
                <button type="button" onClick={addCategory} className="bg-green-600 p-3 rounded-xl"><Plus size={18}/></button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2 no-scrollbar">
                {categories.map(c => (
                  <div key={c.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl group">
                    <span className="text-[9px] font-black uppercase tracking-widest">{c.name}</span>
                    <button type="button" onClick={() => deleteCategory(c.id)} className="text-red-500 opacity-100 transition-all"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* --- Published Stories List --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 ml-2">
             <div className="w-8 h-1 bg-green-600 rounded-full" />
             <h3 className="text-2xl font-black uppercase italic tracking-tighter">Published <span className="text-green-600">Ledger</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-xl flex items-center gap-4 transition-all">
                <img src={blog.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black uppercase truncate italic">{blog.title}</h4>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{blog.category} • {blog.date}</p>
                </div>
                {/* 🚀 Mobile Visibility Fix: Opacity removed so they show on phones */}
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(blog)} className="p-2 bg-slate-50 rounded-lg text-slate-600 active:bg-green-600 active:text-white transition-all"><Edit3 size={14}/></button>
                  <button onClick={async () => { if(window.confirm("Bhai, delete kar dein?")) await deleteDoc(doc(db, "blogs", blog.id)); }} className="p-2 bg-red-50 rounded-lg text-red-500 active:bg-red-500 active:text-white transition-all"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;