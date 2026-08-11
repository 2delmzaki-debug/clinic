// ============================================================
// supabaseClient.js
// عدّل القيمتين التاليتين ببيانات مشروعك في Supabase:
// Supabase Dashboard > Project Settings > API
// ============================================================
const SUPABASE_URL = "https://ktetgnwxomnjcpynlnka.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CMyAk41dHE5R-GPTpQCZJQ_BfqpGRgF";

// فحص أمان: لو مكتبة Supabase ما اتحمّلتش من الـ CDN (مشكلة إنترنت/حظر إعلانات)
// هيظهر تنبيه واضح في الكونسول بدل رسالة خطأ غامضة
if (!window.supabase || !window.supabase.createClient) {
  console.error('تعذّر تحميل مكتبة Supabase من الـ CDN. تأكد من الاتصال بالإنترنت وأن أي أداة حظر إعلانات لا تمنع cdn.jsdelivr.net، ثم أعد تحميل الصفحة.');
}


// يتطلب تحميل مكتبة Supabase عبر CDN في كل صفحة HTML قبل هذا الملف:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.js"></script>
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
