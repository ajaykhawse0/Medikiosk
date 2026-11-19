-- MediKiosk Database Initialization Script
-- Run this script as the PostgreSQL superuser (postgres):
-- Example command:
--   "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -f db-init.sql

-- 1. Create role/user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'medikiosk') THEN
      CREATE ROLE medikiosk WITH LOGIN PASSWORD 'medikioskPostGre';
   ELSE
      ALTER ROLE medikiosk WITH LOGIN PASSWORD 'medikioskPostGre';
   END IF;
END
$do$;

-- 2. Create databases
SELECT 'CREATE DATABASE medikiosk OWNER medikiosk'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'medikiosk')\gexec

SELECT 'CREATE DATABASE medikiosk_dev OWNER medikiosk'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'medikiosk_dev')\gexec

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE medikiosk TO medikiosk;
GRANT ALL PRIVILEGES ON DATABASE medikiosk_dev TO medikiosk;

-- 4. Enable pgcrypto in both databases
\c medikiosk
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
GRANT ALL ON SCHEMA public TO medikiosk;

\c medikiosk_dev
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
GRANT ALL ON SCHEMA public TO medikiosk;

\echo 'MediKiosk databases initialized successfully!'
