DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "user_googleId_unique";--> statement-breakpoint
DROP INDEX "user_githubId_unique";--> statement-breakpoint
DROP INDEX "user_githubUsername_unique";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "email" TO "email" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_googleId_unique` ON `user` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubId_unique` ON `user` (`githubId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubUsername_unique` ON `user` (`githubUsername`);--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "name" TO "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "githubId" TO "githubId" integer;