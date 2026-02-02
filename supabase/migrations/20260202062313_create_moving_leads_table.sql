/*
  # Create moving leads table

  1. New Tables
    - `moving_leads`
      - `id` (uuid, primary key) - Unique identifier
      - `from_location` (text) - Origin location
      - `to_location` (text) - Destination location
      - `rooms` (text) - Number of rooms/space size
      - `email` (text) - Contact email
      - `move_date` (date) - Preferred moving date
      - `first_name` (text) - First name
      - `last_name` (text) - Last name
      - `phone` (text) - Phone number
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      
  2. Security
    - Enable RLS on `moving_leads` table
    - Add policy for anonymous inserts (lead generation)
    - Add policy for authenticated admin reads
*/

-- Create moving_leads table
CREATE TABLE IF NOT EXISTS moving_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location text NOT NULL,
  to_location text NOT NULL,
  rooms text NOT NULL,
  email text NOT NULL,
  move_date date NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE moving_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for lead generation
CREATE POLICY "Allow anonymous lead submissions"
  ON moving_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all leads (for admin dashboard)
CREATE POLICY "Authenticated users can read leads"
  ON moving_leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS moving_leads_created_at_idx ON moving_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS moving_leads_move_date_idx ON moving_leads(move_date);