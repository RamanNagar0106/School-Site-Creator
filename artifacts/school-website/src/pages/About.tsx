import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function About() {
  return (
    <Layout>
      <div className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl mb-4">About Us</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">Discover the history, vision, and values that make M. B. Convent H. S. School a beacon of educational excellence.</p>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center mb-24">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                <img src="/images/hero.png" alt="School building" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-6 -left-6 w-full h-full bg-primary/10 rounded-2xl z-0 border border-primary/20"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-serif text-3xl font-bold text-primary">Our History</h2>
              <div className="h-1 w-16 bg-secondary rounded-full"></div>
              <p className="text-slate-600 leading-relaxed text-lg">
                Founded in 2009, M. B. Convent H. S. School was established with a clear vision: to provide accessible, high-quality education rooted in strong moral values. 
              </p>
              <p className="text-slate-600 leading-relaxed">
                What began as a small institution with just 50 students has now grown into a premier educational establishment. Over the decades, we have continuously adapted to modern educational methodologies while remaining steadfast in our commitment to discipline and character building.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our alumni have gone on to excel in various fields across the globe, carrying with them the principles and knowledge instilled within these walls.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-24">
            <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                <div className="p-2 bg-primary text-white rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
                Our Vision
              </h3>
              <p className="text-slate-600 leading-relaxed">
                To be a center of excellence that nurtures intellectual curiosity, fosters character development, and empowers students to become responsible, compassionate, and capable leaders in a rapidly changing world.
              </p>
            </div>
            <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                <div className="p-2 bg-secondary text-primary rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
                Our Mission
              </h3>
              <p className="text-slate-600 leading-relaxed">
                To provide a holistic educational environment that balances academic rigor with personal growth. We strive to cultivate critical thinking, creativity, and a lifelong passion for learning in every student who passes through our gates.
              </p>
            </div>
          </div>

          <div className="bg-primary text-white rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <svg width="404" height="384" fill="none" viewBox="0 0 404 384"><defs><pattern id="d3eb07ae-5182-43e6-857d-35c643af9034" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="currentColor"></rect></pattern></defs><rect width="404" height="384" fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"></rect></svg>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
              <h2 className="font-serif text-3xl font-bold text-secondary">Principal's Message</h2>
              <div className="text-xl md:text-2xl leading-relaxed font-serif italic text-primary-foreground/90">
                "Education is the foundation upon which we build our future. At M.B. Convent, we don't just teach subjects; we shape character. We demand discipline because we care about the adults our students will become. Our doors are open to those who are ready to learn, to work hard, and to strive for excellence."
              </div>
              <div className="pt-4 border-t border-white/20 inline-block">
                <div className="font-bold text-lg tracking-wide uppercase">Dr. A. K. Sharma</div>
                <div className="text-secondary text-sm">Principal, M. B. Convent H. S. School</div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}
