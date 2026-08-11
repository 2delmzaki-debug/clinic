// ============================================================
// i18n.js — نظام تبديل اللغة (عربي / إنجليزي) لموقع العيادة
// ============================================================
const DICT = {
  ar: {
    clinic_name: "عيادة الغدد الصماء",
    tagline: "إدارة متكاملة لملفات المرضى، المواعيد، التحاليل والوصفات",
    login: "تسجيل الدخول", register: "إنشاء حساب", logout: "تسجيل الخروج",
    email: "البريد الإلكتروني", password: "كلمة المرور", full_name: "الاسم الكامل",
    phone: "رقم الهاتف", im_doctor: "طبيب / موظف", im_patient: "مريض",
    login_as_doctor: "دخول الطبيب / الموظفين", login_as_patient: "دخول / حجز المرضى",
    dont_have_account: "ليس لديك حساب؟", have_account: "لديك حساب بالفعل؟",
    dashboard: "لوحة التحكم", patients: "المرضى", appointments: "المواعيد",
    lab_results: "نتائج التحاليل", prescriptions: "الوصفات الطبية", reports: "التقارير والإحصائيات",
    my_file: "ملفي الطبي", book_appointment: "حجز موعد", my_appointments: "مواعيدي",
    my_labs: "تحاليلي", my_prescriptions: "وصفاتي",
    add_patient: "إضافة مريض", search_patients: "بحث عن مريض...",
    gender: "الجنس", male: "ذكر", female: "أنثى", birth_date: "تاريخ الميلاد",
    address: "العنوان", chronic_diseases: "الأمراض المزمنة", family_history: "التاريخ المرضي العائلي",
    allergies: "الحساسية من أدوية", notes: "ملاحظات", save: "حفظ", cancel: "إلغاء",
    edit: "تعديل", delete: "حذف", view: "عرض", close: "إغلاق", actions: "إجراءات",
    date: "التاريخ", time: "الوقت", reason: "سبب الزيارة", status: "الحالة",
    pending: "بانتظار التأكيد", confirmed: "مؤكد", completed: "منتهي", cancelled: "ملغى",
    confirm: "تأكيد", new_appointment: "موعد جديد", no_data: "لا توجد بيانات لعرضها بعد",
    test_name: "اسم التحليل", test_value: "القيمة", unit: "الوحدة",
    reference_range: "المعدل الطبيعي", test_date: "تاريخ التحليل", add_lab_result: "إضافة نتيجة تحليل",
    diagnosis: "التشخيص", medication: "الدواء", dosage: "الجرعة", frequency: "التكرار",
    duration: "المدة", instructions: "تعليمات", add_medication_line: "إضافة سطر دواء",
    new_prescription: "وصفة جديدة", total_patients: "إجمالي المرضى", today_appointments: "مواعيد اليوم",
    pending_appointments: "بانتظار التأكيد", total_labs: "تحاليل مسجلة",
    welcome: "أهلاً بك", patient_details: "بيانات المريض", overview: "نظرة عامة",
    select_patient: "اختر مريضاً", loading: "جاري التحميل...", saved_successfully: "تم الحفظ بنجاح",
    deleted_successfully: "تم الحذف بنجاح", error_occurred: "حدث خطأ، حاول مرة أخرى",
    fill_required: "يرجى تعبئة جميع الحقول المطلوبة", back: "رجوع",
    normal: "طبيعي", high: "مرتفع", low: "منخفض",
    connect_supabase: "لتفعيل الموقع أدخل بيانات Supabase في ملف supabaseClient.js",
    national_clinic_desc: "منصّة رقمية لمتابعة السكري واضطرابات الغدة الدرقية وهرمونات الجسم",
  },
  en: {
    clinic_name: "Endocrinology Clinic",
    tagline: "A complete system for patient records, appointments, labs and prescriptions",
    login: "Login", register: "Create account", logout: "Logout",
    email: "Email", password: "Password", full_name: "Full name",
    phone: "Phone number", im_doctor: "Doctor / Staff", im_patient: "Patient",
    login_as_doctor: "Doctor / Staff sign in", login_as_patient: "Patient sign in / booking",
    dont_have_account: "Don't have an account?", have_account: "Already have an account?",
    dashboard: "Dashboard", patients: "Patients", appointments: "Appointments",
    lab_results: "Lab Results", prescriptions: "Prescriptions", reports: "Reports & Stats",
    my_file: "My Medical File", book_appointment: "Book Appointment", my_appointments: "My Appointments",
    my_labs: "My Lab Results", my_prescriptions: "My Prescriptions",
    add_patient: "Add Patient", search_patients: "Search patients...",
    gender: "Gender", male: "Male", female: "Female", birth_date: "Date of birth",
    address: "Address", chronic_diseases: "Chronic diseases", family_history: "Family history",
    allergies: "Drug allergies", notes: "Notes", save: "Save", cancel: "Cancel",
    edit: "Edit", delete: "Delete", view: "View", close: "Close", actions: "Actions",
    date: "Date", time: "Time", reason: "Visit reason", status: "Status",
    pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled",
    confirm: "Confirm", new_appointment: "New appointment", no_data: "No data to show yet",
    test_name: "Test name", test_value: "Value", unit: "Unit",
    reference_range: "Reference range", test_date: "Test date", add_lab_result: "Add lab result",
    diagnosis: "Diagnosis", medication: "Medication", dosage: "Dosage", frequency: "Frequency",
    duration: "Duration", instructions: "Instructions", add_medication_line: "Add medication line",
    new_prescription: "New prescription", total_patients: "Total patients", today_appointments: "Today's appointments",
    pending_appointments: "Pending appointments", total_labs: "Lab results logged",
    welcome: "Welcome", patient_details: "Patient details", overview: "Overview",
    select_patient: "Select a patient", loading: "Loading...", saved_successfully: "Saved successfully",
    deleted_successfully: "Deleted successfully", error_occurred: "Something went wrong, try again",
    fill_required: "Please fill in all required fields", back: "Back",
    normal: "Normal", high: "High", low: "Low",
    connect_supabase: "To activate the site, add your Supabase credentials in supabaseClient.js",
    national_clinic_desc: "A digital platform to track diabetes, thyroid disorders and hormone health",
  }
};

function getLang(){ return localStorage.getItem('clinic_lang') || 'ar'; }
function setLang(lang){
  localStorage.setItem('clinic_lang', lang);
  applyLang();
}
function t(key){
  const lang = getLang();
  return (DICT[lang] && DICT[lang][key]) || key;
}
function applyLang(){
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('.lang-toggle').forEach(btn=>{
    btn.textContent = lang === 'ar' ? 'English' : 'العربية';
  });
}
document.addEventListener('DOMContentLoaded', ()=>{
  applyLang();
  document.querySelectorAll('.lang-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=> setLang(getLang()==='ar' ? 'en' : 'ar'));
  });
});
