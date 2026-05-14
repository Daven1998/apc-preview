-- =========================================================================
-- APC BETA — DATABASE SCHEMA
-- Project: APC Beta (uxvnyjasnkdijazilasz)
-- Purpose: Tester onboarding + auto-generated property application flow
-- Created: 2026-05-14
-- Paste this entire file into Supabase SQL Editor → Run
-- =========================================================================

-- =========================================================================
-- 1. TESTERS  — real identity data for beta testers
-- =========================================================================
create table if not exists public.testers (
  id                    uuid primary key default gen_random_uuid(),
  auth_user_id          uuid unique references auth.users(id) on delete cascade,
  created_at            timestamptz not null default now(),
  full_name             text not null,
  email                 text not null,
  algarve_area          text not null,
  onboarding_status     text not null default 'started',  -- started | in_progress | completed | abandoned
  completion_percent    int  not null default 0,
  last_step_completed   int  not null default 0,
  feedback_score        int,
  notes_internal        text
);

create index if not exists testers_email_idx on public.testers (email);
create index if not exists testers_status_idx on public.testers (onboarding_status);

-- =========================================================================
-- 2. BETA_APPLICATIONS — auto-generated fake property data per tester
-- =========================================================================
create table if not exists public.beta_applications (
  id                            uuid primary key default gen_random_uuid(),
  tester_id                     uuid not null references public.testers(id) on delete cascade,
  generated_property_town       text,
  generated_address             text,
  generated_postcode            text,
  generated_property_type       text,
  generated_bedrooms            int,
  generated_capacity            int,
  generated_year_built          int,
  generated_nif                 text,
  generated_al_license          text,
  generated_risk_score          int,
  generated_compliance_status   text,    -- compliant | warnings | non_compliant
  generated_document_flags      jsonb,   -- e.g. {"caderneta": "missing", "licenca": "valid"}
  application_progress          int not null default 0,  -- 0-100
  submitted_at                  timestamptz,
  created_at                    timestamptz not null default now()
);

create index if not exists beta_apps_tester_idx on public.beta_applications (tester_id);

-- =========================================================================
-- 3. BETA_FEEDBACK — tester experience scores
-- =========================================================================
create table if not exists public.beta_feedback (
  id                uuid primary key default gen_random_uuid(),
  tester_id         uuid not null references public.testers(id) on delete cascade,
  clarity_score     int check (clarity_score between 1 and 10),
  ease_score        int check (ease_score between 1 and 10),
  trust_score       int check (trust_score between 1 and 10),
  confusion_notes   text,
  bugs_found        text,
  submitted_at      timestamptz not null default now()
);

create index if not exists feedback_tester_idx on public.beta_feedback (tester_id);

-- =========================================================================
-- 4. SESSION_TRACKING — step-by-step behavioural logging
-- =========================================================================
create table if not exists public.session_tracking (
  id                uuid primary key default gen_random_uuid(),
  tester_id         uuid not null references public.testers(id) on delete cascade,
  current_step      int not null,
  entered_at        timestamptz not null default now(),
  exited_at         timestamptz,
  duration_seconds  int,
  abandoned         boolean not null default false
);

create index if not exists session_tester_idx on public.session_tracking (tester_id);
create index if not exists session_step_idx on public.session_tracking (current_step);

-- =========================================================================
-- ROW LEVEL SECURITY  — every table locked, then granted by policy
-- =========================================================================
alter table public.testers           enable row level security;
alter table public.beta_applications enable row level security;
alter table public.beta_feedback     enable row level security;
alter table public.session_tracking  enable row level security;

-- ---- TESTERS POLICIES -----
-- A logged-in user can SELECT/INSERT/UPDATE their own row (matched by auth_user_id)
drop policy if exists "testers: own row read"   on public.testers;
drop policy if exists "testers: own row insert" on public.testers;
drop policy if exists "testers: own row update" on public.testers;

create policy "testers: own row read"
  on public.testers for select
  using (auth.uid() = auth_user_id);

create policy "testers: own row insert"
  on public.testers for insert
  with check (auth.uid() = auth_user_id);

create policy "testers: own row update"
  on public.testers for update
  using (auth.uid() = auth_user_id);

-- ---- BETA_APPLICATIONS POLICIES ----
drop policy if exists "apps: own read"   on public.beta_applications;
drop policy if exists "apps: own insert" on public.beta_applications;
drop policy if exists "apps: own update" on public.beta_applications;

create policy "apps: own read"
  on public.beta_applications for select
  using (tester_id in (select id from public.testers where auth_user_id = auth.uid()));

create policy "apps: own insert"
  on public.beta_applications for insert
  with check (tester_id in (select id from public.testers where auth_user_id = auth.uid()));

create policy "apps: own update"
  on public.beta_applications for update
  using (tester_id in (select id from public.testers where auth_user_id = auth.uid()));

