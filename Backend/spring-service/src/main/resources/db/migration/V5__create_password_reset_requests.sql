-- V5: Password reset requests
-- reset_token_hash stores SHA-256 hash only. Raw token is NEVER stored.
-- Partial unique index enforces at most one active (PENDING or APPROVED) request per doctor.

CREATE TABLE password_reset_requests (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id        UUID        NOT NULL,
    status           VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    requested_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by      UUID,                          -- admin user id; nullable until reviewed
    reviewed_at      TIMESTAMPTZ,
    rejection_reason TEXT,
    reset_token_hash VARCHAR(255),                  -- hashed; NULL until approved
    token_expires_at TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,

    CONSTRAINT chk_prr_status CHECK (
        status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'EXPIRED')
    ),
    CONSTRAINT fk_prr_doctor   FOREIGN KEY (doctor_id)   REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_prr_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Enforce at most one active (PENDING or APPROVED) request per doctor at the DB level
CREATE UNIQUE INDEX uq_prr_one_active_per_doctor
    ON password_reset_requests (doctor_id)
    WHERE status IN ('PENDING', 'APPROVED');

CREATE INDEX idx_prr_doctor_id       ON password_reset_requests (doctor_id);
CREATE INDEX idx_prr_status          ON password_reset_requests (status);
-- Filtered index on token hash for fast lookup during reset completion
CREATE INDEX idx_prr_reset_token_hash
    ON password_reset_requests (reset_token_hash)
    WHERE reset_token_hash IS NOT NULL;
