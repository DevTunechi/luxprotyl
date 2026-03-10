-- ============================================================
-- LuxProptyl PostgreSQL Schema (Supabase)
-- ============================================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUMS ────────────────────────────────────────────────────
CREATE TYPE user_role        AS ENUM ('landlord','tenant','admin');
CREATE TYPE property_mode    AS ENUM ('long_term','short_stay');
CREATE TYPE property_status  AS ENUM ('occupied','vacant','maintenance');
CREATE TYPE lease_status     AS ENUM ('active','expired','terminated','pending');
CREATE TYPE payment_status   AS ENUM ('paid','pending','overdue','failed');
CREATE TYPE notice_type      AS ENUM ('quit','breach','repair','renewal','general');
CREATE TYPE booking_status   AS ENUM ('confirmed','checked_in','checked_out','cancelled');
CREATE TYPE maintenance_status AS ENUM ('open','in_progress','resolved');
CREATE TYPE message_channel  AS ENUM ('in_app','whatsapp','email');
CREATE TYPE booking_source   AS ENUM ('direct','airbnb');

-- ── USERS ────────────────────────────────────────────────────
-- Extends Supabase auth.users
CREATE TABLE public.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT UNIQUE NOT NULL,
  full_name       TEXT NOT NULL,
  phone           TEXT,
  role            user_role NOT NULL DEFAULT 'landlord',
  nin             TEXT,
  bvn             TEXT,
  id_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  id_doc_url      TEXT,
  guarantor_name  TEXT,
  guarantor_phone TEXT,
  guarantor_id_url TEXT,
  avatar_url      TEXT,
  state           TEXT NOT NULL DEFAULT 'Lagos',
  lga             TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- ── PROPERTIES ───────────────────────────────────────────────
CREATE TABLE public.properties (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  address          TEXT NOT NULL,
  state            TEXT NOT NULL DEFAULT 'Lagos',
  lga              TEXT,
  lat              DECIMAL(10,8),
  lng              DECIMAL(11,8),
  mode             property_mode NOT NULL DEFAULT 'long_term',
  status           property_status NOT NULL DEFAULT 'vacant',
  property_type    TEXT DEFAULT 'apartment', -- flat, duplex, bungalow, self-con, studio
  bedrooms         SMALLINT NOT NULL DEFAULT 1,
  bathrooms        SMALLINT NOT NULL DEFAULT 1,
  amenities        TEXT[] DEFAULT '{}',
  photos           TEXT[] DEFAULT '{}',
  -- Long-term fields
  annual_rent      DECIMAL(12,2),
  service_charge   DECIMAL(12,2),
  agency_fee       DECIMAL(12,2),
  caution_fee      DECIMAL(12,2),
  lease_duration_years SMALLINT DEFAULT 1,
  -- Short-stay fields
  nightly_rate     DECIMAL(12,2),
  min_nights       SMALLINT DEFAULT 1,
  airbnb_ical_url  TEXT,
  airbnb_listing_id TEXT,
  last_synced_at   TIMESTAMPTZ,
  -- Invite system
  invite_token     TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  invite_active    BOOLEAN NOT NULL DEFAULT TRUE,
  invite_expires_at TIMESTAMPTZ,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can manage their properties"
  ON public.properties FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Tenants can view their leased property"
  ON public.properties FOR SELECT
  USING (
    id IN (
      SELECT property_id FROM public.leases
      WHERE tenant_id = auth.uid() AND status = 'active'
    )
  );

-- Index for invite token lookup
CREATE INDEX idx_properties_invite_token ON public.properties(invite_token);
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);

-- ── LEASES ───────────────────────────────────────────────────
CREATE TABLE public.leases (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  annual_rent     DECIMAL(12,2) NOT NULL,
  service_charge  DECIMAL(12,2) DEFAULT 0,
  status          lease_status NOT NULL DEFAULT 'pending',
  agreement_url   TEXT,
  signed_at       TIMESTAMPTZ,
  -- 3-month alert sent?
  alert_90_sent   BOOLEAN DEFAULT FALSE,
  alert_30_sent   BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT lease_dates_check CHECK (end_date > start_date)
);

ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlord can manage leases on their properties"
  ON public.leases FOR ALL
  USING (
    property_id IN (
      SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
  );
CREATE POLICY "Tenant can view own lease"
  ON public.leases FOR SELECT
  USING (tenant_id = auth.uid());

CREATE INDEX idx_leases_property_id ON public.leases(property_id);
CREATE INDEX idx_leases_tenant_id ON public.leases(tenant_id);
CREATE INDEX idx_leases_end_date ON public.leases(end_date) WHERE status = 'active';

-- ── PAYMENTS ─────────────────────────────────────────────────
CREATE TABLE public.payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lease_id        UUID REFERENCES public.leases(id) ON DELETE SET NULL,
  booking_id      UUID, -- references bookings, added after bookings table
  payer_id        UUID NOT NULL REFERENCES public.users(id),
  property_id     UUID NOT NULL REFERENCES public.properties(id),
  amount          DECIMAL(12,2) NOT NULL,
  status          payment_status NOT NULL DEFAULT 'pending',
  paystack_ref    TEXT UNIQUE,
  proof_url       TEXT,
  due_date        DATE NOT NULL,
  paid_at         TIMESTAMPTZ,
  verified_by     UUID REFERENCES public.users(id),
  verified_at     TIMESTAMPTZ,
  receipt_url     TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlord can view payments on their properties"
  ON public.payments FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
  );
