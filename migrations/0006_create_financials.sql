CREATE TABLE IF NOT EXISTS financials (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount REAL NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL CHECK (category IN ('salary','freelance','investment','gift','other_income','food','transport','housing','utilities','healthcare','entertainment','shopping','education','other_expense')),
  description TEXT,
  date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_financials_user_id ON financials(user_id);
CREATE INDEX IF NOT EXISTS idx_financials_type ON financials(type);
CREATE INDEX IF NOT EXISTS idx_financials_category ON financials(category);
CREATE INDEX IF NOT EXISTS idx_financials_date ON financials(date);

CREATE TRIGGER IF NOT EXISTS trg_financials_updated_at
AFTER UPDATE ON financials
FOR EACH ROW
BEGIN
  UPDATE financials SET updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = OLD.id;
END;
