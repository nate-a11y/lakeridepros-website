-- Migration: Update media table for new image size configuration
-- This removes the old thumbnail/card/tablet/desktop sizes and adds the new optimized size

-- Add new optimized image size columns
ALTER TABLE "media"
ADD COLUMN IF NOT EXISTS "sizes_optimized_url" varchar,
ADD COLUMN IF NOT EXISTS "sizes_optimized_width" numeric,
ADD COLUMN IF NOT EXISTS "sizes_optimized_height" numeric,
ADD COLUMN IF NOT EXISTS "sizes_optimized_mime_type" varchar,
ADD COLUMN IF NOT EXISTS "sizes_optimized_filesize" numeric,
ADD COLUMN IF NOT EXISTS "sizes_optimized_filename" varchar;

-- Drop old image size columns (thumbnail, card, tablet, desktop)
ALTER TABLE "media"
DROP COLUMN IF EXISTS "sizes_thumbnail_url",
DROP COLUMN IF EXISTS "sizes_thumbnail_width",
DROP COLUMN IF EXISTS "sizes_thumbnail_height",
DROP COLUMN IF EXISTS "sizes_thumbnail_mime_type",
DROP COLUMN IF EXISTS "sizes_thumbnail_filesize",
DROP COLUMN IF EXISTS "sizes_thumbnail_filename",
DROP COLUMN IF EXISTS "sizes_card_url",
DROP COLUMN IF EXISTS "sizes_card_width",
DROP COLUMN IF EXISTS "sizes_card_height",
DROP COLUMN IF EXISTS "sizes_card_mime_type",
DROP COLUMN IF EXISTS "sizes_card_filesize",
DROP COLUMN IF EXISTS "sizes_card_filename",
DROP COLUMN IF EXISTS "sizes_tablet_url",
DROP COLUMN IF EXISTS "sizes_tablet_width",
DROP COLUMN IF EXISTS "sizes_tablet_height",
DROP COLUMN IF EXISTS "sizes_tablet_mime_type",
DROP COLUMN IF EXISTS "sizes_tablet_filesize",
DROP COLUMN IF EXISTS "sizes_tablet_filename",
DROP COLUMN IF EXISTS "sizes_desktop_url",
DROP COLUMN IF EXISTS "sizes_desktop_width",
DROP COLUMN IF EXISTS "sizes_desktop_height",
DROP COLUMN IF EXISTS "sizes_desktop_mime_type",
DROP COLUMN IF EXISTS "sizes_desktop_filesize",
DROP COLUMN IF EXISTS "sizes_desktop_filename";
