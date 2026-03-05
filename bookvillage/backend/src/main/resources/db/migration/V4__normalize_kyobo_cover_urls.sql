-- Normalize Kyobo eBook cover URLs.
-- Many imported rows were saved as /ebk/... and return the same "no image" placeholder.
-- Switching to /pdt/... resolves actual cover images for most records.
UPDATE books
SET cover_image_url = REPLACE(cover_image_url, '/ebk/', '/pdt/')
WHERE cover_image_url LIKE '%contents.kyobobook.co.kr%/ebk/%';
