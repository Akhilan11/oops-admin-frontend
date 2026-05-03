import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from './data/dataLayer';
import StatusBadge from '../../shared/StatusBadge';
import ConfirmModal from '../../shared/ConfirmModal';
import { formatCurrency } from '../../utils/formatters';

// Wrapper that shows dotted underline to indicate "editable" — always visible, darker on hover
function EditableHint({ children, to }) {
  return (
    <Link to={to} className="group relative inline-block border-b border-dashed border-warmblack/15 hover:border-warmblack/40 transition-colors duration-200 pb-0.5">
      {children}
      <span className="absolute -right-5 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-50 transition-opacity duration-200">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
      </span>
    </Link>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, deleteProduct } = useProducts();
  const product = products.find((p) => String(p.id) === id);

  const [showDelete, setShowDelete] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-lg font-bold text-warmblack/25">Product not found</p>
        <Link to="/products" className="mt-3 text-sm font-semibold text-warmblack/40 hover:text-warmblack transition-colors underline underline-offset-4">Back to products</Link>
      </div>
    );
  }

  const editUrl = `/products/${product.id}/edit`;
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const relatedProducts = products.filter((p) => product.related?.includes(p.id));
  const stock = product.stock || {};
  const totalStock = Object.values(stock).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const handleDelete = () => {
    deleteProduct(product.id);
    navigate('/products', { replace: true });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link to="/products" className="text-xs text-warmblack/30 hover:text-warmblack transition-colors duration-200">Products</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warmblack/15"><polyline points="9 18 15 12 9 6" /></svg>
        <span className="text-xs text-warmblack/60 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left — Images */}
        <div className="lg:col-span-5">
          {images.length > 0 ? (
            <div>
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="aspect-[4/5] rounded-2xl overflow-hidden bg-warmblack/[0.02] mb-3"
              >
                <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              </motion.div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        i === activeImage ? 'border-warmblack ring-1 ring-warmblack/10' : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[4/5] rounded-2xl bg-warmblack/[0.02] flex items-center justify-center">
              <p className="text-sm text-warmblack/15 font-semibold">No images</p>
            </div>
          )}
        </div>

        {/* Right — Product Info */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                {product.category && (
                  <EditableHint to={editUrl}>
                    <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-ash">[ {product.category} ]</p>
                  </EditableHint>
                )}
                <StatusBadge status={product.status} />
              </div>
              <div className="flex flex-col gap-2">
                <EditableHint to={editUrl}>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">{product.name}</h1>
                </EditableHint>
                <EditableHint to={editUrl}>
                  <p className="text-xl font-bold tabular-nums text-warmblack">{formatCurrency(product.price)}</p>
                </EditableHint>
              </div>
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <EditableHint to={editUrl}>
                <p className="text-sm text-warmblack/50 leading-relaxed mb-6">{product.shortDesc}</p>
              </EditableHint>
            )}

            {/* Full Description */}
            {product.description && (
              <div className="mb-8">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ash mb-3">[ description ]</p>
                <EditableHint to={editUrl}>
                  <p className="text-sm text-warmblack/60 leading-relaxed">{product.description}</p>
                </EditableHint>
              </div>
            )}

            <hr className="border-warmblack/5 mb-8" />

            {/* Sizes & Stock */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ash">[ sizes & stock ]</p>
                  {totalStock > 0 && (
                    <EditableHint to={editUrl}>
                      <span className="text-[10px] font-bold text-warmblack/30">{totalStock} total units</span>
                    </EditableHint>
                  )}
                </div>
                <EditableHint to={editUrl}>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const qty = stock[size];
                      const hasStock = qty !== undefined;
                      return (
                        <div key={size} className="flex flex-col items-center">
                          <span className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-colors ${
                            hasStock && qty > 0
                              ? 'border-warmblack/10 text-warmblack/60 bg-white'
                              : hasStock && qty === 0
                                ? 'border-red-200 text-red-400 bg-red-50/50'
                                : 'border-warmblack/10 text-warmblack/60'
                          }`}>
                            {size}
                          </span>
                          {hasStock && (
                            <span className={`text-[9px] font-bold mt-1 ${qty === 0 ? 'text-red-400' : 'text-warmblack/30'}`}>
                              {qty === 0 ? 'Out' : qty}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </EditableHint>
              </div>
            )}

            {/* Fabric & Care */}
            {(product.fabric?.composition || product.fabric?.care) && (
              <div className="mb-8">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ash mb-3">[ fabric & care ]</p>
                <EditableHint to={editUrl}>
                  <div className="rounded-2xl border border-warmblack/5 bg-warmblack/[0.01] p-5 space-y-2">
                    {product.fabric.composition && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-warmblack/30 w-24 shrink-0">Composition</span>
                        <span className="text-sm text-warmblack/60">{product.fabric.composition}</span>
                      </div>
                    )}
                    {product.fabric.care && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-warmblack/30 w-24 shrink-0">Care</span>
                        <span className="text-sm text-warmblack/60">{product.fabric.care}</span>
                      </div>
                    )}
                  </div>
                </EditableHint>
              </div>
            )}

            {/* Shipping */}
            {product.shipping && (
              <div className="mb-8">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ash mb-3">[ shipping ]</p>
                <EditableHint to={editUrl}>
                  <p className="text-sm text-warmblack/50 leading-relaxed">{product.shipping}</p>
                </EditableHint>
              </div>
            )}

            <hr className="border-warmblack/5 mb-8" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={editUrl}
                  className="px-6 py-3 bg-warmblack text-white text-xs font-bold tracking-wide rounded-lg hover:bg-warmblack/90 transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Edit Product
                </Link>
              </motion.div>
              <button
                onClick={() => setShowDelete(true)}
                className="px-5 py-3 text-xs font-bold tracking-wide text-clay/60 hover:text-clay border border-warmblack/5 rounded-lg hover:border-clay/20 transition-all duration-200"
              >
                Delete
              </button>
            </div>

            {/* Edit hint */}
            <p className="text-[9px] text-warmblack/20 mt-4 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              Hover over any text with a dotted underline to edit
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <hr className="border-warmblack/5 mb-10" />
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ash mb-6">[ related products ]</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                to={`/products/${rp.id}`}
                className="group"
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-warmblack/[0.02] mb-3">
                  {(rp.image || rp.images?.[0]) ? (
                    <img src={rp.image || rp.images[0]} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-warmblack/10 text-xs font-bold">No image</div>
                  )}
                </div>
                <p className="text-sm font-semibold text-warmblack tracking-tight">{rp.name}</p>
                <p className="text-xs text-warmblack/30 mt-0.5 tabular-nums">{formatCurrency(rp.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal show={showDelete} title="Delete Product" message={`Are you sure you want to delete "${product.name}"? This cannot be undone.`}
        onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </div>
  );
}
