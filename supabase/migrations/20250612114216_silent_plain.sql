/*
  # Create nearby services function

  1. Function
    - `nearby_services` - Returns services within a specified radius of user location
    - Uses PostGIS for geographic calculations
    - Includes provider and category details
    - Orders by distance

  2. Security
    - Function is accessible to authenticated users
    - Returns only active services
*/

-- Create function to find nearby services
CREATE OR REPLACE FUNCTION nearby_services(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  hourly_price DOUBLE PRECISION,
  once_price DOUBLE PRECISION,
  active BOOLEAN,
  lat DOUBLE PRECISION,
  long DOUBLE PRECISION,
  location GEOGRAPHY(POINT, 4326),
  rating DOUBLE PRECISION,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  subcategory UUID,
  provider UUID,
  terms_and_conditions TEXT,
  image TEXT,
  service_area INTEGER,
  verification_status TEXT,
  included TEXT[],
  distance_km DOUBLE PRECISION,
  provider_details JSONB,
  subcategory_details JSONB,
  category_details JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.description,
    s.hourly_price,
    s.once_price,
    s.active,
    s.lat,
    s.long,
    s.location,
    s.rating,
    s.created_at,
    s.tags,
    s.subcategory,
    s.provider,
    s.terms_and_conditions,
    s.image,
    s.service_area,
    s.verification_status,
    s.included,
    -- Calculate distance using PostGIS
    ROUND(
      ST_Distance(
        s.location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      ) / 1000, 2
    ) as distance_km,
    -- Provider details as JSONB
    jsonb_build_object(
      'id', u.id,
      'name', u.name,
      'profile_image', u.profile_image,
      'verified', u.verified,
      'rating', u.rating
    ) as provider_details,
    -- Subcategory details as JSONB
    jsonb_build_object(
      'id', sub.id,
      'name', sub.name,
      'icon', sub.icon,
      'category_id', sub.category_id
    ) as subcategory_details,
    -- Category details as JSONB
    jsonb_build_object(
      'id', cat.id,
      'name', cat.name,
      'icon', cat.icon
    ) as category_details
  FROM services s
  LEFT JOIN users u ON s.provider = u.id
  LEFT JOIN subcategories sub ON s.subcategory = sub.id
  LEFT JOIN categories cat ON sub.category_id = cat.id
  WHERE 
    s.active = true
    AND s.location IS NOT NULL
    AND ST_DWithin(
      s.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000 -- Convert km to meters
    )
  ORDER BY 
    ST_Distance(
      s.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) ASC
  LIMIT 50;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION nearby_services TO authenticated;