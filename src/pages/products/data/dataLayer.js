import { useState, useEffect, useCallback } from 'react';
import * as productService from '../../../services/productService';

// Normalize: pages use p.id everywhere, backend returns _id
const normalize = (p) => ({ ...p, id: p._id, stock: p.stock instanceof Object && !Array.isArray(p.stock) ? (p.stock.toJSON ? p.stock.toJSON() : p.stock) : p.stock || {} });

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await productService.getProducts(200);
      setProducts(res.data.products.map(normalize));
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addProduct = useCallback(async (product) => {
    const res = await productService.createProduct(product);
    const p = normalize(res.data.product);
    setProducts((prev) => [p, ...prev]);
    return p;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const res = await productService.updateProduct(id, updates);
    const p = normalize(res.data.product);
    setProducts((prev) => prev.map((old) => (old.id === id ? p : old)));
    return p;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await productService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { products, loading, addProduct, updateProduct, deleteProduct, refetch: fetchProducts };
}
