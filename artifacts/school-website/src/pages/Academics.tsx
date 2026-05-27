import { Layout } from "@/components/layout/Layout";
import { Book, Award, Clock, GraduationCap, Laptop, FlaskConical } from "lucide-react";

export function Academics() {
  const subjects = [
    { grade: "Primary (Classes I - V)", sub: ["English", "Hindi", "Mathematics", "Environmental Studies", "Computer Science", "Arts & Crafts"] },
    { grade: "Middle (Classes VI - VIII)", sub: ["English", "Hindi", "Sanskrit", "Mathematics", "Science", "Social Science", "Computer Science"] },
    { grade: "Secondary (Classes IX - X)", sub: ["English Communicative", "Hindi Course A", "Mathematics", "Science", "Social Science", "Information Technology"] },
    { grade: "Senior Secondary (Classes XI - XII)", sub: ["Science Stream (PCM/PCB)", "Commerce Stream", "Humanities Stream", "Physical Education", "Computer Science"] },
  ];

  return (
    <Layout>
      <div className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl mb-4">Academics</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">A rigorous curriculum designed to challenge, inspire, and prepare students for higher education and beyond.</p>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-primary mb-6">Our Educational Approach</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We follow a comprehensive curriculum that adheres to national educational standards while incorporating modern teaching methodologies. Our focus is on experiential learning, ensuring students understand concepts rather than just memorizing them.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-20">
            <FeatureCard 
              icon={<FlaskConical className="h-8 w-8" />} 
              title="Practical Learning" 
              desc="Well-equipped science and computer laboratories that provide hands-on experience to complement theoretical knowledge." 
            />
            <FeatureCard 
              icon={<Laptop className="h-8 w-8" />} 
              title="Smart Classrooms" 
              desc="Interactive digital boards in classrooms to make learning engaging, visual, and highly effective." 
            />
            <FeatureCard 
              icon={<Award className="h-8 w-8" />} 
              title="Continuous Assessment" 
              desc="Regular evaluations to track progress and provide timely feedback, ensuring no student is left behind." 
            />
          </div>

          <div className="space-y-12">
            <h2 className="font-serif text-3xl font-bold text-primary text-center">Curriculum Structure</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {subjects.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <h3 className="font-bold text-lg text-primary">{item.grade}</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2">
                      {item.sub.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <Book className="h-4 w-4 mt-1 text-secondary shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center space-y-4">
      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/5 text-primary rounded-full mb-6">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-primary">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}