CREATE POLICY "Tenant can view and create own payments"
  ON public.payments FOR ALL USING (payer_id = auth.uid());

CREATE INDEX idx_payments_property_id ON public.payments(property_id);
CREATE INDEX idx_payments_payer_id ON public.payments(payer_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_due_date ON public.payments(due_date);

-- ── BOOKINGS (Short-stay) ─────────────────────────────────────
CREATE TABLE public.bookings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id         UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_id            UUID REFERENCES public.users(id) ON DELETE SET NULL,
  guest_name          TEXT NOT NULL,
  guest_email         TEXT NOT NULL,
  guest_phone         TEXT,
  check_in            DATE NOT NULL,
  check_out           DATE NOT NULL,
  nights              SMALLINT NOT NULL,
  nightly_rate        DECIMAL(12,2) NOT NULL,
  total_amount        DECIMAL(12,2) NOT NULL,
  security_deposit    DECIMAL(12,2) DEFAULT 0,
  deposit_refunded    BOOLEAN DEFAULT FALSE,
  status              booking_status NOT NULL DEFAULT 'confirmed',
  source              booking_source NOT NULL DEFAULT 'direct',
  airbnb_booking_id   TEXT,
  check_in_code       TEXT,
  special_requests    TEXT,
  guest_rating        SMALLINT CHECK (guest_rating BETWEEN 1 AND 5),
  host_rating         SMALLINT CHECK (host_rating BETWEEN 1 AND 5),
  guest_review        TEXT,
  host_review         TEXT,
  cleaning_scheduled  BOOLEAN DEFAULT FALSE,
  cleaning_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT booking_dates_check CHECK (check_out > check_in)
);

