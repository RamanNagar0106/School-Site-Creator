import { Layout } from "@/components/layout/Layout";
import { useGetStats, useListNews } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, BookOpen, GraduationCap, Users, Award, Calendar, Image as ImageIcon, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TYPEWRITER_WORDS = ["Character", "Excellence", "Integrity", "Leadership", "Success"];

function useTypewriter(words: string[], speed = 90, pause = 1800) {
  const [display, setDisplay] = useState(words[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(words[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!deleting && charIndex < current.length) {
        setCharIndex(charIndex + 1);
        setDisplay(current.slice(0, charIndex + 1));
      } else if (!deleting && charIndex === current.length) {
        setTimeout(() => setDeleting(true), pause);
      } else if (deleting && charIndex > 0) {
        setCharIndex(charIndex - 1);
        setDisplay(current.slice(0, charIndex - 1));
      } else if (deleting && charIndex === 0) {
        setDeleting(false);
        setWordIndex((wordIndex + 1) % words.length);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return display;
}

function useCountUp(end: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(end);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return { count, ref };
}

const PARTICLES = [
  { top: "15%", left: "8%", size: 60, opacity: 0.08, delay: 0 },
  { top: "70%", left: "5%", size: 90, opacity: 0.06, delay: 0.4 },
  { top: "30%", right: "6%", size: 70, opacity: 0.07, delay: 0.8 },
  { top: "65%", right: "10%", size: 50, opacity: 0.09, delay: 0.2 },
  { top: "50%", left: "45%", size: 120, opacity: 0.04, delay: 1 },
];

export function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: news, isLoading: newsLoading } = useListNews();
  const recentNews = news?.slice(0, 3) || [];
  const word = useTypewriter(TYPEWRITER_WORDS);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/65 mix-blend-multiply z-10" />
          <img
            src="/images/hero.png"
            alt="School Campus"
            className="h-full w-full object-cover object-center scale-105"
            style={{ animation: "heroZoom 20s ease-in-out infinite alternate" }}
          />
        </div>

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-secondary border border-secondary/30"
            style={{
              top: p.top,
              left: "left" in p ? p.left : undefined,
              right: "right" in p ? (p as { right: string }).right : undefined,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{ y: [0, -18, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="container relative z-20 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mx-auto max-w-4xl space-y-7"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-5 py-2 text-sm font-semibold text-secondary backdrop-blur-md shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>Tradition of Excellence Since 2009</span>
            </motion.div>

            <h1 className="font-serif text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl drop-shadow-lg">
              Knowledge, Discipline,{" "}
              <span className="text-secondary relative">
                {word}
                <span className="animate-blink border-r-2 border-secondary ml-0.5" />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mx-auto max-w-2xl text-lg text-primary-foreground/90 md:text-xl leading-relaxed"
            >
              Welcome to M. B. Convent H. S. School, where we nurture young minds to become tomorrow's leaders through a blend of traditional values and modern education.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4"
            >
              <Link href="/admissions">
                <Button size="lg" variant="secondary" className="h-13 w-full px-10 text-base font-bold sm:w-auto shadow-xl hover:shadow-secondary/40 transition-all hover:-translate-y-0.5">
                  Admissions Open
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="h-13 w-full border-white/70 text-white hover:bg-white hover:text-primary px-10 text-base font-semibold sm:w-auto bg-white/5 backdrop-blur-sm transition-all hover:-translate-y-0.5">
                  Discover Our School
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 w-full z-20 leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px] fill-background">
            <path d="M0,40 C360,0 1080,70 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background py-16 -mt-2">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {statsLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)
            ) : stats ? (
              <>
                <AnimatedStatCard icon={<Users className="h-8 w-8" />} end={stats.totalStudents} suffix="+" label="Students Passed Out" gradient="from-blue-500/10 to-blue-600/5" />
                <AnimatedStatCard icon={<GraduationCap className="h-8 w-8" />} end={stats.totalFaculty} label="Expert Faculty" gradient="from-emerald-500/10 to-emerald-600/5" />
                <AnimatedStatCard icon={<Award className="h-8 w-8" />} end={stats.yearsOfExcellence} suffix="+" label="Years of Excellence" gradient="from-purple-500/10 to-purple-600/5" />
                <AnimatedStatCard icon={<BookOpen className="h-8 w-8" />} end={stats.passRate} suffix="%" label="Pass Rate" gradient="from-orange-500/10 to-orange-600/5" />
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
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h2 className="font-serif text-4xl font-bold text-primary">A Legacy of Learning</h2>
              <div className="h-1 w-20 bg-secondary rounded-full"></div>
              <p className="text-lg text-slate-600 leading-relaxed">
                At M. B. Convent H. S. School, we believe that education is not just about academic excellence, but about building character and fostering a lifelong love for learning.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our institution stands as a pillar of discipline and values, guiding students through their formative years with care, rigor, and dedication. We take pride in our highly qualified faculty and our comprehensive curriculum designed to prepare students for the challenges of tomorrow.
              </p>
              <Button asChild variant="link" className="px-0 text-primary font-semibold hover:text-primary/80">
                <Link href="/about">Read Principal's Message <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                <img src="/images/about.png" alt="Students in assembly" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-secondary/20 rounded-2xl z-0"></div>
            </motion.div>
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
              recentNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full">
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                        Read More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
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

function AnimatedStatCard({
  icon, end, suffix = "", label, gradient,
}: {
  icon: React.ReactNode;
  end: number;
  suffix?: string;
  label: string;
  gradient: string;
}) {
  const { count, ref } = useCountUp(end);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.4 }}
      className={`relative flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gradient-to-br ${gradient} rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-default`}
    >
      <div className="text-secondary p-3 bg-secondary/15 rounded-full">
        {icon}
      </div>
      <div className="text-3xl font-bold text-primary font-serif tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}
