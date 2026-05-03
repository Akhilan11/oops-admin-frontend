import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from './data/dataLayer';
import { PRODUCT_STATUSES, DEFAULT_SIZES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { resizeImage } from '../../utils/resizeImage';

const empty = {
  name: '',
  shortDesc: '',
  description: '',
  price: '',
  category: '',
  status: 'available',
  sizes: ['S', 'M', 'L', 'XL'],
  image: '',
  images: [],
  fabric: { composition: '', care: '' },
  shipping: 'Free shipping on prepaid orders. Delivery in 5-7 business days.',
  related: [],
  stock: {},
};

// Inline editable text field — dashed bottom border so admins know it's editable
function EditableText({ value, onChange, placeholder, className, multiline = false, type = 'text' }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <Tag
      type={multiline ? undefined : type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-transparent border-0 border-b border-dashed border-warmblack/10 focus:border-warmblack/30 outline-none w-full placeholder-warmblack/20 focus:ring-0 pb-1 resize-none transition-colors ${className}`}
      rows={multiline ? 3 : undefined}
    />
  );
}

// Related products picker dropdown
function RelatedPicker({ allProducts, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = allProducts.filter((p) =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-xs font-semibold text-warmblack/50 hover:text-warmblack border border-dashed border-warmblack/20 hover:border-warmblack/40 rounded-lg px-4 py-2.5 transition-all duration-200 flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        Add Related Product
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-warmblack/20 rounded-2xl shadow-xl z-30 overflow-hidden"
          >
            <div className="p-3 border-b border-warmblack/10">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-warmblack/[0.03] border border-warmblack/10 rounded-lg px-3 py-2 text-sm placeholder-warmblack/30 focus:outline-none focus:ring-2 focus:ring-warmblack/10 focus:border-warmblack/20"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto no-scrollbar">
              {filtered.length === 0 ? (
                <p className="text-sm text-warmblack/25 text-center py-6">No products found</p>
              ) : (
                filtered.map((p) => {
                  const isSelected = selected.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onToggle(p.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${isSelected ? 'bg-warmblack/[0.05] hover:bg-warmblack/[0.07]' : 'hover:bg-warmblack/[0.02]'}`}
                    >
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-warmblack/[0.03] shrink-0">
                        {(p.image || p.images?.[0]) ? (
                          <img src={p.image || p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-warmblack/10 text-[8px]">IMG</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-warmblack truncate">{p.name}</p>
                        <p className="text-xs text-warmblack/30 tabular-nums">{formatCurrency(p.price)}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-warmblack border-warmblack' : 'border-warmblack/20'}`}>
                        {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProducts();
  const isNew = id === 'new';
  const existing = !isNew ? products.find((p) => String(p.id) === id) : null;

  const [form, setForm] = useState(empty);
  const [activeImage, setActiveImage] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fabricOpen, setFabricOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existing) {
      setForm({ ...empty, ...existing, price: String(existing.price || ''), fabric: { ...empty.fabric, ...existing.fabric }, stock: existing.stock || {} });
    } else {
      setForm(empty);
    }
  }, [existing]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const setFabric = (key, val) => setForm((p) => ({ ...p, fabric: { ...p.fabric, [key]: val } }));

  const toggleSize = (size) => {
    setForm((p) => {
      const has = p.sizes.includes(size);
      const newSizes = has ? p.sizes.filter((s) => s !== size) : [...p.sizes, size];
      const newStock = { ...p.stock };
      if (has) { delete newStock[size]; } else { newStock[size] = 0; }
      return { ...p, sizes: newSizes, stock: newStock };
    });
  };

  const setStock = (size, val) => {
    setForm((p) => ({ ...p, stock: { ...p.stock, [size]: Math.max(0, Number(val) || 0) } }));
  };

  const toggleRelated = (productId) => {
    setForm((p) => ({
      ...p,
      related: p.related.includes(productId)
        ? p.related.filter((r) => r !== productId)
        : [...p.related, productId],
    }));
  };

  const handleImageFiles = async (files) => {
    const remaining = 5 - form.images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const results = await Promise.all(toProcess.map((f) => resizeImage(f)));
    const newImages = [...form.images, ...results];
    setForm((p) => ({ ...p, images: newImages, image: newImages[0] || '' }));
  };

  const removeImage = (idx) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    setForm((p) => ({ ...p, images: newImages, image: newImages[0] || '' }));
    if (activeImage >= newImages.length) setActiveImage(Math.max(0, newImages.length - 1));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleImageFiles(e.dataTransfer.files);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const data = { ...form, price: Number(form.price) || 0 };
    if (isNew) {
      addProduct(data);
    } else {
      updateProduct(existing.id, data);
    }
    navigate('/products', { replace: true });
  };

  const otherProducts = products.filter((p) => p.id !== existing?.id);
  const relatedProducts = otherProducts.filter((p) => form.related.includes(p.id));

  if (!isNew && !existing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-lg font-bold text-warmblack/25">Product not found</p>
        <Link to="/products" className="mt-3 text-sm font-semibold text-warmblack/40 hover:text-warmblack transition-colors underline underline-offset-4">Back to products</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link to="/products" className="text-xs text-warmblack/30 hover:text-warmblack transition-colors duration-200">Products</Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warmblack/15"><polyline points="9 18 15 12 9 6" /></svg>
          <span className="text-xs text-warmblack/60 font-medium">{isNew ? 'New Product' : 'Edit Product'}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/products" className="px-4 py-2.5 text-xs font-semibold text-warmblack/30 hover:text-warmblack transition-colors duration-200">
            Cancel
          </Link>
          <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-6 py-2.5 bg-warmblack text-white text-xs font-bold tracking-wide rounded-lg hover:bg-warmblack/90 transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            {isNew ? 'Publish Product' : 'Save Changes'}
          </motion.button>
        </div>
      </div>

      {/* Status & Category bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-warmblack/30">Status</span>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className="text-[11px] font-bold bg-warmblack/[0.03] border-0 rounded-lg px-3 py-1.5 text-warmblack focus:ring-1 focus:ring-warmblack/10 cursor-pointer"
          >
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>{s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* === LIVE PREVIEW LAYOUT (mirrors frontend ProductPage) === */}
      <div className="bg-white rounded-2xl border border-warmblack/15 overflow-hidden shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">

            {/* LEFT — Image Gallery (editable) */}
            <div className="flex flex-col-reverse md:flex-row gap-3">
              {/* Thumbnails */}
              {form.images.length > 0 && (
                <div className="flex md:flex-col gap-2 md:w-20 shrink-0 overflow-x-auto md:overflow-visible">
                  {form.images.map((src, i) => (
                    <div key={i} className="relative group">
                      <button
                        onClick={() => setActiveImage(i)}
                        className={`aspect-square rounded-lg overflow-hidden transition-all w-16 md:w-20 shrink-0 ${
                          i === activeImage ? 'ring-2 ring-warmblack ring-offset-2' : 'hover:ring-1 hover:ring-warmblack/20 opacity-50 hover:opacity-80'
                        }`}
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </button>
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warmblack/70 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >x</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Main image area */}
              <div className="flex-1 flex flex-col">
                <div
                  className={`relative aspect-[4/5] rounded-2xl overflow-hidden transition-colors ${
                    form.images.length > 0 ? 'bg-warmblack/[0.02]' : dragOver ? 'bg-warmblack/[0.04] border-2 border-dashed border-warmblack/20' : 'bg-warmblack/[0.02] border-2 border-dashed border-warmblack/10'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {form.images.length > 0 ? (
                    <>
                      <motion.img
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        src={form.images[activeImage]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {form.images.length < 5 && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-warmblack px-3 py-1.5 rounded-lg text-[10px] font-semibold shadow-sm hover:bg-white transition-colors"
                        >
                          + Add More
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center text-warmblack/20 hover:text-warmblack/40 transition-colors"
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      <span className="text-xs font-semibold mt-3">Click or drag images here</span>
                      <span className="text-[10px] mt-1">Up to 5 images, 4:5 ratio recommended</span>
                    </button>
                  )}
                </div>

                {/* Dots */}
                {form.images.length > 1 && (
                  <div className="flex items-center justify-center gap-[6px] py-4">
                    {form.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`h-[5px] rounded-full transition-all duration-300 ${
                          i === activeImage ? 'w-5 bg-warmblack/40' : 'w-[5px] bg-warmblack/10 hover:bg-warmblack/20'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-warmblack/25 mt-1">{form.images.length}/5 images</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { if (e.target.files.length) handleImageFiles(e.target.files); e.target.value = ''; }}
              />
            </div>

            {/* RIGHT — Product Info (editable, mirrors frontend) */}
            <div className="md:sticky md:top-20">
              {/* Category */}
              <div className="mb-3">
                <EditableText
                  value={form.category}
                  onChange={(v) => set('category', v)}
                  placeholder="category"
                  className="text-[10px] font-semibold tracking-[0.4em] uppercase text-ash"
                />
              </div>

              {/* Name */}
              <EditableText
                value={form.name}
                onChange={(v) => set('name', v)}
                placeholder="Product Name"
                className="font-extrabold text-2xl md:text-4xl tracking-tight leading-tight text-warmblack"
              />

              {/* Price */}
              <div className="flex items-center gap-1 mt-3">
                <span className="text-xl font-bold text-warmblack">Rs.</span>
                <EditableText
                  value={form.price}
                  onChange={(v) => set('price', v)}
                  placeholder="0"
                  type="number"
                  className="text-xl font-bold text-warmblack tabular-nums w-32"
                />
              </div>

              {/* Short desc */}
              {form.status !== 'available' && (
                <span className="inline-block mt-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-ash">
                  {form.status === 'sold-out' ? 'Sold Out' : 'Coming Soon'}
                </span>
              )}

              <div className="w-10 h-px bg-warmblack/10 my-5" />

              {/* Description */}
              <EditableText
                value={form.description}
                onChange={(v) => set('description', v)}
                placeholder="Write the product description here... This is what customers will see on the product page."
                multiline
                className="text-base text-ash leading-relaxed"
              />

              {/* Short description */}
              <div className="mt-4">
                <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-warmblack/20 mb-1">Short tagline</p>
                <EditableText
                  value={form.shortDesc}
                  onChange={(v) => set('shortDesc', v)}
                  placeholder="A short tagline for cards and listings"
                  className="text-sm text-warmblack/50"
                />
              </div>

              {/* Sizes & Stock */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-ash">Size & Stock</p>
                  <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-warmblack/25">Click size to toggle, enter stock qty</span>
                </div>
                <div className="flex gap-3">
                  {DEFAULT_SIZES.map((size) => {
                    const active = form.sizes.includes(size);
                    return (
                      <div key={size} className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => toggleSize(size)}
                          className={`w-12 h-12 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            active
                              ? 'bg-warmblack text-white'
                              : 'border border-warmblack/10 text-warmblack/20 hover:border-warmblack/25'
                          }`}
                        >
                          {size}
                        </button>
                        {active && (
                          <input
                            type="number"
                            min="0"
                            value={form.stock[size] ?? ''}
                            onChange={(e) => setStock(size, e.target.value)}
                            placeholder="0"
                            className="w-12 text-center text-[11px] font-bold tabular-nums bg-warmblack/[0.03] border border-warmblack/8 rounded-md py-1 text-warmblack placeholder-warmblack/20 focus:outline-none focus:ring-1 focus:ring-warmblack/10"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add to Bag preview (disabled, just for visual) */}
              <div className="mt-5">
                <div className="w-full bg-warmblack/10 text-warmblack/30 py-4 rounded-lg text-sm font-bold text-center cursor-default">
                  Add to Bag (Preview)
                </div>
              </div>

              {/* Accordion — Fabric & Care */}
              <div className="flex flex-col gap-2 mt-5">
                <div className="border border-warmblack/15 rounded-xl overflow-hidden">
                  <button onClick={() => setFabricOpen(!fabricOpen)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-warmblack/[0.02] transition-colors">
                    <span className="text-base shrink-0">&#9729;</span>
                    <span className="text-sm font-semibold flex-1">Fabric & Care</span>
                    <span className="text-xs text-ash shrink-0 transition-transform duration-200" style={{ transform: fabricOpen ? 'rotate(180deg)' : 'none' }}>&#9662;</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {fabricOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-warmblack/40 mb-1">Composition</p>
                            <EditableText value={form.fabric.composition} onChange={(v) => setFabric('composition', v)} placeholder="e.g. 100% Cotton" className="text-sm text-ash leading-[1.7]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-warmblack/40 mb-1">Care</p>
                            <EditableText value={form.fabric.care} onChange={(v) => setFabric('care', v)} placeholder="e.g. Cold wash. Hang dry." className="text-sm text-ash leading-[1.7]" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border border-warmblack/15 rounded-xl overflow-hidden">
                  <button onClick={() => setShippingOpen(!shippingOpen)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-warmblack/[0.02] transition-colors">
                    <span className="text-base shrink-0">&#9993;</span>
                    <span className="text-sm font-semibold flex-1">Shipping & Returns</span>
                    <span className="text-xs text-ash shrink-0 transition-transform duration-200" style={{ transform: shippingOpen ? 'rotate(180deg)' : 'none' }}>&#9662;</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {shippingOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-4 pb-4 pt-0 space-y-2">
                          <EditableText value={form.shipping} onChange={(v) => set('shipping', v)} placeholder="Shipping info..." className="text-sm text-ash leading-[1.7]" />
                          <p className="text-sm text-ash leading-[1.7]">Returns accepted within 7 days. Unworn, tags attached.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Section — outside the editor card */}
      <div className="mt-10 rounded-2xl border border-warmblack/15 bg-warmblack/[0.02] p-6 md:p-10 shadow-sm">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-ash mb-1">More from Oops</p>
        <h3 className="font-extrabold text-2xl md:text-3xl tracking-tight mb-4">You might also like</h3>
        <div className="w-10 h-px bg-warmblack/15 mb-8" />

        {relatedProducts.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar mb-6">
            {relatedProducts.map((p) => (
              <div key={p.id} className="shrink-0 w-56 md:w-64 group relative">
                <button
                  onClick={() => toggleRelated(p.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-warmblack/70 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >x</button>
                <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-white border border-warmblack/10">
                  {(p.image || p.images?.[0]) ? (
                    <img src={p.image || p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-warmblack/15 text-xs font-semibold">No image</div>
                  )}
                </div>
                <p className="text-sm font-bold tracking-tight text-warmblack">{p.name}</p>
                <p className="text-sm text-ash mt-0.5 tabular-nums">{formatCurrency(p.price)}</p>
              </div>
            ))}
          </div>
        )}

        {relatedProducts.length === 0 && (
          <p className="text-sm text-warmblack/30 mb-6">No related products added yet. Use the button below to add some.</p>
        )}

        {otherProducts.length > 0 && (
          <RelatedPicker
            allProducts={otherProducts}
            selected={form.related}
            onToggle={toggleRelated}
          />
        )}

        {otherProducts.length === 0 && (
          <p className="text-sm text-warmblack/20">No other products available to link</p>
        )}
      </div>
    </div>
  );
}
