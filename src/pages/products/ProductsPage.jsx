import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from './data/dataLayer';
import ProductTable from './components/ProductTable';
import ConfirmModal from '../../shared/ConfirmModal';
import ExportCSV from '../../shared/ExportCSV';

const PRODUCT_CSV_COLUMNS = [
  { label: 'ID', accessor: (p) => p.id },
  { label: 'Name', accessor: (p) => p.name },
  { label: 'Category', accessor: (p) => p.category || '' },
  { label: 'Price', accessor: (p) => p.price || 0 },
  { label: 'Status', accessor: (p) => p.status },
  { label: 'Sizes', accessor: (p) => p.sizes?.join(', ') || '' },
  { label: 'Total Stock', accessor: (p) => p.stock ? Object.values(p.stock).reduce((s, v) => s + (Number(v) || 0), 0) : '' },
  { label: 'Description', accessor: (p) => p.shortDesc || '' },
];

export default function ProductsPage() {
  const { products, deleteProduct } = useProducts();
  const [deleting, setDeleting] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-ash mb-2">[ inventory ]</p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">Products</h2>
          <p className="text-sm text-warmblack/30 mt-1">{products.length} products in catalog</p>
        </div>
        <div className="flex items-center gap-4">
          <ExportCSV data={products} columns={PRODUCT_CSV_COLUMNS} filename="products.csv" />
          <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/products/new"
              className="px-5 py-3 bg-warmblack text-white text-xs font-bold tracking-wide rounded-lg hover:bg-warmblack/90 transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Product
            </Link>
          </motion.div>
        </div>
      </div>

      <ProductTable products={products} onDelete={(p) => setDeleting(p)} />
      <ConfirmModal show={!!deleting} title="Delete Product" message={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        onConfirm={() => { deleteProduct(deleting.id); setDeleting(null); }} onCancel={() => setDeleting(null)} />
    </div>
  );
}
