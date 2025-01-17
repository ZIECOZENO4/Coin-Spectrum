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
import { InferSelectModel, relations } from "drizzle-orm";
import { varchar } from "drizzle-orm/mysql-core";

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

export const KycStatus = pgEnum("kyc_status", ["pending", "approved", "rejected"]);

export const IdType = pgEnum("id_type", [
  "passport",
  "national_id", 
  "drivers_license"
]);

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  role: UserRole("role").notNull().default("user"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username"),
  fullName: text("full_name"),
  imageUrl: text("image_url"),
  email: text("email").notNull(),
  balance: doublePrecision("balance").notNull().default(0),
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

export const userTrackers = pgTable("user_trackers", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  balance: doublePrecision("balance").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


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

export const pendingDeposits = pgTable("pending_deposits", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  cryptoType: text("crypto_type").notNull(),
  proofImageUrl: text("proof_image_url").notNull(),
  status: text("status").notNull().default("pending"),
  transactionId: text("transaction_id").unique().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const pendingWithdrawals = pgTable("pending_withdrawals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  cryptoType: text("crypto_type").notNull(),
  walletAddress: text("wallet_address").notNull(),
  status: text("status").notNull().default("pending"),
  processedAt: timestamp("processed_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const kyc = pgTable("kyc", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
    .unique(), // Ensure one KYC per user
    firstName: text("first_name"),
    lastName: text("last_name"),
    dateOfBirth: timestamp("date_of_birth"),
    email: text("email")
      .unique()
      .notNull(),
    phoneNumber: text("phone_number"),
    streetAddress: text("street_address"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country"),
  idType: IdType("id_type").notNull(),
  idNumber: text("id_number").notNull().unique(),
  idDocumentUrl: text("id_document_url"),
  proofOfAddressUrl: text("proof_of_address_url"),
  selfieUrl: text("selfie_url"),
  status: text("status").notNull().default('pending'),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
  
});

export const kycRelations = relations(kyc, ({ one }) => ({
  user: one(users, {
    fields: [kyc.userId],
    references: [users.id],
  }),
}));

export const investmentPlans = pgTable("investment_plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  minAmount: integer("min_amount").notNull(),
  maxAmount: integer("max_amount"),
  roi: doublePrecision("roi").notNull(),
  durationHours: integer("duration_hours").notNull(),
  instantWithdrawal: boolean("instant_withdrawal").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const investmentTrackers = pgTable("investment_trackers", {
  id: text("id").primaryKey(),
  investmentId: text("investment_id").notNull().references(() => investments.id),
  lastProfitUpdate: timestamp("last_profit_update").notNull(),
  totalProfit: doublePrecision("total_profit").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  cryptoType: text("crypto_type").notNull(),
  walletAddress: text("wallet_address").notNull(),
  status: text("status").notNull().default("UNCONFIRMED"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const investmentStatuses = pgTable("investment_statuses", {
  id: text("id").primaryKey(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const InvestmentStatusEnum = pgEnum('investment_status', ['CONFIRMED', 'SOLD', 'NOT_CONFIRMED']);
export const imageProofs = pgTable("image_proofs", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  investmentId: text("investment_id").notNull().references(() => investments.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const Wallets = pgEnum('wallets', [
  'BITCOIN',
  'ETHEREUM',
  'USDT',
  // Add other wallet types as needed
]);

export const traders = pgTable("traders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  followers: integer("followers").notNull().default(0),
  minCapital: doublePrecision("min_capital").notNull(),
  percentageProfit: doublePrecision("percentage_profit").notNull(),
  totalProfit: doublePrecision("total_profit").notNull(),
  rating: integer("rating").notNull(),
  isPro: boolean("is_pro").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userCopyTrades = pgTable("user_copy_trades", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  traderId: text("trader_id").notNull().references(() => traders.id),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tradingSignals = pgTable("trading_signals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  percentage: doublePrecision("percentage").notNull(),
  expiry: text("expiry").notNull(),
  risk: text("risk").notNull(), // "Low" | "Medium" | "High"
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const signalPurchases = pgTable("signal_purchases", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  signalId: text("signal_id").notNull().references(() => tradingSignals.id),
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull().default("active"),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type Trader = typeof traders.$inferSelect;

export const WithdrawalStatus = pgEnum('withdrawal_status', ['PENDING', 'COMPLETED', 'FAILED']); // Add all your status values
// You can add these lines to your existing types
export type InvestmentPlan = typeof investmentPlans.$inferSelect;
export type InvestmentTracker = typeof investmentTrackers.$inferSelect;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type User = InferSelectModel<typeof users>;
export type Investment = InferSelectModel<typeof investments>;
export type UserInvestment = InferSelectModel<typeof userInvestments>;
export type TransactionHistory = InferSelectModel<typeof transactionHistory>;
export type UserReferral = InferSelectModel<typeof userReferrals>;
