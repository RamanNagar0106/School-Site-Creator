import { Router, type IRouter } from "express";
import { db, facultyTable } from "@workspace/db";
import { ListFacultyResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/faculty", async (_req, res): Promise<void> => {
  const members = await db.select().from(facultyTable).orderBy(facultyTable.id);
  res.json(ListFacultyResponse.parse(members.map(m => ({
    id: m.id,
    name: m.name,
    subject: m.subject,
    qualification: m.qualification,
    experience: m.experience,
    bio: m.bio,
    imageUrl: m.imageUrl,
    designation: m.designation,
  }))));
});

export default router;
