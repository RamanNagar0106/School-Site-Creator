import { Layout } from "@/components/layout/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitAdmission } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, CalendarCheck, CheckSquare, HelpCircle } from "lucide-react";

const formSchema = z.object({
  studentName: z.string().min(2, "Student name must be at least 2 characters"),
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  gradeApplying: z.string().min(1, "Please select a grade"),
  message: z.string().optional(),
});

export function Admissions() {
  const { toast } = useToast();
  const submitMutation = useSubmitAdmission();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      parentName: "",
      email: "",
      phone: "",
      gradeApplying: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitMutation.mutate({ data: values }, {
      onSuccess: () => {
        toast({
          title: "Enquiry Submitted",
          description: "We have received your admission enquiry. Our team will contact you soon.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your enquiry. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Layout>
      <div className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl mb-4">Admissions</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">Join our legacy of excellence. Learn about our admission process and requirements.</p>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            
            {/* Admission Info */}
            <div className="space-y-12">
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary mb-6">Admission Process</h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-secondary text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-primary mb-1">1. Registration</h3>
                      <p className="text-sm text-slate-600">Submit the online enquiry form or visit the school office to register.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-primary mb-1">2. Interaction/Test</h3>
                      <p className="text-sm text-slate-600">Registered candidates will be called for a written test and an interaction session.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-primary mb-1">3. Document Verification</h3>
                      <p className="text-sm text-slate-600">Submission of necessary documents including birth certificate and past academic records.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-primary mb-1">4. Fee Payment</h3>
                      <p className="text-sm text-slate-600">Finalization of admission upon payment of the requisite fees.</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-serif text-xl font-bold text-primary mb-4">Important Dates</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-medium">Registration Opens</span>
                    <span>October 15</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="font-medium">Entrance Test</span>
                    <span>November 20</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span className="font-medium">Session Begins</span>
                    <span>April 1</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Admission Form */}
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <h2 className="font-serif text-2xl font-bold text-primary mb-2">Admission Enquiry</h2>
                <p className="text-slate-500 mb-8 text-sm">Fill out the form below to initiate the admission process for the upcoming academic year.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold">Student's Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter student's full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="parentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold">Parent's/Guardian's Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter parent's name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-semibold">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="10-digit mobile number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="gradeApplying"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Applying for Grade/Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nursery">Nursery / KG</SelectItem>
                              <SelectItem value="primary">Primary (I - V)</SelectItem>
                              <SelectItem value="middle">Middle (VI - VIII)</SelectItem>
                              <SelectItem value="secondary">Secondary (IX - X)</SelectItem>
                              <SelectItem value="senior">Senior Secondary (XI - XII)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-semibold">Additional Information / Questions</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Any specific queries you have..." className="min-h-[100px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full text-base" disabled={submitMutation.isPending}>
                      {submitMutation.isPending ? "Submitting..." : "Submit Enquiry"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
