import { Router, type IRouter } from "express";
import { db, admissionsTable } from "@workspace/db";
import { SubmitAdmissionBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/admissions", async (req, res): Promise<void> => {
  const parsed = SubmitAdmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [record] = await db.insert(admissionsTable).values(parsed.data).returning();
  res.status(201).json({
    id: record.id,
    studentName: record.studentName,
    parentName: record.parentName,
    email: record.email,
    phone: record.phone,
    gradeApplying: record.gradeApplying,
    message: record.message,
    createdAt: record.createdAt.toISOString(),
  });
});

export default router;
