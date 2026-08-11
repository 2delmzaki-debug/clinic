// ============================================================
// auth.js — دوال المصادقة المشتركة (تسجيل دخول / تسجيل جديد / خروج / حماية الصفحات)
// ============================================================

// تسجيل مستخدم جديد (طبيب أو مريض) — role: 'doctor' | 'patient'
async function signUpUser({ email, password, fullName, phone, role }) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, phone: phone || null, role } }
  });
  if (error) throw error;
  return data;
}

async function signInUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOutUser() {
  await supabase.auth.signOut();
  window.location.href = resolveRootPath('index.html');
}

// يعيد ملف تعريف (profile) المستخدم الحالي مع الدور، أو null إن لم يكن مسجلاً دخوله
async function getCurrentProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  if (error) return null;
  return { ...data, email: session.user.email };
}

// يحمي صفحات لوحة الطبيب أو بوابة المريض: يعيد التوجيه إن لم يطابق الدور المطلوب
async function requireRole(requiredRole) {
  const profile = await getCurrentProfile();
  if (!profile) {
    window.location.href = resolveRootPath('index.html');
    return null;
  }
  if (profile.role !== requiredRole) {
    window.location.href = resolveRootPath(profile.role === 'doctor' ? 'doctor/dashboard.html' : 'patient/portal.html');
    return null;
  }
  return profile;
}

// يحسب المسار النسبي إلى جذر الموقع بحسب مكان الصفحة الحالية (doctor/ أو patient/ أو الجذر)
function resolveRootPath(target) {
  const path = window.location.pathname;
  const inSubfolder = path.includes('/doctor/') || path.includes('/patient/');
  return inSubfolder ? '../' + target : target;
}
