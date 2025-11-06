-- Allow anonymous users to upload trade license documents to temp folders
-- Restricted to: PDF, JPEG, PNG, DOCX
CREATE POLICY "Anonymous temp uploads for dealer documents"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'dealer-documents' AND
  (storage.foldername(name))[1] LIKE 'temp_%' AND
  (
    -- Allow PDF files
    (lower(storage.extension(name)) = 'pdf' AND 
     lower(COALESCE((metadata->>'mimetype')::text, '')) LIKE '%pdf%') OR
    
    -- Allow image files (JPEG, PNG)
    (lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png') AND 
     lower(COALESCE((metadata->>'mimetype')::text, '')) LIKE '%image%') OR
    
    -- Allow DOCX files
    (lower(storage.extension(name)) = 'docx' AND 
     lower(COALESCE((metadata->>'mimetype')::text, '')) LIKE '%wordprocessing%')
  )
);

-- Allow anonymous users to upload profile pictures to temp folders
-- Restricted to: JPEG, PNG, WEBP
CREATE POLICY "Anonymous temp uploads for profile pictures"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] LIKE 'temp_%' AND
  lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp') AND
  lower(COALESCE((metadata->>'mimetype')::text, '')) LIKE '%image%'
);

-- Allow anonymous users to read their own temp uploads
CREATE POLICY "Anonymous can read temp dealer documents"
ON storage.objects
FOR SELECT
TO anon
USING (
  bucket_id = 'dealer-documents' AND
  (storage.foldername(name))[1] LIKE 'temp_%'
);

CREATE POLICY "Anonymous can read temp profile pictures"
ON storage.objects
FOR SELECT
TO anon
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] LIKE 'temp_%'
);