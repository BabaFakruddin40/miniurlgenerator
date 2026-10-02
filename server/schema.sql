CREATE TABLE IF NOT EXISTS urls (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE,
  original_url TEXT NOT NULL,
  clicks BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Base62 conversion function for auto-incrementing IDs
CREATE OR REPLACE FUNCTION encode_base62(num BIGINT) RETURNS TEXT AS $$
DECLARE
  alphabet TEXT := '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  base INT := 62;
  result TEXT := '';
  remainder INT;
BEGIN
  IF num = 0 THEN RETURN '0'; END IF;
  WHILE num > 0 LOOP
    remainder := num % base;
    result := substr(alphabet, remainder + 1, 1) || result;
    num := num / base;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;