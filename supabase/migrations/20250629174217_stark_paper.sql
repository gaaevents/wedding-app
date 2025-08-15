/*
  # GA&A Events Database Schema

  1. New Tables
    - `users` - Store all user information (couples, vendors, guests, admins)
    - `events` - Wedding events with details, budget, and privacy settings
    - `tasks` - Task management with assignments and deadlines
    - `guests` - Guest list management with RSVP tracking
    - `vendors` - Vendor profiles with services and ratings
    - `budget_items` - Budget tracking by category
    - `bookings` - Vendor bookings and appointments
    - `payments` - Payment transactions and history
    - `gift_registry_items` - Wedding gift registry management
    - `messages` - In-app messaging between users
    - `notifications` - User notifications and alerts
    - `seating_plans` - Table seating arrangements
    - `reviews` - Vendor reviews and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Ensure data privacy and security

  3. Features
    - Support for public/private events
    - Multi-role user system
    - Comprehensive vendor marketplace
    - Budget and payment tracking
    - Guest management and RSVPs
    - Task and timeline management
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'vendor', 'couple', 'guest', 'general')),
  avatar text,
  phone text,
  created_at timestamptz DEFAULT now(),
  is_approved boolean DEFAULT false,
  privacy_accepted boolean DEFAULT false
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  venue text NOT NULL,
  couple_names jsonb NOT NULL DEFAULT '[]',
  guest_count integer NOT NULL DEFAULT 0,
  budget numeric(10, 2) NOT NULL DEFAULT 0,
  spent numeric(10, 2) NOT NULL DEFAULT 0,
  is_public boolean DEFAULT false,
  progress numeric(5, 2) DEFAULT 0.00,
  description text,
  location text NOT NULL,
  style text NOT NULL,
  photos jsonb NOT NULL DEFAULT '[]',
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  assignee text NOT NULL,
  completed boolean DEFAULT false,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  rsvp_status text NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'declined')),
  plus_one boolean DEFAULT false,
  plus_one_name text,
  dietary_restrictions text,
  table_number integer,
  notes text,
  invited_at timestamptz DEFAULT now(),
  responded_at timestamptz
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'photographer', 'videographer', 'venue', 'caterer', 'florist', 'musician', 
    'dj', 'baker', 'planner', 'decorator', 'transportation', 'officiant', 
    'makeup', 'hair', 'dress', 'suit', 'jewelry', 'invitations', 'favors'
  )),
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  website text,
  rating numeric(3, 2) NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer NOT NULL DEFAULT 0,
  starting_price numeric(10, 2) NOT NULL DEFAULT 0,
  location text NOT NULL,
  description text NOT NULL,
  services jsonb NOT NULL DEFAULT '[]',
  photos jsonb NOT NULL DEFAULT '[]',
  availability jsonb NOT NULL DEFAULT '[]',
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  social_media jsonb DEFAULT '{}'
);

-- Create budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category text NOT NULL,
  budgeted numeric(10, 2) NOT NULL DEFAULT 0,
  spent numeric(10, 2) NOT NULL DEFAULT 0,
  remaining numeric(10, 2) NOT NULL DEFAULT 0,
  color text NOT NULL DEFAULT 'bg-gray-500',
  vendors jsonb NOT NULL DEFAULT '[]',
  notes text
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  couple_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  duration integer NOT NULL DEFAULT 1,
  amount numeric(10, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  method text NOT NULL DEFAULT 'stripe' CHECK (method IN ('stripe', 'crypto', 'cash', 'check')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create gift_registry_items table
CREATE TABLE IF NOT EXISTS gift_registry_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  purchased integer NOT NULL DEFAULT 0,
  retailer text NOT NULL,
  url text,
  image text,
  category text NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'file')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Create seating_plans table
CREATE TABLE IF NOT EXISTS seating_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  tables jsonb NOT NULL DEFAULT '[]',
  layout text NOT NULL DEFAULT 'mixed' CHECK (layout IN ('round', 'rectangular', 'mixed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  photos jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  is_verified boolean DEFAULT false
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_registry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can create user profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for events table
CREATE POLICY "Users can read public events" ON events
  FOR SELECT TO authenticated
  USING (is_public = true);

CREATE POLICY "Event creators can read their events" ON events
  FOR SELECT TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Event creators can update their events" ON events
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Create policies for tasks table
CREATE POLICY "Users can read tasks for their events" ON tasks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = tasks.event_id 
      AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage tasks for their events" ON tasks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = tasks.event_id 
      AND events.created_by = auth.uid()
    )
  );

-- Create policies for guests table
CREATE POLICY "Users can read guests for their events" ON guests
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = guests.event_id 
      AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage guests for their events" ON guests
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = guests.event_id 
      AND events.created_by = auth.uid()
    )
  );

-- Create policies for vendors table
CREATE POLICY "Anyone can read approved vendors" ON vendors
  FOR SELECT TO authenticated
  USING (is_approved = true);

CREATE POLICY "Vendors can read own data" ON vendors
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Vendors can update own data" ON vendors
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create vendor profile" ON vendors
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create policies for budget_items table
CREATE POLICY "Users can manage budget items for their events" ON budget_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = budget_items.event_id 
      AND events.created_by = auth.uid()
    )
  );

-- Create policies for bookings table
CREATE POLICY "Users can read their bookings" ON bookings
  FOR SELECT TO authenticated
  USING (
    auth.uid() = couple_id OR 
    auth.uid()::text = vendor_id::text
  );

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = couple_id);

CREATE POLICY "Users can update their bookings" ON bookings
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = couple_id OR 
    auth.uid()::text = vendor_id::text
  );

-- Create policies for payments table
CREATE POLICY "Users can read their payments" ON payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND (bookings.couple_id = auth.uid() OR bookings.vendor_id::text = auth.uid()::text)
    )
  );

-- Create policies for gift_registry_items table
CREATE POLICY "Users can manage gift registry for their events" ON gift_registry_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = gift_registry_items.event_id 
      AND events.created_by = auth.uid()
    )
  );

-- Create policies for messages table
CREATE POLICY "Users can read their messages" ON messages
  FOR SELECT TO authenticated
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Create policies for notifications table
CREATE POLICY "Users can read their notifications" ON notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for seating_plans table
CREATE POLICY "Users can manage seating plans for their events" ON seating_plans
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = seating_plans.event_id 
      AND events.created_by = auth.uid()
    )
  );

-- Create policies for reviews table
CREATE POLICY "Anyone can read verified reviews" ON reviews
  FOR SELECT TO authenticated
  USING (is_verified = true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their reviews" ON reviews
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON events(is_public);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_tasks_event_id ON tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_is_approved ON vendors(is_approved);
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors(rating);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_couple_id ON bookings(couple_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON reviews(vendor_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seating_plans_updated_at BEFORE UPDATE ON seating_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();