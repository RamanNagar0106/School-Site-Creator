import { Layout } from "@/components/layout/Layout";
import { useGetStats, useListNews } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BookOpen, GraduationCap, Users, Award, Calendar, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: news, isLoading: newsLoading } = useListNews();

  const recentNews = news?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply z-10" />
          <img
            src="/images/hero.png"
            alt="School Campus"
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        <div className="container relative z-20 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary backdrop-blur-sm">
              <Award className="h-4 w-4" />
              <span>Tradition of Excellence Since 1985</span>
            </div>
            <h1 className="font-serif text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              Knowledge, Discipline, <span className="text-secondary">Character</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
              Welcome to M.B. Convent High School, where we nurture young minds to become tomorrow's leaders through a blend of traditional values and modern education.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
              <Link href="/admissions">
                <Button size="lg" variant="secondary" className="h-12 w-full px-8 text-base font-semibold sm:w-auto">
                  Admissions Open
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="h-12 w-full border-white text-white hover:bg-white hover:text-primary px-8 text-base font-semibold sm:w-auto bg-transparent">
                  Discover Our School
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {statsLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)
            ) : stats ? (
              <>
                <StatCard icon={<Users className="h-8 w-8" />} value={stats.totalStudents.toString()} label="Total Students" />
                <StatCard icon={<GraduationCap className="h-8 w-8" />} value={stats.totalFaculty.toString()} label="Expert Faculty" />
                <StatCard icon={<Award className="h-8 w-8" />} value={stats.yearsOfExcellence.toString() + "+"} label="Years of Excellence" />
                <StatCard icon={<BookOpen className="h-8 w-8" />} value={stats.passRate.toString() + "%"} label="Pass Rate" />
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-serif text-4xl font-bold text-primary">A Legacy of Learning</h2>
              <div className="h-1 w-20 bg-secondary rounded-full"></div>
              <p className="text-lg text-slate-600 leading-relaxed">
                At M.B. Convent High School, we believe that education is not just about academic excellence, but about building character and fostering a lifelong love for learning.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our institution stands as a pillar of discipline and values, guiding students through their formative years with care, rigor, and dedication. We take pride in our highly qualified faculty and our comprehensive curriculum designed to prepare students for the challenges of tomorrow.
              </p>
              <Button asChild variant="link" className="px-0 text-primary font-semibold hover:text-primary/80">
                <Link href="/about">Read Principal's Message <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                <img src="/images/about.png" alt="Students in assembly" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-secondary/20 rounded-2xl z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* News Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-primary">Latest News & Events</h2>
              <div className="h-1 w-16 bg-secondary rounded-full"></div>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/news">View All News</Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {newsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            ) : recentNews.length > 0 ? (
              recentNews.map((item) => (
                <Card key={item.id} className="overflow-hidden border-0 shadow-lg group cursor-pointer transition-transform hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </div>
                  </div>
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <CardTitle className="font-serif text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-slate-600 line-clamp-3 mb-4 text-sm">{item.summary}</p>
                    <Link href={`/news/${item.id}`} className="text-primary font-semibold flex items-center text-sm hover:underline">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-500">
                No recent news available.
              </div>
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/news">View All News</Link>
            </Button>
          </div>
        </div>
      </section>

    </Layout>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="text-secondary p-3 bg-secondary/10 rounded-full">
        {icon}
      </div>
      <div className="text-3xl font-bold text-primary font-serif">{value}</div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

