import { Layout } from "@/components/layout/Layout";
import { useListFaculty } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Award, Clock, UserCircle } from "lucide-react";

export function Faculty() {
  const { data: faculty, isLoading } = useListFaculty();

  return (
    <Layout>
      <div className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl mb-4">Our Faculty</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">Meet our dedicated team of educators who inspire and guide our students every day.</p>
        </div>
      </div>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-2 pt-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : faculty && faculty.length > 0 ? (
              faculty.map((member) => (
                <Card key={member.id} className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group bg-white">
                  <div className="aspect-[4/5] relative bg-slate-200 overflow-hidden">
                    {member.imageUrl ? (
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <UserCircle className="h-24 w-24" />
                      </div>
                    )}
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-primary/90 to-transparent p-4 pt-12 text-white">
                      <h3 className="font-serif text-xl font-bold">{member.name}</h3>
                      <p className="text-secondary font-medium text-sm">{member.designation || "Faculty"}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3 text-slate-600">
                        <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-semibold text-slate-900 text-xs uppercase tracking-wider mb-0.5">Subject</span>
                          <span>{member.subject}</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 text-slate-600">
                        <Award className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-semibold text-slate-900 text-xs uppercase tracking-wider mb-0.5">Qualification</span>
                          <span>{member.qualification}</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 text-slate-600">
                        <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-semibold text-slate-900 text-xs uppercase tracking-wider mb-0.5">Experience</span>
                          <span>{member.experience}</span>
                        </div>
                      </li>
                    </ul>
                    {member.bio && (
                      <p className="mt-5 text-sm text-slate-500 pt-5 border-t border-slate-100 line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-500">
                No faculty members listed.
              </div>
            )}
          </div>

        </div>
      </section>
    </Layout>
  );
}
