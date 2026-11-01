-- Initial Better Auth and resume application schema.
-- Apply with the repository's controlled migration step before running the app.

CREATE TABLE IF NOT EXISTS "user" (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  name text NOT NULL,
  image text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_email_idx ON "user" (email);

CREATE TABLE IF NOT EXISTS "session" (
  id text PRIMARY KEY,
  "expiresAt" timestamptz NOT NULL,
  token text NOT NULL UNIQUE,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS session_user_id_idx ON "session" ("userId");
CREATE INDEX IF NOT EXISTS session_token_idx ON "session" (token);

CREATE TABLE IF NOT EXISTS "account" (
  id text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "idToken" text,
  scope text,
  password text,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS account_user_id_idx ON "account" ("userId");

CREATE TABLE IF NOT EXISTS "verification" (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  "expiresAt" timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS verification_identifier_idx ON "verification" (identifier);

CREATE TABLE IF NOT EXISTS resumes (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled resume',
  template_key text NOT NULL DEFAULT 'ats-classic',
  content jsonb NOT NULL,
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes (user_id);
CREATE INDEX IF NOT EXISTS resumes_updated_at_idx ON resumes (updated_at);

CREATE TABLE IF NOT EXISTS subscriptions (
  id serial PRIMARY KEY,
  user_id text NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  plan_key text NOT NULL,
  stripe_customer_id text NOT NULL UNIQUE,
  stripe_subscription_id text NOT NULL UNIQUE,
  status text NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);

CREATE TABLE IF NOT EXISTS ai_usage (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  operation text NOT NULL CHECK (operation IN ('writing', 'matching')),
  period_key text NOT NULL,
  request_key text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  tokens_in integer,
  tokens_out integer,
  cost_usd text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_usage_request_key_idx UNIQUE (user_id, request_key)
);
CREATE INDEX IF NOT EXISTS ai_usage_user_period_idx ON ai_usage (user_id, period_key);
