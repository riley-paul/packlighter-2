CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`googleId` text,
	`githubId` text,
	`githubUsername` text,
	`name` text,
	`avatarUrl` text,
	`createdAt` text,
	`updatedAt` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_googleId_unique` ON `user` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubId_unique` ON `user` (`githubId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_githubUsername_unique` ON `user` (`githubUsername`);