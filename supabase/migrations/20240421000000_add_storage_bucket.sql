-- Create a storage bucket for note images
INSERT INTO storage.buckets (id, name, public)
VALUES ('note_images', 'note_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- 1. Allow public read access to images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'note_images');

-- 2. Allow authenticated users to upload images to their own folder
CREATE POLICY "Authenticated User Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'note_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'note_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Note: Quota enforcement will be handled at the application/API level 
-- to provide better user feedback (e.g. distinguishing between file size vs global quota).
