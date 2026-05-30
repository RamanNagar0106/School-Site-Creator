import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee, Smartphone, Building2, CheckCircle2,
  CreditCard, AlertCircle, BookOpen, ClipboardList,
} from "lucide-react";

const FEE_STRUCTURE = [
  { class: "Class 8", annual: "₹12,000", quarterly: "₹3,200", monthly: "₹1,100" },
  { class: "Class 9", annual: "₹14,000", quarterly: "₹3,700", monthly: "₹1,250" },
  { class: "Class 10", annual: "₹16,000", quarterly: "₹4,200", monthly: "₹1,450" },
  { class: "Class 11 (Science)", annual: "₹18,000", quarterly: "₹4,700", monthly: "₹1,600" },
  { class: "Class 11 (Commerce/Arts)", annual: "₹15,000", quarterly: "₹4,000", monthly: "₹1,350" },
  { class: "Class 12 (Science)", annual: "₹18,000", quarterly: "₹4,700", monthly: "₹1,600" },
  { class: "Class 12 (Commerce/Arts)", annual: "₹15,000", quarterly: "₹4,000", monthly: "₹1,350" },
];

const FEE_TYPES = ["Annual Fee", "Quarterly Fee", "Monthly Fee", "Admission Fee", "Exam Fee", "Sports Fee", "Library Fee", "Other"];
const CLASSES = ["Class 8", "Class 9", "Class 10", "Class 11 (Science)", "Class 11 (Commerce)", "Class 11 (Arts)", "Class 12 (Science)", "Class 12 (Commerce)", "Class 12 (Arts)"];
const PAYMENT_METHODS = ["UPI", "Bank Transfer / NEFT / RTGS", "Cash (Office)"];

const EMPTY_FORM = {
  studentName: "", studentClass: "", parentName: "", email: "",
  phone: "", feeType: "", amount: "", transactionId: "",
  paymentMethod: "", paymentDate: new Date().toISOString().slice(0, 10),
};

