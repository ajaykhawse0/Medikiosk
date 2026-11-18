-- V9: Seed roles — idempotent via ON CONFLICT DO NOTHING.
-- These are the only valid roles in the system.
-- ADMIN is never created via public API; only via secure bootstrap.

INSERT INTO roles (id, name)
VALUES
    (gen_random_uuid(), 'ADMIN'),
    (gen_random_uuid(), 'DOCTOR')
ON CONFLICT (name) DO NOTHING;
