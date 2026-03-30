import Link from 'next/link';
import Image from 'next/image';
import { parseJsonSafe } from '@/lib/utils';
import AddToCartButton from './AddToCartButton';

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
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col border-t border-[#e2e5e7]">
        <Link href={`/product/${product.slug}`} className="block flex-1">
          <h3 className="font-medium text-[#222] text-[15px] leading-snug hover:text-[#046db1] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="request-quote-btn flex-1 text-center py-2 text-[14px]"
          >
            Details
          </Link>
          <AddToCartButton
            product={{ id: product.id, name: product.name, sku: product.sku, image: mainImage }}
            className="py-2 px-3 text-[13px] font-medium rounded bg-[#2B6CB0] text-white hover:bg-[#225a9a]"
          />
        </div>
      </div>
    </article>
  );
}
