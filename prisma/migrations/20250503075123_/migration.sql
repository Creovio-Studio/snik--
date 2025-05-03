/*
  Warnings:

  - The values [MANAGE_WORKSPACE_SET] on the enum `Permissions` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permissions_new" AS ENUM ('CREATE_WORKSPACE', 'DELETE_WORKSPACE', 'EDIT_WORKSPACE', 'MANAGE_WORKSPACE_SETTINGS', 'ADD_MEMBER', 'CHANGE_MEMBER_ROLE', 'REMOVE_MEMBER', 'CREATE_PROJECT', 'EDIT_PROJECT', 'DELETE_PROJECT', 'CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK', 'VIEW_ONLY');
ALTER TABLE "Role" ALTER COLUMN "permissions" TYPE "Permissions_new"[] USING ("permissions"::text::"Permissions_new"[]);
ALTER TYPE "Permissions" RENAME TO "Permissions_old";
ALTER TYPE "Permissions_new" RENAME TO "Permissions";
DROP TYPE "Permissions_old";
COMMIT;
