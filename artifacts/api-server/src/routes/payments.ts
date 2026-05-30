import { Router, type IRouter } from "express";
import { db, paymentsTable } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

const PaymentBody = z.object({
  studentName: z.string().min(1),
  studentClass: z.string().min(1),
  parentName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  feeType: z.string().min(1),
  amount: z.string().min(1),
  transactionId: z.string().min(1),
  paymentMethod: z.string().min(1),
  paymentDate: z.string().min(1),
});

router.post("/payments", async (req, res): Promise<void> => {
  const parsed = PaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please fill all required fields correctly." });
    return;
  }
  const [record] = await db.insert(paymentsTable).values(parsed.data).returning();
  res.status(201).json({ success: true, id: record.id });
});

export default router;
