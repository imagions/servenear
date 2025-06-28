import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://npibtopuvjbftkstecht.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waWJ0b3B1dmpiZnRrc3RlY2h0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc4MzAzNCwiZXhwIjoyMDY0MzU5MDM0fQ.TDkNpMZWVxwdVijwzIYWez0vVDlV-wnLh8YKHrJ6pyU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
