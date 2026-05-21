import { createClient } from '@supabase/supabase-js';

// Conexión directa para diagnóstico
const supabaseUrl = "https://lcdhazkemkyktfrqjtka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjZGhhemtlbWt5a3RmcnFqdGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTUxMDQsImV4cCI6MjA5NDc5MTEwNH0.OycQ3gWBDZ5FDcxBMToyV_TsQmN-FkxKjHBl3EBSVJk";

console.log('🔌 Inicializando Supabase con:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);