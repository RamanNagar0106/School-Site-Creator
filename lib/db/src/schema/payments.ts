import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  studentClass: text("student_class").notNull(),
  parentName: text("parent_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  feeType: text("fee_type").notNull(),
  amount: text("amount").notNull(),
  transactionId: text("transaction_id").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentDate: text("payment_date").notNull(),
  status: text("status").notNull().default("pending"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Payment = typeof paymentsTable.$inferSelect;
