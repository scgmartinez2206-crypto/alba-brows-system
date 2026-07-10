import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bhwlcfujtadwioaqgyef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJod2xjZnVqdGFkd2lvYXFneWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NDU5MzYsImV4cCI6MjA5OTIyMTkzNn0.jEZiqcKGx_BY6x8Qg05nkul8eLZQXYC7E2gIpm-xx6c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
