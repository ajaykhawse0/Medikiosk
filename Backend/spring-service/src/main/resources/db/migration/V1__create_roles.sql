-- V1: Roles reference table
-- Values seeded in V9. This table must exist before users reference it.

CREATE TABLE roles (
    id   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50)  NOT NULL,
    CONSTRAINT uq_roles_name UNIQUE (name)
);
