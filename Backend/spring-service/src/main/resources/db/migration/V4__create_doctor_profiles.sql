-- V4: Doctor profile — one-to-one extension of users for DOCTOR-role users.
-- registration_number uniqueness is enforced only when the value is not null
-- (a doctor may be created before a registration number is assigned).

CREATE TABLE doctor_profiles (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         NOT NULL,
    registration_number VARCHAR(100),
    specialization      VARCHAR(255),
    department          VARCHAR(255),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_doctor_profiles_user_id              UNIQUE (user_id),
    CONSTRAINT fk_doctor_profiles_user                 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Partial unique index: registration_number is unique only among rows that have one
CREATE UNIQUE INDEX uq_doctor_profiles_registration_number
    ON doctor_profiles (registration_number)
    WHERE registration_number IS NOT NULL;

CREATE INDEX idx_doctor_profiles_user_id ON doctor_profiles (user_id);
