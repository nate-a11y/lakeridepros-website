-- Allow NULL values in partners.category column
-- The category field is a legacy field being phased out in favor of
-- isPremierPartner, isReferralPartner, isWeddingPartner checkboxes

ALTER TABLE partners
ALTER COLUMN category DROP NOT NULL;

-- Add comment explaining the deprecation
COMMENT ON COLUMN partners.category IS 'DEPRECATED: Legacy field being phased out. Use isPremierPartner, isReferralPartner, isWeddingPartner checkboxes instead.';