-- Add FK for payments.booking_id now that bookings table exists
ALTER TABLE public.payments
  ADD CONSTRAINT payments_booking_id_fkey
  FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlord can manage bookings on their properties"
  ON public.bookings FOR ALL
  USING (
    property_id IN (
      SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
  );

CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- ── NOTICES ──────────────────────────────────────────────────
CREATE TABLE public.notices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  lease_id        UUID REFERENCES public.leases(id) ON DELETE SET NULL,
  tenant_id       UUID NOT NULL REFERENCES public.users(id),
  issued_by       UUID NOT NULL REFERENCES public.users(id),
  type            notice_type NOT NULL,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  delivered_via   message_channel[] DEFAULT '{}',
  delivered_at    TIMESTAMPTZ,
  read_at         TIMESTAMPTZ,
  document_url    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlord can manage notices on their properties"
  ON public.notices FOR ALL
  USING (issued_by = auth.uid());
CREATE POLICY "Tenant can view their notices"
  ON public.notices FOR SELECT USING (tenant_id = auth.uid());

CREATE INDEX idx_notices_tenant_id ON public.notices(tenant_id);
CREATE INDEX idx_notices_property_id ON public.notices(property_id);

-- ── MAINTENANCE REQUESTS ──────────────────────────────────────
CREATE TABLE public.maintenance_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  lease_id        UUID REFERENCES public.leases(id) ON DELETE SET NULL,
  tenant_id       UUID NOT NULL REFERENCES public.users(id),
  category        TEXT NOT NULL,
  description     TEXT NOT NULL,
  status          maintenance_status NOT NULL DEFAULT 'open',
  priority        TEXT DEFAULT 'normal', -- low, normal, high, urgent
  photo_urls      TEXT[] DEFAULT '{}',
  landlord_notes  TEXT,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlord can manage maintenance on their properties"
  ON public.maintenance_requests FOR ALL
  USING (
    property_id IN (
      SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
  );
CREATE POLICY "Tenant can create and view own maintenance requests"
  ON public.maintenance_requests FOR ALL USING (tenant_id = auth.uid());

CREATE INDEX idx_maintenance_property_id ON public.maintenance_requests(property_id);
CREATE INDEX idx_maintenance_status ON public.maintenance_requests(status);

-- ── MESSAGES ─────────────────────────────────────────────────
CREATE TABLE public.messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.users(id),
  recipient_id    UUID NOT NULL REFERENCES public.users(id),
  body            TEXT NOT NULL,
  channel         message_channel NOT NULL DEFAULT 'in_app',
  read            BOOLEAN NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  twilio_sid      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE INDEX idx_messages_property_id ON public.messages(property_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- ── NOTIFICATIONS ─────────────────────────────────────────────
CREATE TABLE public.notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  type            TEXT NOT NULL, -- lease_expiry, payment_due, maintenance, booking, notice
  entity_id       UUID,          -- related record id
  entity_type     TEXT,          -- property, lease, payment, booking
  read            BOOLEAN NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR ALL USING (user_id = auth.uid());

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read) WHERE read = FALSE;

-- ── AIRBNB CALENDAR BLOCKS ────────────────────────────────────
CREATE TABLE public.calendar_blocks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  source          booking_source NOT NULL DEFAULT 'direct',
  booking_id      UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  airbnb_uid      TEXT,  -- ical UID from Airbnb
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_calendar_blocks_property_id ON public.calendar_blocks(property_id);
CREATE INDEX idx_calendar_blocks_dates ON public.calendar_blocks(property_id, start_date, end_date);

-- ── CLEANING SCHEDULE ─────────────────────────────────────────
CREATE TABLE public.cleaning_schedules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  booking_id      UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  scheduled_at    TIMESTAMPTZ NOT NULL,
  completed_at    TIMESTAMPTZ,
  crew_notes      TEXT,
  status          TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, completed, cancelled
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cleaning_property_id ON public.cleaning_schedules(property_id);

-- ── AUDIT LOG ─────────────────────────────────────────────────
CREATE TABLE public.audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,   -- e.g. 'payment.verified', 'notice.sent'
  entity_type     TEXT,
  entity_id       UUID,
  metadata        JSONB,
  ip_address      INET,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_entity ON public.audit_logs(entity_type, entity_id);

-- ═══════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at        BEFORE UPDATE ON public.users             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_properties_updated_at   BEFORE UPDATE ON public.properties        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_leases_updated_at       BEFORE UPDATE ON public.leases            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated_at     BEFORE UPDATE ON public.payments          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bookings_updated_at     BEFORE UPDATE ON public.bookings          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_maintenance_updated_at  BEFORE UPDATE ON public.maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-deactivate invite token when lease expires
CREATE OR REPLACE FUNCTION deactivate_invite_on_lease_end()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('expired', 'terminated') THEN
    UPDATE public.properties
    SET invite_active = FALSE
    WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deactivate_invite
  AFTER UPDATE OF status ON public.leases
  FOR EACH ROW EXECUTE FUNCTION deactivate_invite_on_lease_end();

-- Auto-update property status when lease changes
CREATE OR REPLACE FUNCTION sync_property_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE public.properties SET status = 'occupied' WHERE id = NEW.property_id;
  ELSIF NEW.status IN ('expired', 'terminated') THEN
    UPDATE public.properties SET status = 'vacant' WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_property_status
  AFTER INSERT OR UPDATE OF status ON public.leases
  FOR EACH ROW EXECUTE FUNCTION sync_property_status();

-- ═══════════════════════════════════════════════
-- VIEWS
-- ═══════════════════════════════════════════════

-- Landlord portfolio overview
CREATE VIEW public.v_landlord_portfolio AS
SELECT
  p.owner_id,
  COUNT(p.id)                                          AS total_properties,
  COUNT(p.id) FILTER (WHERE p.status = 'occupied')    AS occupied,
  COUNT(p.id) FILTER (WHERE p.status = 'vacant')      AS vacant,
  COUNT(p.id) FILTER (WHERE p.mode = 'short_stay')    AS short_stay,
  COUNT(p.id) FILTER (WHERE p.mode = 'long_term')     AS long_term,
  COALESCE(SUM(p.annual_rent) FILTER (WHERE p.status = 'occupied' AND p.mode = 'long_term'), 0) AS annual_rent_total,
  COUNT(pay.id) FILTER (WHERE pay.status = 'overdue') AS overdue_payments
FROM public.properties p
LEFT JOIN public.payments pay ON pay.property_id = p.id
GROUP BY p.owner_id;

-- Leases expiring soon (for cron alerts)
CREATE VIEW public.v_expiring_leases AS
SELECT
  l.id          AS lease_id,
  l.property_id,
  l.tenant_id,
  l.end_date,
  l.alert_90_sent,
  l.alert_30_sent,
  p.name        AS property_name,
  p.owner_id,
  u.email       AS tenant_email,
  u.full_name   AS tenant_name,
  DATE_PART('day', l.end_date::TIMESTAMP - NOW()) AS days_remaining
FROM public.leases l
JOIN public.properties p ON p.id = l.property_id
JOIN public.users u ON u.id = l.tenant_id
WHERE l.status = 'active'
  AND l.end_date > NOW()
  AND DATE_PART('day', l.end_date::TIMESTAMP - NOW()) <= 90;

-- Overdue payments view
CREATE VIEW public.v_overdue_payments AS
SELECT
  pay.*,
  u.full_name   AS payer_name,
  u.email       AS payer_email,
  u.phone       AS payer_phone,
  p.name        AS property_name,
  p.owner_id
FROM public.payments pay
JOIN public.users u ON u.id = pay.payer_id
JOIN public.properties p ON p.id = pay.property_id
WHERE pay.status = 'overdue'
   OR (pay.status = 'pending' AND pay.due_date < NOW());

