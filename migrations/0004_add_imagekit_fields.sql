-- Migration: Add ImageKit fileId for wardrobe images
ALTER TABLE wardrobe_items ADD COLUMN image_file_id TEXT;
CREATE INDEX IF NOT EXISTS idx_wardrobe_image_file_id ON wardrobe_items(image_file_id);
