import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://npibtopuvjbftkstecht.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waWJ0b3B1dmpiZnRrc3RlY2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODMwMzQsImV4cCI6MjA2NDM1OTAzNH0.2LtFM6RsDJljw72ZUt0xJucXZcRBfDpcZMVpRj7HxbI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
