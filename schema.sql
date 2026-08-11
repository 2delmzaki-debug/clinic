-- ============================================================
-- نظام إدارة عيادة الغدد الصماء - قاعدة بيانات Supabase (PostgreSQL)
-- Endocrinology Clinic Management System - Supabase Schema
-- شغّل هذا الملف كاملاً في: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- إضافة امتداد لتوليد UUID
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1) جدول الملفات الشخصية (يرتبط بجدول auth.users الخاص بـ Supabase)
--    كل مستخدم مسجل (طبيب أو مريض) له صف هنا يحدد دوره
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('doctor','patient')) default 'patient',
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2) جدول المرضى (الملف الطبي)
--    profile_id: يُملأ تلقائياً إذا سجّل المريض حساباً بنفسه من البوابة
--    يمكن للطبيب أيضاً إضافة مريض يدوياً بدون حساب دخول (profile_id = null)
-- ------------------------------------------------------------
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  gender text check (gender in ('male','female')),
  birth_date date,
  phone text,
  address text,
  chronic_diseases text,      -- الأمراض المزمنة (سكري، ضغط...)
  family_history text,        -- التاريخ المرضي العائلي
  allergies text,             -- الحساسية من أدوية
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3) جدول المواعيد
-- ------------------------------------------------------------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  doctor_id uuid references public.profiles(id),
  appointment_date date not null,
  appointment_time time not null,
  reason text,
  status text not null check (status in ('pending','confirmed','completed','cancelled')) default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4) جدول نتائج التحاليل (خاصة بالغدد الصماء: سكر، هرمونات الغدة الدرقية...)
-- ------------------------------------------------------------
create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  test_name text not null,        -- مثال: TSH, T3, T4, HbA1c, FBS, Cortisol
  test_value numeric,
  unit text,
  reference_min numeric,
  reference_max numeric,
  test_date date not null default current_date,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5) جدول الوصفات الطبية
-- ------------------------------------------------------------
create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  doctor_id uuid references public.profiles(id),
  prescription_date date not null default current_date,
  diagnosis text,
  notes text,
  created_at timestamptz not null default now()
);

-- بنود الوصفة (كل دواء سطر منفصل)
create table if not exists public.prescription_items (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references public.prescriptions(id) on delete cascade,
  medication_name text not null,
  dosage text,          -- مثال: 500mg
  frequency text,        -- مثال: مرتين يومياً
  duration text,          -- مثال: 30 يوم
  instructions text
);

-- ------------------------------------------------------------
-- دالة وتريغر لتحديث updated_at تلقائياً في جدول المرضى
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_patients_updated_at on public.patients;
create trigger trg_patients_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- دالة تُنشئ صف profile تلقائياً عند تسجيل مستخدم جديد
-- (يُستدعى الدور الافتراضي 'patient'؛ يقوم الطبيب بترقية نفسه يدوياً من لوحة Supabase
--  أو عبر إدخال أول طبيب مباشرة في الجدول)
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'patient'),
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================
-- تفعيل أمان مستوى الصف (Row Level Security)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.lab_results enable row level security;
alter table public.prescriptions enable row level security;
alter table public.prescription_items enable row level security;

-- دالة مساعدة: هل المستخدم الحالي طبيب؟
create or replace function public.is_doctor()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'doctor'
  );
$$ language sql stable security definer;

-- ------------------ profiles ------------------
create policy "read own profile or doctor reads all"
on public.profiles for select
using (id = auth.uid() or public.is_doctor());

create policy "user updates own profile"
on public.profiles for update
using (id = auth.uid());

-- ------------------ patients ------------------
create policy "doctor full access to patients"
on public.patients for all
using (public.is_doctor())
with check (public.is_doctor());

create policy "patient reads own record"
on public.patients for select
using (profile_id = auth.uid());

-- ------------------ appointments ------------------
create policy "doctor full access to appointments"
on public.appointments for all
using (public.is_doctor())
with check (public.is_doctor());

create policy "patient reads own appointments"
on public.appointments for select
using (
  exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
);

create policy "patient books own appointment"
on public.appointments for insert
with check (
  exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
);

create policy "patient cancels own pending appointment"
on public.appointments for update
using (
  exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
)
with check (
  exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
);

-- ------------------ lab_results ------------------
create policy "doctor full access to lab_results"
on public.lab_results for all
using (public.is_doctor())
with check (public.is_doctor());

create policy "patient reads own lab_results"
on public.lab_results for select
using (
  exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
);

-- ------------------ prescriptions ------------------
create policy "doctor full access to prescriptions"
on public.prescriptions for all
using (public.is_doctor())
with check (public.is_doctor());

create policy "patient reads own prescriptions"
on public.prescriptions for select
using (
  exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
);

-- ------------------ prescription_items ------------------
create policy "doctor full access to prescription_items"
on public.prescription_items for all
using (public.is_doctor())
with check (public.is_doctor());

create policy "patient reads own prescription_items"
on public.prescription_items for select
using (
  exists (
    select 1 from public.prescriptions pr
    join public.patients p on p.id = pr.patient_id
    where pr.id = prescription_id and p.profile_id = auth.uid()
  )
);

-- ============================================================
-- (اختياري) لجعل أول مستخدم طبيباً بعد إنشاء حسابه:
-- update public.profiles set role = 'doctor' where id = '<UUID الخاص بالمستخدم>';
-- ============================================================
