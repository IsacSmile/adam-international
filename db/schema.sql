create extension if not exists pgcrypto;

do $$ begin
  create type lead_status as enum ('new','contacted','follow_up','converted','not_interested');
exception when duplicate_object then null; end $$;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) <= 20),
  country text,
  service text,
  university text,
  branch text,
  source_page text,
  consent boolean not null default false,
  consent_text text,
  status lead_status not null default 'new',
  notes text,
  assigned_to text
);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_phone_idx on leads (phone);

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists login_attempts (
  id bigserial primary key,
  email text not null,
  ip text,
  success boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_lookup_idx on login_attempts (email, created_at desc);

create table if not exists lead_ip_log (
  id bigserial primary key,
  ip text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_ip_log_lookup_idx on lead_ip_log (ip, created_at desc);

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at before update on leads
  for each row execute function set_updated_at();

-- Multiple enquiry form types & extra details
alter table leads add column if not exists form_type text not null default 'appointment';
alter table leads add column if not exists details jsonb not null default '{}'::jsonb;
alter table leads add column if not exists message text;
alter table leads add column if not exists whatsapp boolean;
alter table leads drop constraint if exists leads_form_type_chk;
alter table leads add constraint leads_form_type_chk
  check (form_type in ('appointment','eligibility','admission','visa','training','contact'));
create index if not exists leads_form_type_idx on leads (form_type);


