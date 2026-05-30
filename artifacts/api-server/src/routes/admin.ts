import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db, newsTable, facultyTable, galleryTable, contactsTable, admissionsTable } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.session.adminUser) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

router.post("/admin/login", (req: Request, res: Response): void => {
  const { username, password } = req.body as { username: string; password: string };
  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "school@2026";

  if (username === validUsername && password === validPassword) {
    req.session.adminUser = username;
    res.json({ success: true, username });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

router.post("/admin/logout", (req: Request, res: Response): void => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/admin/me", (req: Request, res: Response): void => {
  if (req.session.adminUser) {
    res.json({ loggedIn: true, username: req.session.adminUser });
  } else {
    res.json({ loggedIn: false });
  }
});

// ── News CRUD ─────────────────────────────────────────────────────────────────

const NewsBody = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().optional(),
  date: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().optional(),
});

router.get("/admin/news", requireAdmin, async (_req, res): Promise<void> => {
  const news = await db.select().from(newsTable).orderBy(newsTable.createdAt);
  res.json(news);
});

router.post("/admin/news", requireAdmin, async (req, res): Promise<void> => {
  const parsed = NewsBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Validation failed" }); return; }
  const [item] = await db.insert(newsTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.put("/admin/news/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const parsed = NewsBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Validation failed" }); return; }
  const [item] = await db.update(newsTable).set(parsed.data).where(eq(newsTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete("/admin/news/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(newsTable).where(eq(newsTable.id, id));
  res.json({ success: true });
});

// ── Faculty CRUD ──────────────────────────────────────────────────────────────

const FacultyBody = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  qualification: z.string().min(1),
  experience: z.string().min(1),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  designation: z.string().optional(),
});

router.get("/admin/faculty", requireAdmin, async (_req, res): Promise<void> => {
  const members = await db.select().from(facultyTable).orderBy(facultyTable.id);
  res.json(members);
});

router.post("/admin/faculty", requireAdmin, async (req, res): Promise<void> => {
  const parsed = FacultyBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Validation failed" }); return; }
  const [item] = await db.insert(facultyTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.put("/admin/faculty/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const parsed = FacultyBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Validation failed" }); return; }
  const [item] = await db.update(facultyTable).set(parsed.data).where(eq(facultyTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete("/admin/faculty/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(facultyTable).where(eq(facultyTable.id, id));
  res.json({ success: true });
});

// ── Gallery CRUD ──────────────────────────────────────────────────────────────

const GalleryBody = z.object({
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
});

router.get("/admin/gallery", requireAdmin, async (_req, res): Promise<void> => {
  const items = await db.select().from(galleryTable).orderBy(galleryTable.createdAt);
  res.json(items);
});

router.post("/admin/gallery", requireAdmin, async (req, res): Promise<void> => {
  const parsed = GalleryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Validation failed" }); return; }
  const [item] = await db.insert(galleryTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.delete("/admin/gallery/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  await db.delete(galleryTable).where(eq(galleryTable.id, id));
  res.json({ success: true });
});

// ── Enquiries (read-only) ─────────────────────────────────────────────────────

router.get("/admin/contacts", requireAdmin, async (_req, res): Promise<void> => {
  const contacts = await db.select().from(contactsTable).orderBy(contactsTable.createdAt);
  res.json(contacts);
});

router.get("/admin/admissions", requireAdmin, async (_req, res): Promise<void> => {
  const admissions = await db.select().from(admissionsTable).orderBy(admissionsTable.createdAt);
  res.json(admissions);
});

export default router;
