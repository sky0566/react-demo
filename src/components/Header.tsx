'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useCart } from './CartProvider';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Product', href: '/products', hasDropdown: true },
  { name: 'News', href: '/news' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

interface DropdownCategory {
  slug: string;
  name: string;
  logo?: string;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState<DropdownCategory[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories for dropdown
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then((data: DropdownCategory[]) => setCategories(data))
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setDropdownOpen(true);
  };
  const handleDropdownLeave = () => {
    dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const getCategoryHref = (slug: string) =>
    slug === 'selcom' ? `/products/${slug}?sort=hot` : `/products/${slug}`;

  return (
    <>
      {/* Top Bar - dark strip with contact info */}
      <div className="bg-[#2e2e2e] text-white text-sm hidden md:block">
        <div className="max-w-[1290px] mx-auto px-6 flex items-center justify-between h-[40px]">
          <div className="flex items-center gap-6">
            <a href="mailto:info@gallopliftparts.com" className="flex items-center gap-2 hover:text-[#00a6d8] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              info@gallopliftparts.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a href="https://www.facebook.com/profile.php?id=100091553349498" target="_blank" rel="noopener noreferrer" className="hover:text-[#00a6d8] transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/gallop-lift/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00a6d8] transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/gallopliftparts/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00a6d8] transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header - Sticky */}
      <header className={`bg-white sticky top-0 z-50 header-main ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-[1290px] mx-auto px-6">
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-[70px]' : 'h-[90px]'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="https://www.gallopliftparts.com/wp-content/uploads/2024/03/logo-text.png"
                alt="Gallop Lift Parts"
                width={200}
                height={55}
                className={`transition-all duration-300 ${scrolled ? 'h-[45px] w-auto' : 'h-[55px] w-auto'}`}
                priority
              />
            </Link>

            {/* Desktop Navigation - centered */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) =>
                item.hasDropdown ? (
                  <div
                    key={item.name}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={item.href}
                      className="px-5 py-2 text-[#222] hover:text-[#046db1] font-medium transition-colors text-[15px] relative inline-flex items-center gap-1"
                    >
                      {item.name}
                      <svg className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    {dropdownOpen && categories.length > 0 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px] animate-in fade-in slide-in-from-top-1 duration-150">
                          {categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={getCategoryHref(cat.slug)}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            >
                              {cat.logo ? (
                                <Image
                                  src={cat.logo}
                                  alt={cat.name}
                                  width={32}
                                  height={24}
                                  className="w-8 h-6 object-contain flex-shrink-0"
                                />
                              ) : (
                                <span className="w-8 h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                  </svg>
                                </span>
                              )}
                              <span className="text-sm text-[#222] font-medium">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-5 py-2 text-[#222] hover:text-[#046db1] font-medium transition-colors text-[15px] relative"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            {/* Right side - Cart icon */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/cart" className="flex items-center gap-1 text-[#222] hover:text-[#046db1] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span className="text-xs bg-[#2B6CB0] text-white rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-[#222]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-100">
              <nav className="flex flex-col pt-3">
                {navigation.map((item) =>
                  item.hasDropdown ? (
                    <div key={item.name}>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className="w-full flex items-center justify-between text-[#222] hover:text-[#046db1] hover:bg-gray-50 font-medium px-3 py-3 border-b border-gray-50 text-[15px]"
                      >
                        {item.name}
                        <svg className={`w-4 h-4 transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileProductsOpen && (
                        <div className="bg-gray-50">
                          <Link
                            href="/products"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm text-[#046db1] font-medium border-b border-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            All Products
                          </Link>
                          {categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={getCategoryHref(cat.slug)}
                              className="flex items-center gap-3 px-6 py-2.5 text-sm text-[#222] hover:text-[#046db1] border-b border-gray-100"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {cat.logo && (
                                <Image src={cat.logo} alt={cat.name} width={28} height={20} className="w-7 h-5 object-contain" />
                              )}
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-[#222] hover:text-[#046db1] hover:bg-gray-50 font-medium px-3 py-3 border-b border-gray-50 text-[15px]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </nav>
              <div className="px-3 pt-3 flex items-center gap-4 text-sm text-gray-500">
                <a href="mailto:info@gallopliftparts.com" className="hover:text-[#046db1]">info@gallopliftparts.com</a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
