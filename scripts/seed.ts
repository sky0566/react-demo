/**
 * Seed script - Fetches ALL real product data from WordPress WooCommerce Store API
 * then seeds the SQLite database with correct images & data.
 *
 * Run with: npx tsx scripts/seed.ts
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const DB_PATH = path.join(process.cwd(), 'data', 'gallop.db');
const WC_API = 'https://www.gallopliftparts.com/wp-json/wc/store/v1/products';

// ─────────────────────────── Types ───────────────────────────────────
interface WCImage {
  id: number;
  src: string;
  thumbnail: string;
  name: string;
  alt: string;
}

interface WCCategory {
  id: number;
  name: string;
  slug: string;
  link: string;
}

interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  images: WCImage[];
  categories: WCCategory[];
}

// ─────────────────────── Fetch helpers ────────────────────────────────
async function fetchAllProducts(): Promise<WCProduct[]> {
  const all: WCProduct[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${WC_API}?per_page=${perPage}&page=${page}`;
    console.log(`📡 Fetching products page ${page}...`);

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ Failed page ${page}: ${res.status}`);
      break;
    }

    const products: WCProduct[] = await res.json();
    if (products.length === 0) break;

    all.push(...products);
    console.log(`   Got ${products.length} (total: ${all.length})`);

    if (products.length < perPage) break;
    page++;
  }

  return all;
}

// Strip HTML for short descriptions
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Generate a clean description if the WP one is too short
function ensureDescription(name: string, catName: string, wpDesc: string): string {
  const stripped = stripHtml(wpDesc);
  if (stripped.length > 30) return wpDesc; // keep WP description if meaningful

  return `<p>High-quality <strong>${name}</strong> for ${catName.toLowerCase()} systems. Manufactured to OEM specifications with strict quality control.</p>
<p>Gallop Technology provides genuine replacement parts with competitive pricing and global shipping. All parts come with after-sale warranty and technical support.</p>
<h3>Features</h3>
<ul>
<li>OEM quality replacement part</li>
<li>Strict quality control and testing</li>
<li>Compatible with major ${catName.toLowerCase()} brands</li>
<li>Fast delivery worldwide</li>
</ul>`;
}

function ensureShortDesc(name: string, catName: string, wpShort: string): string {
  const stripped = stripHtml(wpShort);
  if (stripped.length > 5) return stripped;
  return `Genuine ${name} for ${catName.toLowerCase()} systems. OEM quality with warranty.`;
}

// ────────────────────────── Main ─────────────────────────────────────
async function main() {
  console.log('🌱 Gallop Lift Parts — Full Seed from WordPress API\n');

  // ── 1. Fetch all products from WooCommerce ──
  const wpProducts = await fetchAllProducts();
  console.log(`\n📦 Total products from WordPress: ${wpProducts.length}\n`);

  if (wpProducts.length === 0) {
    console.error('❌ No products fetched. Aborting.');
    process.exit(1);
  }

  // ── 2. Prepare database ──
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Remove old DB
  if (fs.existsSync(DB_PATH)) {
    try {
      fs.unlinkSync(DB_PATH);
      try { fs.unlinkSync(DB_PATH + '-wal'); } catch {}
      try { fs.unlinkSync(DB_PATH + '-shm'); } catch {}
      console.log('🗑️  Old database removed.');
    } catch {
      const tmpDb = new Database(DB_PATH);
      tmpDb.exec('DROP TABLE IF EXISTS inquiries');
      tmpDb.exec('DROP TABLE IF EXISTS products');
      tmpDb.exec('DROP TABLE IF EXISTS categories');
      tmpDb.exec('DROP TABLE IF EXISTS admin_users');
      tmpDb.exec('DROP TABLE IF EXISTS site_settings');
      tmpDb.exec('DROP TABLE IF EXISTS partners');
      tmpDb.exec('DROP TABLE IF EXISTS page_views');
      tmpDb.close();
      console.log('🗑️  Old tables dropped.');
    }
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // ── 3. Create tables ──
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      image TEXT DEFAULT '',
      parent_id TEXT DEFAULT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      short_description TEXT DEFAULT '',
      category_id TEXT,
      price REAL DEFAULT 0,
      original_price REAL DEFAULT 0,
      images TEXT DEFAULT '[]',
      specifications TEXT DEFAULT '{}',
      meta_title TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      meta_keywords TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      company TEXT DEFAULT '',
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT NOT NULL DEFAULT '',
      website TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      page_title TEXT DEFAULT '',
      referrer TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      ip_hash TEXT DEFAULT '',
      country TEXT DEFAULT '',
      browser TEXT DEFAULT '',
      os TEXT DEFAULT '',
      device TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
    CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
  `);
  console.log('✅ Tables created.');

  // ── 4. Admin user ──
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)').run('admin-1', 'admin', hash);
  console.log('✅ Admin user: admin / admin123');

  // ── 5. Site settings ──
  const settings = [
    ['site_name', 'Gallop Lift Parts'],
    ['site_description', 'Professional One-Stop Elevator and Escalator Solution Plan Supplier'],
    ['company_name', 'Suzhou Gallop Technology Co., Ltd.'],
    ['phone', '+86 17365368201'],
    ['email', 'info@gallopliftparts.com'],
    ['business_email', 'business@gallopliftparts.com'],
    ['address', 'No.128 Jinji Lake Rod, SIP, Suzhou, China'],
    ['whatsapp', '+86 17365368201'],
  ];
  const insertSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
  for (const [key, value] of settings) insertSetting.run(key, value);
  console.log('✅ Site settings seeded.');

  // ── 5b. Seed partners ──
  const WP04 = 'https://www.gallopliftparts.com/wp-content/uploads/2024/04';
  const WP11 = 'https://www.gallopliftparts.com/wp-content/uploads/2024/11';
  const defaultPartners = [
    ['XIO', `${WP04}/XIO.webp`, 1],
    ['Selcom', `${WP04}/selcom.png`, 2],
    ['WECO', `${WP04}/weco.png`, 3],
    ['STEP', `${WP04}/STEP.png`, 4],
    ['SJEC', `${WP04}/SJEC.png`, 5],
    ['SIGMA', `${WP04}/SIGMA.png`, 6],
    ['Sword', `${WP04}/sword.png`, 7],
    ['Montanari', `${WP04}/Montanari.png`, 8],
    ['Monarch', `${WP04}/Monarch.png`, 9],
    ['Mitsubishi', `${WP04}/MITSUBISHI.png`, 10],
    ['Kone', `${WP04}/kone.png`, 11],
    ['Monteferro', `${WP11}/Monteferro.png`, 12],
    ['Mona Drive', `${WP11}/Mona-drive.png`, 13],
    ['Hpmont', `${WP11}/Hpmont.png`, 14],
    ['Savera', `${WP11}/Savera.png`, 15],
    ['Gustav Wolf', `${WP11}/Gustav-wolf.png`, 16],
    ['Fermator', `${WP04}/fermator.png`, 17],
    ['Canny', `${WP04}/canny.png`, 18],
    ['DSK', `${WP04}/DSK.png`, 19],
    ['BST', `${WP04}/BST.png`, 20],
  ];
  const insertPartner = db.prepare('INSERT INTO partners (id, name, logo, sort_order) VALUES (?, ?, ?, ?)');
  for (const [name, logo, order] of defaultPartners) {
    insertPartner.run(uuid(), name as string, logo as string, order as number);
  }
  console.log(`✅ ${defaultPartners.length} partners seeded.`);

  // ── 6. Build categories from WP product data ──
  // Descriptions for categories
  const catDescriptions: Record<string, string> = {
    elevator: 'Elevator parts and components including doors, motors, inverters, guide rails, buttons, encoders and more.',
    escalator: 'Escalator parts including steps, handrails, comb plates, rollers, chains, motors and friction wheels.',
    selcom: 'Selcom door systems and parts - control boards, door contacts, sliders, rollers and motors.',
    fermator: 'Fermator door systems and parts - controllers, contacts, sliders, rollers, encoders and door balls.',
    kone: 'Kone elevator parts - PCB boards, spare parts and components.',
    sword: 'Sword elevator door systems - inverters, motors, boards, locks, switches and accessories.',
    canny: 'Canny elevator parts - main control boards, communication boards, frequency converters and display panels.',
    mitsubishi: 'Mitsubishi elevator parts - door systems, PCB boards, sensors, switches and accessories.',
  };

  // Collect unique categories from products
  const catMap = new Map<string, { name: string; slug: string; image: string }>();
  for (const p of wpProducts) {
    for (const cat of p.categories) {
      if (!catMap.has(cat.slug)) {
        // Use first product's first image as category thumbnail
        const catImage = p.images.length > 0 ? p.images[0].src : '';
        catMap.set(cat.slug, { name: cat.name, slug: cat.slug, image: catImage });
      }
    }
  }

  const insertCat = db.prepare('INSERT INTO categories (id, name, slug, description, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
  let catOrder = 0;
  const catIdMap = new Map<string, string>(); // slug → id
  for (const [slug, cat] of catMap) {
    catOrder++;
    const catId = `cat-${slug}`;
    catIdMap.set(slug, catId);
    insertCat.run(catId, cat.name, cat.slug, catDescriptions[slug] || `${cat.name} elevator and escalator parts.`, cat.image, catOrder);
  }
  console.log(`✅ ${catMap.size} categories seeded.`);

  // ── 7. Seed products ──
  const insertProduct = db.prepare(`
    INSERT INTO products (id, sku, name, slug, description, short_description, category_id, price, original_price, images, specifications, meta_title, meta_description, meta_keywords, is_active, is_featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  // Featured product slugs (picked for the homepage grid)
  const featuredSlugs = new Set([
    'elevator-door', 'monteferro-guide-rails', 'escalator-handrail', 'escalator-step',
    'eco-door-control-board', 'door-controller-vf4', 'km601370g04',
    'door-inverter-easy-con', 'xd-cs01', 'zr236-tr236-snd4111-sp-c-r',
    'gustav-wolf-steel-wire-rope', 'light-curtain',
  ]);

  const skuSet = new Set<string>();

  const insertAll = db.transaction((products: WCProduct[]) => {
    let order = 0;
    for (const p of products) {
      order++;
      const catSlug = p.categories[0]?.slug || 'elevator';
      const catId = catIdMap.get(catSlug) || 'cat-elevator';
      const catName = p.categories[0]?.name || 'Elevator';

      // Generate unique SKU from slug
      let sku = p.slug.toUpperCase().replace(/-/g, '').substring(0, 20);
      let suffix = 1;
      while (skuSet.has(sku)) {
        sku = p.slug.toUpperCase().replace(/-/g, '').substring(0, 18) + suffix;
        suffix++;
      }
      skuSet.add(sku);

      // Images array
      const imageUrls = p.images.map(img => img.src);
      const images = JSON.stringify(imageUrls);

      // Descriptions
      const description = ensureDescription(p.name, catName, p.description);
      const shortDesc = ensureShortDesc(p.name, catName, p.short_description);

      // Specs
      const specs = JSON.stringify({
        'Brand': catName,
        'Condition': 'New',
        'Warranty': '12 months',
        'Origin': 'China',
      });

      const isFeatured = featuredSlugs.has(p.slug) ? 1 : 0;

      insertProduct.run(
        uuid(),
        sku,
        p.name,
        p.slug,
        description,
        shortDesc,
        catId,
        0, // price (quote-based)
        0,
        images,
        specs,
        `${p.name} - ${catName} Parts | Gallop Lift Parts`,
        `Buy ${p.name} for ${catName.toLowerCase()} systems. OEM quality, competitive price, global shipping.`,
        `${p.name}, ${catName}, elevator parts, escalator parts, lift parts`,
        isFeatured,
        order
      );
    }
  });

  insertAll(wpProducts);
  console.log(`✅ ${wpProducts.length} products seeded (all from WordPress).`);

  // ── 8. Sample inquiries ──
  const inquiries = [
    { name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+966 555 1234', company: 'Saudi Elevators Co.', message: 'We need 50 units of Selcom Door contacts. Please send us a quote with delivery time to Saudi Arabia.', status: 'new' },
    { name: 'Maria Garcia', email: 'maria@example.com', phone: '+34 612 345 678', company: 'Ascensores Madrid', message: 'Looking for Fermator door controllers VF4+ and VVVF5+. Can you ship to Spain?', status: 'new' },
    { name: 'John Smith', email: 'john.smith@example.com', phone: '+1 555 987 6543', company: 'Elevator Solutions LLC', message: 'Interested in bulk order of Kone spare parts - KM601370G04 and KM903370G04. Please provide pricing.', status: 'read' },
    { name: 'Li Wei', email: 'liwei@example.com', phone: '+86 138 8888 9999', company: 'Suzhou Elevator Parts Co., Ltd.', message: 'Need Mitsubishi elevator parts P235720B000G01 series, please quote and advise delivery time.', status: 'replied' },
    { name: 'Ibrahim Al-Farsi', email: 'ibrahim@example.com', phone: '+971 50 123 4567', company: 'Dubai Lift Parts Trading', message: 'We are interested in being a distributor for your Sword elevator parts in UAE. Please contact us.', status: 'new' },
  ];

  const insertInquiry = db.prepare('INSERT INTO inquiries (id, name, email, phone, company, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const now = new Date();
  for (let i = 0; i < inquiries.length; i++) {
    const inq = inquiries[i];
    const date = new Date(now.getTime() - (i * 2 * 24 * 60 * 60 * 1000));
    insertInquiry.run(uuid(), inq.name, inq.email, inq.phone, inq.company, inq.message, inq.status, date.toISOString());
  }
  console.log(`✅ ${inquiries.length} sample inquiries seeded.`);

  db.close();
  console.log('\n🎉 Database seeded successfully!');
  console.log(`   📁 ${DB_PATH}`);
  console.log(`   👤 Admin: admin / admin123`);
  console.log(`   📦 ${wpProducts.length} products across ${catMap.size} categories`);
  console.log(`   📩 ${inquiries.length} sample inquiries`);
}

main().catch(console.error);
