-- Migration: Create wardrobe table
-- D1 / SQLite compatible

CREATE TABLE IF NOT EXISTS wardrobe_items (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('accessory', 'shirt_long_sleeved', 'shirt_short_sleeved', 'pant')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'to_wash', 'needs_wash', 'borrowed')),
  store_location TEXT,
  borrowed_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_wardrobe_user_id ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_type ON wardrobe_items(type);
CREATE INDEX IF NOT EXISTS idx_wardrobe_status ON wardrobe_items(status);

-- Trigger to auto-update updated_at
CREATE TRIGGER IF NOT EXISTS trg_wardrobe_updated_at
AFTER UPDATE ON wardrobe_items
FOR EACH ROW
BEGIN
  UPDATE wardrobe_items SET updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = OLD.id;
END;
