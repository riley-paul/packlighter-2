CREATE TABLE `appFeedback` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`feedback` text NOT NULL,
	`createdAt` text,
	`updatedAt` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`listId` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` text,
	`updatedAt` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `categoryItem` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`categoryId` text NOT NULL,
	`itemId` text NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`packed` integer DEFAULT false NOT NULL,
	`wornWeight` integer DEFAULT false NOT NULL,
	`consumableWeight` integer DEFAULT false NOT NULL,
	`createdAt` text,
	`updatedAt` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`weight` integer DEFAULT 0 NOT NULL,
	`weightUnit` text DEFAULT 'g' NOT NULL,
	`image` text,
	`createdAt` text,
	`updatedAt` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `list` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`showImages` integer DEFAULT false NOT NULL,
	`showPrices` integer DEFAULT false NOT NULL,
	`showPacked` integer DEFAULT false NOT NULL,
	`showWeights` integer DEFAULT false NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`weightUnit` text DEFAULT 'g' NOT NULL,
	`isPublic` integer DEFAULT false NOT NULL,
	`createdAt` text,
	`updatedAt` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `userSession` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` text,
	`createdAt` text,
	`updatedAt` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
