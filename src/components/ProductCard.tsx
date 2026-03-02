import Link from 'next/link';
import { parseJsonSafe } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    images: string;
    price: number;
    category_name?: string;
    category_slug?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const images: string[] = parseJsonSafe(product.images, []);
  const mainImage = images.length > 0 ? images[0] : '/placeholder-product.svg';

  return (
    <article className="product-card flex flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square bg-white relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col border-t border-[#e2e5e7]">
        <Link href={`/product/${product.slug}`} className="block flex-1">
          <h3 className="font-medium text-[#222] text-[15px] leading-snug hover:text-[#046db1] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3">
          <Link
            href={`/product/${product.slug}`}
            className="request-quote-btn block text-center py-2 text-[14px]"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </article>
  );
}
