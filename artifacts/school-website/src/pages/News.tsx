import { Layout } from "@/components/layout/Layout";
import { useListNews } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function News() {
  const { data: news, isLoading } = useListNews();

  return (
    <Layout>
      <div className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl mb-4">News & Events</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">Stay updated with the latest happenings, announcements, and events at our school.</p>
        </div>
      </div>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-56 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            ) : news && news.length > 0 ? (
              news.map((item) => (
                <Card key={item.id} className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-slate-200 shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary hover:bg-primary/90 text-white uppercase tracking-wider text-xs px-3 py-1">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="p-6 pb-2 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(item.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <CardTitle className="font-serif text-xl leading-snug group-hover:text-primary transition-colors">
                      <Link href={`/news/${item.id}`}>{item.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-2 flex flex-col flex-1">
                    <p className="text-slate-600 line-clamp-3 mb-6 text-sm flex-1">{item.summary}</p>
                    <Link href={`/news/${item.id}`} className="inline-flex items-center text-sm font-bold text-primary hover:underline group/link mt-auto w-fit">
                      Read Full Article <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No News Available</h3>
                <p className="text-slate-500 max-w-sm mx-auto">There are currently no news items or events to display. Please check back later.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </Layout>
  );
}
