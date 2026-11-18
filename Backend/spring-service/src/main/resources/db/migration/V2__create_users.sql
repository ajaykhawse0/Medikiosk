-- V2: Core users table
-- email is normalized (trimmed + lowercased) by the application before insert.
-- password_hash stores BCrypt hash only. Plaintext is never persisted.

CREATE TABLE users (
    id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name            VARCHAR(255) NOT NULL,
    email                VARCHAR(255) NOT NULL,
    phone_number         VARCHAR(50),
    password_hash        VARCHAR(255) NOT NULL,
    enabled              BOOLEAN      NOT NULL DEFAULT TRUE,
    account_status       VARCHAR(50)  NOT NULL DEFAULT 'PENDING_ACTIVATION',
    must_change_password BOOLEAN      NOT NULL DEFAULT TRUE,
    failed_login_attempts INTEGER     NOT NULL DEFAULT 0,
    account_locked_until  TIMESTAMPTZ,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    last_login_at        TIMESTAMPTZ,

    CONSTRAINT uq_users_email        UNIQUE (email),
    CONSTRAINT chk_users_account_status CHECK (
        account_status IN ('ACTIVE', 'PENDING_ACTIVATION', 'DEACTIVATED')
    )
);

CREATE INDEX idx_users_email ON users (email);
