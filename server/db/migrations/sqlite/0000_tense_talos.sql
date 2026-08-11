CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`surname` text NOT NULL,
	`email` text NOT NULL,
	`tel` text NOT NULL,
	`address` text,
	`privacy_policy_date` text NOT NULL,
	`exam_name` text,
	`datetime` text,
	`struttura` text,
	`price_display` text,
	`source` text,
	`structure_id` text
);
