// ============================================================
// supabaseClient.js
// عدّل القيمتين التاليتين ببيانات مشروعك في Supabase:
// Supabase Dashboard > Project Settings > API
// ============================================================
const SUPABASE_URL = "https://ktetgnwxomnjcpynlnka.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CMyAk41dHE5R-GPTpQCZJQ_BfqpGRgF";

// يتطلب تحميل مكتبة Supabase عبر CDN في كل صفحة HTML قبل هذا الملف:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
