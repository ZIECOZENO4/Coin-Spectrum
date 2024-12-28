import {
  pgTable,
  text,
  doublePrecision,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  pgEnum,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { InferSelectModel, sql } from "drizzle-orm";

export const UserRole = pgEnum("UserRole", ["User", "Admin"]);

export enum UserRoleEnum {
  User = "User",
  Admin = "Admin",
}

export enum TransactionTypeEnum {
  Deposit = "Deposit",
  Withdrawal = "Withdrawal",
  Investment = "Investment",
}

export enum InvestmentNameEnum {
  VIP1 = "VIP1",
  VIP2 = "VIP2",
  VIP3 = "VIP3",
  VIP4 = "VIP4",
  VIP5 = "VIP5",
  VIP6 = "VIP6",
  VIP7 = "VIP7",
}

export const TransactionType = pgEnum("TransactionType", [
  "Deposit",
  "Withdrawal",
  "Investment",
]);

export const InvestmentName = pgEnum("InvestmentName", [
  "VIP1",
  "VIP2",
  "VIP3",
  "VIP4",
  "VIP5",
  "VIP6",
  "VIP7",
]);

// Define Users Table with Self-Referencing Foreign Key
export const users = pgTable(
  "User",
  {
    id: text("id").primaryKey().notNull(),
    role: UserRole("role").notNull().default(UserRole.enumValues[0]),
    firstName: text("firstName"),
    username: text("username"),
    fullName: text("fullName"),
    imageUrl: text("imageUrl"),
    email: text("email").notNull(),
    createdAt: timestamp("createdAt")
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .default(sql`now()`),
  },
  (users) => ({
    usernameIndex: uniqueIndex("User_username_key").on(users.username),
    emailIndex: uniqueIndex("User_email_key").on(users.email),
  })
);

// Separate Referrals Table to Handle Self-Referencing Relationships
export const userReferrals = pgTable(
  "UserReferral",
  {
    id: text("id").primaryKey().notNull(),
    referrerId: text("referrerId")
      .references(() => users.id)
      .notNull(),
    referredUserId: text("referredUserId")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("createdAt")
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .default(sql`now()`),
  },
  (userReferrals) => ({
    referralIndex: uniqueIndex("UserReferral_referral_key").on(
      userReferrals.referrerId,
      userReferrals.referredUserId
    ),
  })
);

// Investment Table
export const investments = pgTable("Investment", {
  id: text("id").primaryKey(),
  name: InvestmentName("name").notNull(),
  price: doublePrecision("price").notNull(),
  profitPercent: doublePrecision("profitPercent").notNull(),
  rating: integer("rating").notNull(),
  principalReturn: boolean("principalReturn").notNull(),
  principalWithdraw: boolean("principalWithdraw").notNull(),
  creditAmount: doublePrecision("creditAmount").notNull(),
  depositFee: text("depositFee").notNull(),
  debitAmount: doublePrecision("debitAmount").notNull(),
  durationDays: integer("durationDays").notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`now()`),
});

// User Investment Table
export const userInvestments = pgTable("UserInvestment", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
  investmentId: text("investmentId")
    .references(() => investments.id)
    .notNull(),
  amount: doublePrecision("amount").notNull(),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`now()`),
});

// Transaction History Table
export const transactionHistory = pgTable("TransactionHistory", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
  investmentId: text("investmentId").references(() => investments.id), // Optional reference to the investment
  type: TransactionType("type").notNull(),
  amount: doublePrecision("amount").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .default(sql`now()`),
});

// Generate TypeScript types using InferModel
export type User = InferSelectModel<typeof users>;
export type Investment = InferSelectModel<typeof investments>;
export type UserInvestment = InferSelectModel<typeof userInvestments>;
export type TransactionHistory = InferSelectModel<typeof transactionHistory>;
export type UserReferral = InferSelectModel<typeof userReferrals>;
