import { Router, type IRouter } from "express";
import { db, newsTable, facultyTable } from "@workspace/db";
import { GetStatsResponse } from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [{ count: facultyCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(facultyTable);
  const [{ count: newsCount }] = await db.select({ count: sql<number>`count(*)::int` }).from(newsTable);

  void newsCount;

  res.json(GetStatsResponse.parse({
    totalStudents: 2500,
    totalFaculty: facultyCount ?? 0,
    yearsOfExcellence: 17,
    passRate: 98,
  }));
});

export default router;
