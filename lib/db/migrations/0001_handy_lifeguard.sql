ALTER TABLE "reports" RENAME COLUMN "product_id" TO "product_name";--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "product_name" SET DATA TYPE varchar(255);