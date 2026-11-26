CREATE TABLE `email_codes` (
	`tokenHash` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`codeHash` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`sentAt` integer NOT NULL,
	`verifiedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `email_codes_user` ON `email_codes` (`userId`);--> statement-breakpoint
ALTER TABLE `users` ADD `title` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `givenName` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `familyName` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `address` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `addressLine2` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `state` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `postalCode` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `country` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `jewishStatus` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `sex` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `birthDate` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `shabbatCity` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `tier` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerifiedAt` integer;