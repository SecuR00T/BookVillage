-- Deduplicate historical repeated reports before adding unique constraint.
DELETE rr1
FROM review_reports rr1
JOIN review_reports rr2
  ON rr1.review_id = rr2.review_id
 AND rr1.user_id = rr2.user_id
 AND rr1.id > rr2.id;

ALTER TABLE review_reports
    ADD UNIQUE KEY uk_review_reports_user_review (review_id, user_id);

-- Remove stale demo cart rows for seeded accounts.
DELETE ci
FROM cart_items ci
JOIN users u ON u.id = ci.user_id
WHERE u.email LIKE '%@yes24.mock';
