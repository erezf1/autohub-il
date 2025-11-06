-- Fix anonymous upload policies to rely on file extension only (metadata may be null)
DROP POLICY IF EXISTS "Anonymous temp uploads for dealer documents" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous temp uploads for profile pictures" ON storage.objects;

-- Recreate with extension-only checks
CREATE POLICY "Anonymous temp uploads for dealer documents"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'dealer-documents' AND
  (storage.foldername(name))[1] LIKE 'temp_%' AND
  lower(storage.extension(name)) IN ('pdf', 'jpg', 'jpeg', 'png', 'docx')
);

CREATE POLICY "Anonymous temp uploads for profile pictures"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] LIKE 'temp_%' AND
  lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp')
);
