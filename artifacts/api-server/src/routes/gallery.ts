import { Router, type IRouter } from "express";
import { db, galleryTable } from "@workspace/db";
import { ListGalleryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/gallery", async (_req, res): Promise<void> => {
  const images = await db.select().from(galleryTable).orderBy(galleryTable.id);
  res.json(ListGalleryResponse.parse(images.map(g => ({
    id: g.id,
    title: g.title,
    imageUrl: g.imageUrl,
    category: g.category,
    description: g.description,
  }))));
});

export default router;
