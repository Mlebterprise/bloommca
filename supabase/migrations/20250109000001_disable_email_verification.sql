-- Disable email verification for easier development and testing
-- This allows users to sign up and immediately access the app

-- Update auth configuration to disable email confirmation
-- Note: This should be done in the Supabase dashboard under Authentication > Settings
-- But we can also set it via SQL if needed

-- For now, we'll create a comment explaining the change
-- The actual setting needs to be changed in the Supabase dashboard:
-- Go to Authentication > Settings > Email Auth
-- Disable "Enable email confirmations"

-- This migration serves as documentation of the change
COMMENT ON TABLE auth.users IS 'Email verification is disabled for easier development and testing';
