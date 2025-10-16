-- Drop ALL existing storage policies for these buckets
DROP POLICY IF EXISTS "Users can upload own dealer documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own dealer documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own dealer documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all dealer documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload dealer documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile pictures" ON storage.objects;

-- Dealer documents policies - allow authenticated users to upload during registration
CREATE POLICY "Authenticated users can upload dealer documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dealer-documents');

CREATE POLICY "Users can view own dealer documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'dealer-documents' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   (storage.foldername(name))[1] LIKE 'temp_%')
);

CREATE POLICY "Admins view all dealer documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'dealer-documents' AND
  is_admin(auth.uid())
);

CREATE POLICY "Users update own dealer documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dealer-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Profile pictures policies - allow authenticated users to upload
CREATE POLICY "Authenticated users upload profile pictures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');

CREATE POLICY "Public can view profile pictures"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users update own profile picture"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own profile picture"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);