-- Add "אחר" (Other) model for all vehicle makes that currently have no models
INSERT INTO vehicle_models (make_id, name_hebrew, name_english, is_active)
SELECT id, 'אחר', 'Other', true
FROM vehicle_makes
WHERE is_active = true
AND id NOT IN (SELECT DISTINCT make_id FROM vehicle_models WHERE is_active = true);