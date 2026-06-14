CREATE TABLE `click_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`feedId` int NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`userAgent` varchar(500),
	`referer` varchar(2048),
	`ipHash` varchar(64),
	CONSTRAINT `click_tracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feeds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` varchar(2048) NOT NULL,
	`status` enum('active','inactive','error') DEFAULT 'active',
	`lastImportedAt` timestamp,
	`lastErrorMessage` text,
	`productCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feeds_id` PRIMARY KEY(`id`),
	CONSTRAINT `url_unique` UNIQUE(`url`)
);
--> statement-breakpoint
CREATE TABLE `filter_cache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paramName` varchar(100) NOT NULL,
	`paramValues` json NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `filter_cache_id` PRIMARY KEY(`id`),
	CONSTRAINT `filter_cache_paramName_unique` UNIQUE(`paramName`)
);
--> statement-breakpoint
CREATE TABLE `product_parameters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`paramName` varchar(100) NOT NULL,
	`paramValue` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_parameters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedId` int NOT NULL,
	`externalId` varchar(255) NOT NULL,
	`name` varchar(500) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` varchar(2048),
	`retailerUrl` varchar(2048) NOT NULL,
	`affiliateUrl` varchar(2048),
	`category` varchar(500),
	`parametersJson` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_external` UNIQUE(`feedId`,`externalId`)
);
--> statement-breakpoint
CREATE TABLE `seo_metadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageType` enum('home','filter','product') NOT NULL,
	`pageSlug` varchar(500) NOT NULL,
	`metaTitle` varchar(160) NOT NULL,
	`metaDescription` varchar(160) NOT NULL,
	`metaKeywords` varchar(500),
	`jsonLd` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seo_metadata_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_page` UNIQUE(`pageType`,`pageSlug`)
);
--> statement-breakpoint
CREATE INDEX `idx_productId` ON `click_tracking` (`productId`);--> statement-breakpoint
CREATE INDEX `idx_timestamp` ON `click_tracking` (`timestamp`);--> statement-breakpoint
CREATE INDEX `idx_productId` ON `product_parameters` (`productId`);--> statement-breakpoint
CREATE INDEX `idx_param` ON `product_parameters` (`paramName`,`paramValue`);--> statement-breakpoint
CREATE INDEX `idx_feedId` ON `products` (`feedId`);--> statement-breakpoint
CREATE INDEX `idx_name` ON `products` (`name`);--> statement-breakpoint
CREATE INDEX `idx_price` ON `products` (`price`);--> statement-breakpoint
CREATE INDEX `idx_category` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `idx_slug` ON `seo_metadata` (`pageSlug`);