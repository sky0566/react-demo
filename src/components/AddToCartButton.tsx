'use client';

import { useCart } from './CartProvider';
import { useState } from 'react';

interface Props {
  product: { id: string; name: string; sku: string; image: string };
  className?: string;
}

export default function AddToCartButton({ product, className }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, sku: product.sku, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`flex items-center justify-center gap-2 transition-all ${
        added
          ? 'bg-emerald-500 text-white'
          : 'bg-[#2B6CB0] text-white hover:bg-[#225a9a]'
      } ${className || 'py-2.5 px-5 text-[14px] font-medium rounded-lg'}`}
    >
      {added ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add to Quote
        </>
      )}
    </button>
  );
}
