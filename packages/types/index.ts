// ── Enums
export type UserRole = 'landlord' | 'tenant' | 'admin';
export type PropertyMode = 'long_term' | 'short_stay';
export type PropertyStatus = 'occupied' | 'vacant' | 'maintenance';
export type LeaseStatus = 'active' | 'expired' | 'terminated' | 'pending';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'failed';
export type NoticeType = 'quit' | 'breach' | 'repair' | 'renewal';
export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type MaintenanceStatus = 'open' | 'in_progress' | 'resolved';
export type MessageChannel = 'in_app' | 'whatsapp' | 'email';

// ── User
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  nin?: string;
  bvn?: string;
  id_verified: boolean;
  email_verified: boolean;
  avatar_url?: string;
  state: string;
  created_at: string;
}

// ── Property
export interface Property {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  state: string;
  lga: string;
  lat?: number;
  lng?: number;
  mode: PropertyMode;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  photos: string[];
  annual_rent?: number;
  nightly_rate?: number;
  service_charge?: number;
  agency_fee?: number;
  caution_fee?: number;
  airbnb_ical_url?: string;
  invite_token: string;
  invite_active: boolean;
  created_at: string;
}

// ── Lease
export interface Lease {
  id: string;
  property_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  annual_rent: number;
  status: LeaseStatus;
  agreement_url?: string;
  created_at: string;
}

// ── Payment
export interface Payment {
  id: string;
  lease_id?: string;
  booking_id?: string;
  payer_id: string;
  property_id: string;
  amount: number;
  status: PaymentStatus;
  paystack_ref?: string;
  proof_url?: string;
  paid_at?: string;
  due_date: string;
  created_at: string;
}

// ── Booking (Short-stay)
export interface Booking {
  id: string;
  property_id: string;
  guest_id?: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_amount: number;
  status: BookingStatus;
  source: 'direct' | 'airbnb';
  airbnb_booking_id?: string;
  created_at: string;
}

// ── Notice
export interface Notice {
  id: string;
  property_id: string;
  tenant_id: string;
  issued_by: string;
  type: NoticeType;
  content: string;
  delivered_via: MessageChannel[];
  delivered_at?: string;
  created_at: string;
}

// ── Maintenance
export interface MaintenanceRequest {
  id: string;
  property_id: string;
  tenant_id: string;
  category: string;
  description: string;
  status: MaintenanceStatus;
  photo_urls: string[];
  created_at: string;
  resolved_at?: string;
}

// ── Message
export interface Message {
  id: string;
  property_id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  channel: MessageChannel;
  read: boolean;
  created_at: string;
}
