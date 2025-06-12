-- Accounts table
CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  api_key TEXT UNIQUE DEFAULT 'pk_' || gen_random_uuid(),
  secret_key TEXT UNIQUE DEFAULT 'sk_' || gen_random_uuid(),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'growth', 'scale')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  industry TEXT DEFAULT 'saas',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Responses table
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  page_url TEXT,
  questions JSONB NOT NULL,
  answers JSONB NOT NULL,
  score DECIMAL(3,2),
  qualified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  visitor_id TEXT,
  variant TEXT,
  page_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_accounts_api_key ON accounts(api_key);
CREATE INDEX idx_responses_account_created ON responses(account_id, created_at DESC);
CREATE INDEX idx_analytics_account_event ON analytics(account_id, event_type, created_at DESC);

-- Enable RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY; 