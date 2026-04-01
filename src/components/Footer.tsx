import Link from 'next/link';
import Image from 'next/image';

const categories = [
  'Elevator', 'Escalator', 'Selcom', 'Fermator',
  'Kone', 'Sword', 'Canny', 'Mitsubishi',
];

export default function Footer() {
  return (
    <footer>
      {/* Main Footer - Light Gray */}
      <div className="bg-[#e2e5e7]">
        <div className="max-w-[1290px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Company Info */}
            <div>
              <Image
                src="/images/wp/2024/03/logo-text.png"
                alt="Gallop Lift Parts"
                width={160}
                height={40}
                className="h-[32px] mb-5 w-auto"
              />
              <p className="text-[#222] text-[15px] leading-relaxed mb-4">
                Suzhou Gallop Technology Co., Ltd. is a professional &quot;One-Stop&quot; elevator and
                escalator solution plan supplier.
              </p>
              {/* QR Codes */}
              <Image 
                src="/images/wp/2024/04/image-4.png" 
                alt="WhatsApp & WeChat QR Codes" 
                width={233}
                height={157}
                className="mt-4 w-auto"
                style={{ height: 'auto', maxWidth: '233px' }}
              />
            </div>

            {/* Products */}
            <div className="flex flex-col items-center md:items-center">
              <h3 className="text-[#222] font-semibold text-[18px] mb-5">Products</h3>
              <ul className="space-y-2 text-center">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/products/${cat.toLowerCase()}`}
                      className="text-[#222] hover:text-[#046db1] transition-colors text-[15px]"
                    >
                      » {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-[#222] font-semibold text-[20px] mb-5">Contact Info</h3>
              <div className="space-y-4 text-[15px] text-[#222]">
                <div>
                  <span className="font-medium">Phone:</span>
                  <div className="mt-1">
                    <a href="tel:+8617365368201" className="hover:text-[#046db1]">+86 17365368201</a>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <div className="mt-1 space-y-1">
                    <a href="mailto:info@gallopliftparts.com" className="block hover:text-[#046db1]">info@gallopliftparts.com</a>
                    <a href="mailto:business@gallopliftparts.com" className="block hover:text-[#046db1]">business@gallopliftparts.com</a>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Address:</span>
                  <div className="mt-1">No.128 Jinji Lake Rod, SIP, Suzhou, China</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Dark */}
      <div className="bg-[#2e2e2e] text-white">
        <div className="max-w-[1290px] mx-auto px-6 py-4 text-center text-[14px]">
          <p>Copyright © Suzhou Gallop Technology Co.,Ltd All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
