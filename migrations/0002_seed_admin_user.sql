-- Migration: Seed admin user
-- Email: ishannepal00001@gmail.com
-- Role: admin
-- Plaintext password: L9BQXueYWzKpQBcqsEPW  -- SAVE THIS SECURELY, not stored elsewhere
-- Hash generated with bcryptjs (12 rounds)

INSERT INTO users (id, email, password_hash, role)
VALUES (
  '0199-admin-ishannepal00001',
  'ishannepal00001@gmail.com',
  '$2b$12$OQ3zKhAEhbxeavTUZg7R2eADRKDbnuO89Pi8Nv6l8qAr0dOOuUO/e',
  'admin'
) ON CONFLICT(email) DO UPDATE SET
  password_hash = excluded.password_hash,
  role = excluded.role,
  updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now');
