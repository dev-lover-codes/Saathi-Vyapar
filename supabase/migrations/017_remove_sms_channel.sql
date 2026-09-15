-- ============================================================
-- Migration: 017_remove_sms_channel.sql
-- Description: The SMS (Twilio) channel has been removed from the product.
--   Tighten the CHECK constraints so no row can claim the retired channel.
--   Safe to run: no existing rows use 'sms' (verified before writing this).
-- ============================================================

ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_channel_check;
ALTER TABLE conversations
  ADD CONSTRAINT conversations_channel_check CHECK (channel IN ('whatsapp'));

ALTER TABLE ledger_entries DROP CONSTRAINT IF EXISTS ledger_entries_source_check;
ALTER TABLE ledger_entries
  ADD CONSTRAINT ledger_entries_source_check CHECK (source IN ('manual', 'ocr', 'voice', 'whatsapp'));
