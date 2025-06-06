/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `hourly_price` (double precision, required)
      - `once_price` (double precision, required)
      - `active` (boolean, default true)
      - `lat` (double precision, required)
      - `long` (double precision, required)
      - `rating` (double precision)
      - `created_at` (timestamptz, default now())
      - `tags` (text array)
      - `category` (uuid)
      - `search_keys` (text)
      - `subcategory` (uuid)
      - `provider_id` (text, required)
      - `provider` (uuid)
      - `terms_and_conditions` (text)
      - `images` (text array)
      - `service_area` (integer)
      - `verification_status` (text)
      - `image` (text, required)
      - `included` (text array)

  2. Security
    - Enable RLS on `services` table
    - Add policies for authenticated users to read services
    - Add policies for service providers to manage their own services
    - Add policies for public read access to active services

  3. Indexes
    - Add indexes for better query performance on location, category, and search
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  hourly_price double precision NOT NULL,
  once_price double precision NOT NULL,
  active boolean DEFAULT true,
  lat double precision NOT NULL,
  long double precision NOT NULL,
  rating double precision,
  created_at timestamptz DEFAULT now(),
  tags text[],
  category uuid,
  search_keys text,
  subcategory uuid,
  provider_id text NOT NULL,
  provider uuid,
  terms_and_conditions text,
  images text[],
  service_area integer,
  verification_status text,
  image text NOT NULL,
  included text[]
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for services table

-- Policy: Anyone can read active services
CREATE POLICY "Anyone can read active services"
  ON services
  FOR SELECT
  USING (active = true);

-- Policy: Authenticated users can read all services
CREATE POLICY "Authenticated users can read all services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Service providers can insert their own services
CREATE POLICY "Service providers can insert their own services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = provider_id);

-- Policy: Service providers can update their own services
CREATE POLICY "Service providers can update their own services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = provider_id)
  WITH CHECK (auth.uid()::text = provider_id);

-- Policy: Service providers can delete their own services
CREATE POLICY "Service providers can delete their own services"
  ON services
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = provider_id);

-- Create indexes for better performance

-- Index for location-based queries
CREATE INDEX IF NOT EXISTS idx_services_location 
  ON services USING gist (point(lat, long));

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_services_category 
  ON services (category) WHERE active = true;

-- Index for subcategory filtering
CREATE INDEX IF NOT EXISTS idx_services_subcategory 
  ON services (subcategory) WHERE active = true;

-- Index for provider queries
CREATE INDEX IF NOT EXISTS idx_services_provider 
  ON services (provider_id);

-- Index for search functionality
CREATE INDEX IF NOT EXISTS idx_services_search 
  ON services USING gin (to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(search_keys, '')));

-- Index for rating queries
CREATE INDEX IF NOT EXISTS idx_services_rating 
  ON services (rating DESC) WHERE active = true;

-- Index for created_at queries
CREATE INDEX IF NOT EXISTS idx_services_created_at 
  ON services (created_at DESC) WHERE active = true;

-- Add constraints for data validation

-- Ensure prices are positive
ALTER TABLE services ADD CONSTRAINT check_hourly_price_positive 
  CHECK (hourly_price > 0);

ALTER TABLE services ADD CONSTRAINT check_once_price_positive 
  CHECK (once_price > 0);

-- Ensure latitude is valid
ALTER TABLE services ADD CONSTRAINT check_lat_valid 
  CHECK (lat >= -90 AND lat <= 90);

-- Ensure longitude is valid
ALTER TABLE services ADD CONSTRAINT check_long_valid 
  CHECK (long >= -180 AND long <= 180);

-- Ensure rating is between 0 and 5
ALTER TABLE services ADD CONSTRAINT check_rating_valid 
  CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));

-- Ensure service area is positive
ALTER TABLE services ADD CONSTRAINT check_service_area_positive 
  CHECK (service_area IS NULL OR service_area > 0);

-- Add comments for documentation
COMMENT ON TABLE services IS 'Services offered by providers on the platform';
COMMENT ON COLUMN services.title IS 'Service title/name';
COMMENT ON COLUMN services.description IS 'Detailed service description';
COMMENT ON COLUMN services.hourly_price IS 'Price per hour for the service';
COMMENT ON COLUMN services.once_price IS 'One-time fixed price for the service';
COMMENT ON COLUMN services.active IS 'Whether the service is currently active/available';
COMMENT ON COLUMN services.lat IS 'Latitude coordinate of service location';
COMMENT ON COLUMN services.long IS 'Longitude coordinate of service location';
COMMENT ON COLUMN services.rating IS 'Average rating of the service (0-5 stars)';
COMMENT ON COLUMN services.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN services.category IS 'Main category UUID reference';
COMMENT ON COLUMN services.search_keys IS 'Additional keywords for search optimization';
COMMENT ON COLUMN services.subcategory IS 'Subcategory UUID reference';
COMMENT ON COLUMN services.provider_id IS 'ID of the service provider (auth.uid)';
COMMENT ON COLUMN services.provider IS 'Provider profile UUID reference';
COMMENT ON COLUMN services.terms_and_conditions IS 'Service-specific terms and conditions';
COMMENT ON COLUMN services.images IS 'Array of image URLs for the service';
COMMENT ON COLUMN services.service_area IS 'Service coverage area in kilometers';
COMMENT ON COLUMN services.verification_status IS 'Verification status of the service';
COMMENT ON COLUMN services.image IS 'Primary image URL for the service';
COMMENT ON COLUMN services.included IS 'Array of items/features included in the service';