export function FeePayment() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm(EMPTY_FORM);
      } else {
        const d = await res.json() as { error: string };
        setError(d.error || "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-primary py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 text-secondary text-sm font-medium mb-2">
              <IndianRupee className="h-4 w-4" /> Online Fee Payment Portal
            </div>
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Fee Payment</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Pay school fees securely via UPI or bank transfer and submit your payment confirmation below.
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8 space-y-16">

          {/* Fee Structure */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold text-primary mb-2">Fee Structure 2025–26</h2>
              <div className="h-1 w-16 bg-secondary rounded-full mx-auto" />
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-left px-6 py-4 font-semibold">Class</th>
                    <th className="text-center px-6 py-4 font-semibold">Annual</th>
                    <th className="text-center px-6 py-4 font-semibold">Quarterly</th>
                    <th className="text-center px-6 py-4 font-semibold">Monthly</th>
                  </tr>
                </thead>
                <tbody>
                  {FEE_STRUCTURE.map((row, i) => (
                    <tr key={i} className={`border-t border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-6 py-4 font-medium text-slate-800">{row.class}</td>
                      <td className="px-6 py-4 text-center font-semibold text-primary">{row.annual}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.quarterly}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">* Fees are subject to revision. Contact the school office for latest information.</p>
          </motion.div>

          {/* Payment Methods */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold text-primary mb-2">How to Pay</h2>
              <div className="h-1 w-16 bg-secondary rounded-full mx-auto" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* UPI */}
              <Card className="border-0 shadow-lg text-center overflow-hidden">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white">
                  <Smartphone className="h-10 w-10 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">UPI Payment</h3>
                </div>
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-slate-500">Scan & Pay instantly</p>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="w-24 h-24 mx-auto bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center mb-3">
                      <div className="grid grid-cols-3 gap-0.5">
                        {Array(9).fill(0).map((_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-sm ${[0,2,4,6,8].includes(i) ? "bg-primary" : "bg-slate-200"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="font-mono font-bold text-primary text-sm">mbconvent@sbi</p>
                    <p className="text-xs text-slate-400 mt-1">UPI ID</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Google Pay · PhonePe · Paytm</Badge>
                </CardContent>
              </Card>

              {/* Bank Transfer */}
              <Card className="border-0 shadow-lg text-center overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white">
                  <Building2 className="h-10 w-10 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Bank Transfer</h3>
                </div>
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-slate-500">NEFT / RTGS / IMPS</p>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2 text-sm">
                    <Row label="Bank" value="State Bank of India" />
                    <Row label="A/C Name" value="M.B. Convent H.S. School" />
                    <Row label="A/C No." value="XXXXXXXX4521" />
                    <Row label="IFSC" value="SBIN0004521" />
                    <Row label="Branch" value="Sarangpur" />
                  </div>
                </CardContent>
              </Card>

              {/* Cash */}
              <Card className="border-0 shadow-lg text-center overflow-hidden">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white">
                  <CreditCard className="h-10 w-10 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">School Office</h3>
                </div>
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-slate-500">Pay in person</p>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2 text-sm">
                    <Row label="Office Hours" value="Mon–Sat 8:00–1:30 PM" />
                    <Row label="Address" value="Maa Bizsan Square, Bhaiswa Mata, Sarangpur" />
                    <Row label="Accepts" value="Cash / DD / Cheque" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Confirmation Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold text-primary mb-2">Submit Payment Confirmation</h2>
              <div className="h-1 w-16 bg-secondary rounded-full mx-auto mb-3" />
              <p className="text-slate-500 max-w-xl mx-auto text-sm">
                After making your payment, fill this form so the school can verify and update your records.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {submitted ? (
                <Card className="border-0 shadow-xl text-center p-12">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">Confirmation Received!</h3>
                  <p className="text-slate-500 mb-6">Thank you for submitting your payment details. The school office will verify and update your records within 1–2 working days.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">Submit Another</Button>
                </Card>
              ) : (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <ClipboardList className="h-5 w-5 text-secondary" /> Payment Confirmation Form
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm text-amber-800">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <p>Please complete your payment first (UPI / Bank Transfer / Cash), then fill this form with your transaction details.</p>
                      </div>

                      <fieldset className="space-y-4">
                        <legend className="text-sm font-semibold text-slate-500 uppercase tracking-wide pb-1 border-b w-full">Student Information</legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField label="Student Name *">
                            <Input value={form.studentName} onChange={set("studentName")} placeholder="Full name of student" required />
                          </FormField>
                          <FormField label="Class *">
                            <select value={form.studentClass} onChange={set("studentClass")} required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                              <option value="">Select class…</option>
                              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </FormField>
                          <FormField label="Parent / Guardian Name *">
                            <Input value={form.parentName} onChange={set("parentName")} placeholder="Parent name" required />
                          </FormField>
                          <FormField label="Phone Number *">
                            <Input value={form.phone} onChange={set("phone")} placeholder="10-digit mobile" type="tel" required />
                          </FormField>
                          <FormField label="Email Address *" className="sm:col-span-2">
                            <Input value={form.email} onChange={set("email")} placeholder="email@example.com" type="email" required />
                          </FormField>
                        </div>
                      </fieldset>

                      <fieldset className="space-y-4">
                        <legend className="text-sm font-semibold text-slate-500 uppercase tracking-wide pb-1 border-b w-full">Payment Details</legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField label="Fee Type *">
                            <select value={form.feeType} onChange={set("feeType")} required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                              <option value="">Select fee type…</option>
                              {FEE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </FormField>
                          <FormField label="Amount Paid (₹) *">
                            <Input value={form.amount} onChange={set("amount")} placeholder="e.g. 12000" type="number" min="1" required />
                          </FormField>
                          <FormField label="Payment Method *">
                            <select value={form.paymentMethod} onChange={set("paymentMethod")} required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                              <option value="">Select method…</option>
                              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </FormField>
                          <FormField label="Date of Payment *">
                            <Input value={form.paymentDate} onChange={set("paymentDate")} type="date" required />
                          </FormField>
                          <FormField label="Transaction ID / Reference No. *" className="sm:col-span-2">
                            <Input value={form.transactionId} onChange={set("transactionId")} placeholder="UPI ref no. / bank transaction ID / receipt no." required />
                          </FormField>
                        </div>
                      </fieldset>

                      {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                        </div>
                      )}

                      <Button type="submit" className="w-full h-12 text-base font-semibold gap-2" disabled={submitting}>
                        {submitting ? (
                          <span className="flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> Submitting…</span>
                        ) : (
                          <span className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Submit Payment Confirmation</span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>

        </div>
      </section>
    </Layout>
  );
}

function FormField({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="font-medium text-slate-700 text-right">{value}</span>
    </div>
  );
}
