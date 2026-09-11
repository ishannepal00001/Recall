-- Migration: Add in_use_since to track when item was put into in_use state (for check_wear_due cron)
ALTER TABLE wardrobe_items ADD COLUMN in_use_since TEXT;
CREATE INDEX IF NOT EXISTS idx_wardrobe_in_use_since ON wardrobe_items(in_use_since);
CREATE INDEX IF NOT EXISTS idx_wardrobe_status_in_use_since ON wardrobe_items(status, in_use_since);
