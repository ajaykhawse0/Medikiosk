-- V7: Patients — identity-only table; no login account.
-- email is normalized (trimmed + lowercased) by the application before insert.
-- Intentionally separate from the users table: patients never authenticate.

CREATE TABLE patients (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name    VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_patients_email UNIQUE (email)
);

CREATE INDEX idx_patients_email ON patients (email);
