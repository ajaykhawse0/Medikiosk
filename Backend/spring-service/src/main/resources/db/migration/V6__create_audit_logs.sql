-- V6: Audit log — append-only table for security-relevant events.
-- actor_id is nullable (system/bootstrap events have no human actor).
-- Never stores passwords, tokens, hashes, or medical data.

CREATE TABLE audit_logs (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id       UUID,                            -- nullable: system-generated events
    action         VARCHAR(100) NOT NULL,
    target_user_id UUID,                            -- nullable: not all events target a user
    description    TEXT,
    ip_address     VARCHAR(100),
    timestamp      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    outcome        VARCHAR(20)  NOT NULL DEFAULT 'SUCCESS',

    CONSTRAINT chk_audit_outcome CHECK (outcome IN ('SUCCESS', 'FAILURE'))
);

CREATE INDEX idx_audit_logs_actor_id      ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_target_user   ON audit_logs (target_user_id);
CREATE INDEX idx_audit_logs_action        ON audit_logs (action);
CREATE INDEX idx_audit_logs_timestamp     ON audit_logs (timestamp DESC);
