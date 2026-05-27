import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import {
  CreateNewsBody,
  GetNewsParams,
  GetNewsResponse,
  ListNewsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const news = await db.select().from(newsTable).orderBy(newsTable.createdAt);
  res.json(ListNewsResponse.parse(news.map(n => ({
    id: n.id,
    title: n.title,
    summary: n.summary,
    content: n.content,
    date: n.date,
    category: n.category,
    imageUrl: n.imageUrl,
  }))));
});

router.post("/news", async (req, res): Promise<void> => {
  const parsed = CreateNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(newsTable).values(parsed.data).returning();
  res.status(201).json(GetNewsResponse.parse({
    id: item.id,
    title: item.title,
    summary: item.summary,
    content: item.content,
    date: item.date,
    category: item.category,
    imageUrl: item.imageUrl,
  }));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetNewsParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "News item not found" });
    return;
  }
  res.json(GetNewsResponse.parse({
    id: item.id,
    title: item.title,
    summary: item.summary,
    content: item.content,
    date: item.date,
    category: item.category,
    imageUrl: item.imageUrl,
  }));
});

export default router;