-- ---- BETA_FEEDBACK POLICIES ----
drop policy if exists "feedback: own insert" on public.beta_feedback;
drop policy if exists "feedback: own read"   on public.beta_feedback;

create policy "feedback: own insert"
  on public.beta_feedback for insert
  with check (tester_id in (select id from public.testers where auth_user_id = auth.uid()));

create policy "feedback: own read"
  on public.beta_feedback for select
  using (tester_id in (select id from public.testers where auth_user_id = auth.uid()));

-- ---- SESSION_TRACKING POLICIES ----
drop policy if exists "sessions: own insert" on public.session_tracking;
drop policy if exists "sessions: own update" on public.session_tracking;
drop policy if exists "sessions: own read"   on public.session_tracking;

create policy "sessions: own insert"
  on public.session_tracking for insert
  with check (tester_id in (select id from public.testers where auth_user_id = auth.uid()));

create policy "sessions: own update"
  on public.session_tracking for update
  using (tester_id in (select id from public.testers where auth_user_id = auth.uid()));

create policy "sessions: own read"
  on public.session_tracking for select
  using (tester_id in (select id from public.testers where auth_user_id = auth.uid()));

-- =========================================================================
-- ADMIN ACCESS  — Dave, Joe, Liam can read everything
-- =========================================================================
-- Idempotent admin policies that grant FULL READ to APC team email addresses
drop policy if exists "admin read testers" on public.testers;
drop policy if exists "admin read apps"    on public.beta_applications;
drop policy if exists "admin read fbk"     on public.beta_feedback;
drop policy if exists "admin read sess"    on public.session_tracking;

create policy "admin read testers" on public.testers for select using (
  (auth.jwt() ->> 'email') in (
    'dave@algarvepropertycompliance.com',
    'joe@algarvepropertycompliance.com',
    'liam@algarvepropertycompliance.com',
    'hello@algarvepropertycompliance.com'
  )
);

create policy "admin read apps" on public.beta_applications for select using (
  (auth.jwt() ->> 'email') in (
    'dave@algarvepropertycompliance.com',
    'joe@algarvepropertycompliance.com',
    'liam@algarvepropertycompliance.com',
    'hello@algarvepropertycompliance.com'
  )
);

create policy "admin read fbk" on public.beta_feedback for select using (
  (auth.jwt() ->> 'email') in (
    'dave@algarvepropertycompliance.com',
    'joe@algarvepropertycompliance.com',
    'liam@algarvepropertycompliance.com',
    'hello@algarvepropertycompliance.com'
  )
);

create policy "admin read sess" on public.session_tracking for select using (
  (auth.jwt() ->> 'email') in (
    'dave@algarvepropertycompliance.com',
    'joe@algarvepropertycompliance.com',
    'liam@algarvepropertycompliance.com',
    'hello@algarvepropertycompliance.com'
  )
);

-- =========================================================================
-- ADMIN AGGREGATE VIEW — single query for the dashboard
-- =========================================================================
create or replace view public.v_admin_overview as
select
  t.id                  as tester_id,
  t.full_name,
  t.email,
  t.algarve_area,
  t.onboarding_status,
  t.completion_percent,
  t.last_step_completed,
  t.feedback_score,
  t.created_at,
  a.generated_property_town,
  a.generated_property_type,
  a.generated_risk_score,
  a.generated_compliance_status,
  a.submitted_at,
  (select avg(duration_seconds) from public.session_tracking s where s.tester_id = t.id) as avg_step_seconds,
  (select count(*) from public.session_tracking s where s.tester_id = t.id and s.abandoned) as abandoned_steps,
  (select clarity_score from public.beta_feedback f where f.tester_id = t.id order by submitted_at desc limit 1) as last_clarity,
  (select ease_score    from public.beta_feedback f where f.tester_id = t.id order by submitted_at desc limit 1) as last_ease,
  (select trust_score   from public.beta_feedback f where f.tester_id = t.id order by submitted_at desc limit 1) as last_trust
from public.testers t
left join public.beta_applications a on a.tester_id = t.id;

-- View permissions match the admin policies (because RLS on base tables flows through)
grant select on public.v_admin_overview to authenticated;

-- =========================================================================
-- STORAGE BUCKET — beta-documents (fake uploads during testing)
-- =========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'beta-documents',
  'beta-documents',
  false,                                  -- private (RLS-controlled)
  10485760,                               -- 10 MB
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies: each user reads/writes ONLY their own folder
drop policy if exists "beta-documents: own read"  on storage.objects;
drop policy if exists "beta-documents: own write" on storage.objects;

create policy "beta-documents: own read"
  on storage.objects for select
  using (
    bucket_id = 'beta-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "beta-documents: own write"
  on storage.objects for insert
  with check (
    bucket_id = 'beta-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- =========================================================================
-- DONE
-- =========================================================================
-- After running:
-- 1. Table Editor should show: testers, beta_applications, beta_feedback, session_tracking
-- 2. Storage should show: beta-documents bucket
-- 3. Authentication → Policies should list all the policies above
