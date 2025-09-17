'use client';

import ProductForm from './ProductForm';

export default function EditProductModal({ product, onClose, onSuccess }) {
  return (
    <ProductForm
      product={product}
      onClose={onClose}
      onSuccess={onSuccess}
      isNew={false}
    />
  );
}