import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const isVercel = !!process.env.VERCEL;

function getDbPath(): string {
  const srcPath = path.join(process.cwd(), 'data', 'gallop.db');
  if (!isVercel) return srcPath;

  // On Vercel, copy DB to /tmp (writable) if not already there
  const tmpPath = '/tmp/gallop.db';
  if (!fs.existsSync(tmpPath) && fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, tmpPath);
  }
  return tmpPath;
}

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = getDbPath();
    // Ensure data directory exists (local dev)
    if (!isVercel) {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
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
  `);

  // Seed default categories if none exist
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number };
  if (count.c === 0) {
    const insertCat = db.prepare(
      'INSERT INTO categories (id, name, slug, description, sort_order) VALUES (?, ?, ?, ?, ?)'
    );
    const categories = [
      ['cat-elevator', 'Elevator', 'elevator', 'Elevator parts and components', 1],
      ['cat-escalator', 'Escalator', 'escalator', 'Escalator parts and components', 2],
      ['cat-selcom', 'Selcom', 'selcom', 'Selcom door systems and parts', 3],
      ['cat-fermator', 'Fermator', 'fermator', 'Fermator door systems and parts', 4],
      ['cat-kone', 'Kone', 'kone', 'Kone elevator parts', 5],
      ['cat-sword', 'Sword', 'sword', 'Sword elevator door systems', 6],
      ['cat-canny', 'Canny', 'canny', 'Canny elevator parts', 7],
      ['cat-mitsubishi', 'Mitsubishi', 'mitsubishi', 'Mitsubishi elevator parts', 8],
    ];
    const insertMany = db.transaction((cats: (string | number)[][]) => {
      for (const cat of cats) {
        insertCat.run(...cat);
      }
    });
    insertMany(categories);
  }

  // Seed default admin if none exist
  const adminCount = db.prepare('SELECT COUNT(*) as c FROM admin_users').get() as { c: number };
  if (adminCount.c === 0) {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)').run(
      'admin-1',
      'admin',
      hash
    );
  }

  // Seed default partners if none exist
  const partnerCount = db.prepare('SELECT COUNT(*) as c FROM partners').get() as { c: number };
  if (partnerCount.c === 0) {
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
    const insertPartner = db.prepare(
      'INSERT INTO partners (id, name, logo, sort_order) VALUES (?, ?, ?, ?)'
    );
    const { v4: uuidv4 } = require('uuid');
    for (const [name, logo, order] of defaultPartners) {
      insertPartner.run(uuidv4(), name, logo, order);
    }
  }

  // Seed default site settings
  const settingsCount = db.prepare('SELECT COUNT(*) as c FROM site_settings').get() as { c: number };
  if (settingsCount.c === 0) {
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
    for (const [key, value] of settings) {
      insertSetting.run(key, value);
    }
  }
}

// Helper types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string;
  price: number;
  original_price: number;
  images: string; // JSON array string
  specifications: string; // JSON object string
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  is_active: number;
  is_featured: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  product_id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: string;
  created_at: string;
}
