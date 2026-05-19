-- ============================================================
-- LA DÉSIRADE ÉVÉNEMENTS — Schéma Supabase
-- Coller et exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── TYPES ───────────────────────────────────────────────────
do $$ begin
  create type service_type as enum ('logistique', 'traiteur', 'decoration');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'confirmed', 'delivered', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

-- ─── PROFILES ────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text,
  last_name   text,
  phone       text,
  role        user_role default 'user',
  created_at  timestamptz default now()
);
alter table profiles enable row level security;
create policy "Profiles visible by owner" on profiles for select using (auth.uid() = id);
create policy "Profiles updatable by owner" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── CATEGORIES ──────────────────────────────────────────────
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  service     service_type not null,
  name_fr     text not null,
  name_en     text not null,
  icon        text default '📦',
  image_url   text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);
alter table categories enable row level security;
create policy "Categories readable by all" on categories for select using (true);
create policy "Categories writable by admin" on categories for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ─── ARTICLES ────────────────────────────────────────────────
create table if not exists articles (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  service         service_type not null,
  category_id     uuid references categories(id) on delete set null,
  name_fr         text not null,
  name_en         text not null,
  description_fr  text default '',
  description_en  text default '',
  price_per_day   int not null default 0,
  unit_fr         text default '/jour',
  stock_available int default 0,
  images          text[] default '{}',
  is_active       boolean default true,
  is_featured     boolean default false,
  created_at      timestamptz default now()
);
alter table articles enable row level security;
create policy "Articles readable by all" on articles for select using (true);
create policy "Articles writable by admin" on articles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ─── ORDERS ──────────────────────────────────────────────────
create table if not exists orders (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references auth.users(id) on delete set null,
  customer_name     text not null,
  customer_phone    text not null,
  event_date        date not null,
  delivery_address  text,
  notes             text,
  total_amount      int default 0,
  status            order_status default 'pending',
  whatsapp_sent_at  timestamptz,
  created_at        timestamptz default now()
);
alter table orders enable row level security;
create policy "Orders readable by owner or admin" on orders for select using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Orders insertable by anyone" on orders for insert with check (true);
create policy "Orders updatable by admin" on orders for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ─── ORDER ITEMS ─────────────────────────────────────────────
create table if not exists order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  article_id  uuid references articles(id) on delete set null,
  quantity    int not null default 1,
  unit_price  int not null,
  subtotal    int not null
);
alter table order_items enable row level security;
create policy "Order items readable by order owner or admin" on order_items for select using (
  exists (
    select 1 from orders o
    where o.id = order_id and (
      o.user_id = auth.uid() or
      exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
    )
  )
);
create policy "Order items insertable by anyone" on order_items for insert with check (true);

-- ─── FAVORITES ───────────────────────────────────────────────
create table if not exists favorites (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  article_id  uuid not null references articles(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, article_id)
);
alter table favorites enable row level security;
create policy "Favorites by owner" on favorites for all using (auth.uid() = user_id);

-- ─── SETTINGS ────────────────────────────────────────────────
create table if not exists settings (
  key    text primary key,
  value  text not null
);
alter table settings enable row level security;
create policy "Settings readable by all" on settings for select using (true);
create policy "Settings writable by admin" on settings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Default settings
insert into settings (key, value) values
  ('whatsapp_number', '242064000000'),
  ('business_name', 'La Désirade Événements'),
  ('business_address', 'Brazzaville, République du Congo'),
  ('business_email', 'contact@ladesirade.com'),
  ('currency', 'FCFA'),
  ('delivery_available', 'true'),
  ('announcement_banner', ''),
  ('banner_active', 'false')
on conflict (key) do nothing;
