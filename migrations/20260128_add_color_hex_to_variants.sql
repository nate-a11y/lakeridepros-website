-- Add color_hex column to products_variants table
-- This column stores the hex color code from Printify (e.g., "#FF0000")

ALTER TABLE products_variants
ADD COLUMN IF NOT EXISTS color_hex VARCHAR(10);

-- Add comment for documentation
COMMENT ON COLUMN products_variants.color_hex IS 'Hex color code from Printify (e.g., "#000000")';
