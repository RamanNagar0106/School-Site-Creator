import { Layout } from "@/components/layout/Layout";
import { useListGallery } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

export function Gallery() {
  const { data: gallery, isLoading } = useListGallery();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(gallery?.map(img => img.category) || []))];

  const filteredGallery = gallery?.filter(
    img => activeCategory === "All" || img.category === activeCategory
  );

  return (
    <Layout>
      <div className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl mb-4">Photo Gallery</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">Glimpses of life, learning, and celebrations at M. B. Convent H. S. School.</p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-6 ${activeCategory === cat ? 'bg-primary text-white' : ''}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))
            ) : filteredGallery && filteredGallery.length > 0 ? (
              filteredGallery.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                  {img.imageUrl ? (
                    <img 
                      src={img.imageUrl} 
                      alt={img.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">{img.category}</span>
                    <h3 className="font-serif text-lg font-bold leading-tight">{img.title}</h3>
                    {img.description && <p className="text-sm text-white/80 mt-2 line-clamp-2">{img.description}</p>}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-500">
                No images available in this category.
              </div>
            )}
          </div>

        </div>
      </section>
    </Layout>
  );
}
