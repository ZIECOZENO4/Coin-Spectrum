import {
  pgTable,
  text,
  doublePrecision,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const UserRole = pgEnum("user_role", ["user", "admin"]);

export enum UserRoleEnum {
  User = "user",
  Admin = "admin",
}

export enum TransactionTypeEnum {
  Deposit = "deposit",
  Withdrawal = "withdrawal",
  Investment = "investment",
}

export enum InvestmentNameEnum {
  VIP1 = "vip1",
  VIP2 = "vip2",
  VIP3 = "vip3",
  VIP4 = "vip4",
  VIP5 = "vip5",
  VIP6 = "vip6",
  VIP7 = "vip7",
}

export const TransactionType = pgEnum("transaction_type", [
  "deposit",
  "withdrawal",
  "investment",
]);

export const InvestmentName = pgEnum("investment_name", [
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
]);

// export const users = pgTable("user", {
//   id: text("id").primaryKey(),
//   role: UserRole("role").notNull().default("user"),
//   firstName: text("first_name"),
//   username: text("username"),
//   fullName: text("full_name"),
//   imageUrl: text("image_url"),
//   email: text("email").notNull(),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at").notNull().defaultNow(),
// }, (users) => ({
//   usernameIndex: uniqueIndex("user_username_key").on(users.username),
//   emailIndex: uniqueIndex("user_email_key").on(users.email),
// }));
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  role: UserRole("role").notNull().default("user"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username"),
  fullName: text("full_name"),
  imageUrl: text("image_url"),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  bitcoinAccountId: text("bitcoin_account_id"),
  usdtTrc20AccountId: text("usdt_trc20_account_id"),
  ethereumAccountId: text("ethereum_account_id"),
  litecoinAccountId: text("litecoin_account_id"),
  dogecoinAccountId: text("dogecoin_account_id"),
  xrpAccountId: text("xrp_account_id"),
  usdtErc20AccountId: text("usdt_erc20_account_id"),
  country: text("country"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (users) => ({
  usernameIndex: uniqueIndex("user_username_key").on(users.username),
  emailIndex: uniqueIndex("user_email_key").on(users.email),
}));


export const userReferrals = pgTable("user_referral", {
  id: text("id").primaryKey(),
  referrerId: text("referrer_id").notNull().references(() => users.id),
  referredUserId: text("referred_user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (userReferrals) => ({
  referralIndex: uniqueIndex("user_referral_key").on(
    userReferrals.referrerId,
    userReferrals.referredUserId
  ),
}));

export const investments = pgTable("investment", {
  id: text("id").primaryKey(),
  name: InvestmentName("name").notNull(),
  price: doublePrecision("price").notNull(),
  profitPercent: doublePrecision("profit_percent").notNull(),
  rating: integer("rating").notNull(),
  principalReturn: boolean("principal_return").notNull(),
  principalWithdraw: boolean("principal_withdraw").notNull(),
  creditAmount: doublePrecision("credit_amount").notNull(),
  depositFee: text("deposit_fee").notNull(),
  debitAmount: doublePrecision("debit_amount").notNull(),
  durationDays: integer("duration_days").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userInvestments = pgTable("user_investment", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  investmentId: text("investment_id").notNull().references(() => investments.id),
  amount: doublePrecision("amount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionHistory = pgTable("transaction_history", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  investmentId: text("investment_id").references(() => investments.id),
  type: TransactionType("type").notNull(),
  amount: doublePrecision("amount").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type Investment = InferSelectModel<typeof investments>;
export type UserInvestment = InferSelectModel<typeof userInvestments>;
export type TransactionHistory = InferSelectModel<typeof transactionHistory>;
export type UserReferral = InferSelectModel<typeof userReferrals>;
