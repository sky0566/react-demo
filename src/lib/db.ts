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
      must_change_password INTEGER DEFAULT 1,
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
      is_mock INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
    CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
  `);

  // Migration: add is_mock column if missing (for existing databases)
  try {
    db.prepare('SELECT is_mock FROM page_views LIMIT 1').get();
  } catch {
    db.exec('ALTER TABLE page_views ADD COLUMN is_mock INTEGER DEFAULT 0');
  }

  // Migration: add must_change_password column if missing
  try {
    db.prepare('SELECT must_change_password FROM admin_users LIMIT 1').get();
  } catch {
    db.exec('ALTER TABLE admin_users ADD COLUMN must_change_password INTEGER DEFAULT 1');
  }

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

  // Seed demo page view data for analytics dashboard
  const pvCount = db.prepare('SELECT COUNT(*) as c FROM page_views').get() as { c: number };
  if (pvCount.c === 0) {
    const pages = [
      ['/', 'Home'],
      ['/products', 'Products'],
      ['/products/elevator', 'Elevator Parts'],
      ['/products/escalator', 'Escalator Parts'],
      ['/products/selcom', 'Selcom Parts'],
      ['/products/fermator', 'Fermator Parts'],
      ['/products/kone', 'Kone Parts'],
      ['/about', 'About Us'],
      ['/contact', 'Contact Us'],
      ['/cart', 'Cart'],
    ];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const oses = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const countries = ['United States', 'China', 'Germany', 'United Kingdom', 'India', 'Japan', 'Brazil', 'Australia', 'Canada', 'France'];
    const referrers = ['https://www.google.com', 'https://www.bing.com', 'https://www.baidu.com', '', 'direct', 'https://www.facebook.com'];
    const insertPv = db.prepare(
      'INSERT INTO page_views (page_path, page_title, referrer, ip_hash, country, browser, os, device, is_mock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)'
    );
    const seedPvs = db.transaction(() => {
      const now = new Date();
      for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
        const d = new Date(now);
        d.setDate(d.getDate() - dayOffset);
        const viewsToday = Math.floor(Math.random() * 150) + 50;
        for (let v = 0; v < viewsToday; v++) {
          const page = pages[Math.floor(Math.random() * pages.length)];
          const hour = Math.floor(Math.random() * 24);
          const min = Math.floor(Math.random() * 60);
          d.setHours(hour, min, Math.floor(Math.random() * 60));
          insertPv.run(
            page[0],
            page[1],
            referrers[Math.floor(Math.random() * referrers.length)],
            `hash_${Math.floor(Math.random() * 500)}`,
            countries[Math.floor(Math.random() * countries.length)],
            browsers[Math.floor(Math.random() * browsers.length)],
            oses[Math.floor(Math.random() * oses.length)],
            devices[Math.floor(Math.random() * devices.length)],
            d.toISOString().replace('T', ' ').slice(0, 19)
          );
        }
      }
    });
    seedPvs();
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
