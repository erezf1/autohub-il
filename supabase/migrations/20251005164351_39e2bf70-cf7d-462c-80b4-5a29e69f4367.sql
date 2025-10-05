-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own vehicle images
CREATE POLICY "Users can upload vehicle images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view vehicle images (public bucket)
CREATE POLICY "Anyone can view vehicle images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'vehicle-images');

-- Allow users to update their own vehicle images
CREATE POLICY "Users can update own vehicle images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vehicle-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own vehicle images
CREATE POLICY "Users can delete own vehicle images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vehicle-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can manage all vehicle images
CREATE POLICY "Admins can manage all vehicle images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'vehicle-images' AND
  is_admin(auth.uid())
);