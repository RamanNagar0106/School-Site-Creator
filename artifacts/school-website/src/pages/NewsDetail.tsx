import { Layout } from "@/components/layout/Layout";
import { useGetNews } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft, Image as ImageIcon, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NewsDetail() {
  const [, params] = useRoute("/news/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: news, isLoading, isError } = useGetNews(id, {
    query: {
      enabled: !!id,
      queryKey: ["news", id]
    }
  });

  return (
    <Layout>
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Button variant="ghost" asChild className="mb-8 -ml-4 text-slate-500 hover:text-primary">
            <Link href="/news"><ArrowLeft className="mr-2 h-4 w-4" /> Back to all news</Link>
          </Button>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-full max-w-2xl" />
              <Skeleton className="h-6 w-48" />
            </div>
          ) : isError || !news ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
              <p className="text-slate-500 mb-6">The news article you are looking for does not exist or has been removed.</p>
              <Button asChild><Link href="/news">Return to News</Link></Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Badge className="bg-secondary text-primary hover:bg-secondary/90 uppercase tracking-wider text-xs px-3 py-1">
                {news.category}
              </Badge>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                {news.title}
              </h1>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-500 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(news.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <article className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="w-full aspect-[21/9] rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : news && (
            <>
              {news.imageUrl ? (
                <div className="mb-12 rounded-2xl overflow-hidden shadow-md">
                  <img src={news.imageUrl} alt={news.title} className="w-full max-h-[500px] object-cover" />
                </div>
              ) : null}
              
              <div className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary">
                <p className="lead text-xl text-slate-600 font-medium mb-8">
                  {news.summary}
                </p>
                {news.content ? (
                  <div dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p>{news.summary}</p>
                )}
              </div>
            </>
          )}
        </div>
      </article>
    </Layout>
  );
}
