DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "user_googleId_unique";--> statement-breakpoint
DROP INDEX "user_githubId_unique";--> statement-breakpoint
DROP INDEX "user_githubUsername_unique";--> statement-breakpoint
ALTER TABLE `appFeedback` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_googleId_unique` ON `user` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubId_unique` ON `user` (`githubId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubUsername_unique` ON `user` (`githubUsername`);--> statement-breakpoint
ALTER TABLE `appFeedback` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `category` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `category` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `categoryItem` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `categoryItem` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `item` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `item` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `list` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `list` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `userSession` ALTER COLUMN "createdAt" TO "createdAt" text NOT NULL;--> statement-breakpoint
ALTER TABLE `userSession` ALTER COLUMN "updatedAt" TO "updatedAt" text NOT NULL;