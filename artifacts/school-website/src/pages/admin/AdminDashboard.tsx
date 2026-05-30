import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, LogOut, Newspaper, GraduationCap, Image as ImageIcon,
  MessageSquare, Plus, Pencil, Trash2, X, Check, ChevronDown,
  Users, Calendar, Mail, Phone, IndianRupee, CheckCircle2, XCircle, Clock,
} from "lucide-react";

type Tab = "news" | "faculty" | "gallery" | "enquiries" | "payments";

const apiFetch = (path: string, options?: RequestInit) =>
  fetch(`/api${path}`, { credentials: "include", ...options });

// ── Generic helpers ───────────────────────────────────────────────────────────

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-serif text-2xl font-bold text-primary">{title}</h2>
      <Button onClick={onAdd} size="sm" className="gap-2">
        <Plus className="h-4 w-4" /> Add New
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</Label>
      {children}
    </div>
  );
}

// ── News Tab ─────────────────────────────────────────────────────────────────

type NewsItem = {
  id: number; title: string; summary: string; content?: string | null;
  date: string; category: string; imageUrl?: string | null;
};

const EMPTY_NEWS: Omit<NewsItem, "id"> = { title: "", summary: "", content: "", date: new Date().toISOString().slice(0, 10), category: "Announcement", imageUrl: "" };

function NewsTab() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState<Omit<NewsItem, "id">>(EMPTY_NEWS);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await apiFetch("/admin/news");
    setItems(await r.json() as NewsItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const openAdd = () => { setEditing({ id: -1, ...EMPTY_NEWS }); setForm(EMPTY_NEWS); };
  const openEdit = (item: NewsItem) => { setEditing(item); setForm({ title: item.title, summary: item.summary, content: item.content ?? "", date: item.date, category: item.category, imageUrl: item.imageUrl ?? "" }); };
  const cancel = () => setEditing(null);

  const save = async () => {
    setSaving(true);
    const isNew = editing!.id === -1;
    await apiFetch(isNew ? "/admin/news" : `/admin/news/${editing!.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEditing(null);
    void load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this news item?")) return;
    await apiFetch(`/admin/news/${id}`, { method: "DELETE" });
    void load();
  };

  return (
    <div>
      <SectionHeader title="News & Events" onAdd={openAdd} />

      {editing && (
        <div className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">{editing.id === -1 ? "Add News" : "Edit News"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Article title" />
            </Field>
            <Field label="Category">
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Announcement, Event…" />
            </Field>
            <Field label="Date">
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </Field>
            <Field label="Image URL (optional)">
              <Input value={form.imageUrl ?? ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://…" />
            </Field>
          </div>
          <Field label="Summary">
            <Textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2} placeholder="Short summary…" />
          </Field>
          <Field label="Full Content (optional)">
            <Textarea value={form.content ?? ""} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} placeholder="Full article content…" />
          </Field>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => void save()} disabled={saving} className="gap-2">
              <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="outline" onClick={cancel}><X className="h-4 w-4 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <Empty label="No news yet. Add your first article." />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">{item.title}</div>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="h-3 w-3" />{item.date}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(item)} className="gap-1 h-8"><Pencil className="h-3 w-3" /> Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => void remove(item.id)} className="h-8"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Faculty Tab ───────────────────────────────────────────────────────────────

type FacultyMember = {
  id: number; name: string; subject: string; qualification: string;
  experience: string; bio?: string | null; imageUrl?: string | null; designation?: string | null;
};

const EMPTY_FACULTY: Omit<FacultyMember, "id"> = { name: "", subject: "", qualification: "", experience: "", bio: "", imageUrl: "", designation: "Teacher" };

function FacultyTab() {
  const [items, setItems] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FacultyMember | null>(null);
  const [form, setForm] = useState<Omit<FacultyMember, "id">>(EMPTY_FACULTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await apiFetch("/admin/faculty");
    setItems(await r.json() as FacultyMember[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const openAdd = () => { setEditing({ id: -1, ...EMPTY_FACULTY }); setForm(EMPTY_FACULTY); };
  const openEdit = (m: FacultyMember) => { setEditing(m); setForm({ name: m.name, subject: m.subject, qualification: m.qualification, experience: m.experience, bio: m.bio ?? "", imageUrl: m.imageUrl ?? "", designation: m.designation ?? "Teacher" }); };
  const cancel = () => setEditing(null);

  const save = async () => {
    setSaving(true);
    const isNew = editing!.id === -1;
    await apiFetch(isNew ? "/admin/faculty" : `/admin/faculty/${editing!.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEditing(null);
    void load();
  };

  const remove = async (id: number) => {
    if (!confirm("Remove this faculty member?")) return;
    await apiFetch(`/admin/faculty/${id}`, { method: "DELETE" });
    void load();
  };

  return (
    <div>
      <SectionHeader title="Faculty Members" onAdd={openAdd} />

      {editing && (
        <div className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">{editing.id === -1 ? "Add Faculty Member" : "Edit Faculty Member"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name"><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" /></Field>
            <Field label="Designation"><Input value={form.designation ?? ""} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} placeholder="Teacher, HOD…" /></Field>
            <Field label="Subject"><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Mathematics…" /></Field>
            <Field label="Qualification"><Input value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} placeholder="M.Sc., B.Ed." /></Field>
            <Field label="Experience"><Input value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="10 years" /></Field>
            <Field label="Photo URL (optional)"><Input value={form.imageUrl ?? ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://…" /></Field>
          </div>
          <Field label="Bio (optional)">
            <Textarea value={form.bio ?? ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={2} placeholder="Short bio…" />
          </Field>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => void save()} disabled={saving} className="gap-2"><Check className="h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>
            <Button variant="outline" onClick={cancel}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <Empty label="No faculty members yet." />
      ) : (
        <div className="space-y-3">
          {items.map(m => (
            <div key={m.id} className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800">{m.name}</div>
                <div className="text-sm text-slate-500">{m.designation ?? "Teacher"} · {m.subject} · {m.experience}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openEdit(m)} className="gap-1 h-8"><Pencil className="h-3 w-3" /> Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => void remove(m.id)} className="h-8"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Gallery Tab ───────────────────────────────────────────────────────────────

type GalleryItem = { id: number; title: string; imageUrl: string; category: string; description?: string | null };
const EMPTY_GALLERY: Omit<GalleryItem, "id"> = { title: "", imageUrl: "", category: "School", description: "" };

function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<GalleryItem, "id">>(EMPTY_GALLERY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await apiFetch("/admin/gallery");
    setItems(await r.json() as GalleryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    setSaving(true);
    await apiFetch("/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setAdding(false);
    setForm(EMPTY_GALLERY);
    void load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this gallery item?")) return;
    await apiFetch(`/admin/gallery/${id}`, { method: "DELETE" });
    void load();
  };

  return (
    <div>
      <SectionHeader title="Gallery" onAdd={() => setAdding(true)} />

      {adding && (
        <div className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Add Gallery Photo</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title"><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Sports Day…" /></Field>
            <Field label="Category"><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Events, Sports…" /></Field>
            <Field label="Image URL" ><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://…" className="sm:col-span-2" /></Field>
          </div>
          <Field label="Description (optional)">
            <Textarea value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          </Field>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => void save()} disabled={saving} className="gap-2"><Check className="h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>
            <Button variant="outline" onClick={() => setAdding(false)}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array(8).fill(0).map((_, i) => <div key={i} className="aspect-video bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <Empty label="No gallery photos yet." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-white text-xs font-medium text-center leading-tight">{item.title}</p>
                <Badge className="text-xs">{item.category}</Badge>
                <Button size="sm" variant="destructive" onClick={() => void remove(item.id)} className="h-7 text-xs gap-1 mt-1"><Trash2 className="h-3 w-3" />Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Enquiries Tab ─────────────────────────────────────────────────────────────

type Contact = { id: number; name: string; email: string; phone?: string | null; subject: string; message: string; createdAt: string };
type Admission = { id: number; studentName: string; parentName: string; email: string; phone: string; gradeApplying: string; message?: string | null; createdAt: string };

function EnquiriesTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<"contacts" | "admissions">("admissions");

  useEffect(() => {
    const load = async () => {
      const [c, a] = await Promise.all([
        apiFetch("/admin/contacts").then(r => r.json()) as Promise<Contact[]>,
        apiFetch("/admin/admissions").then(r => r.json()) as Promise<Admission[]>,
      ]);
      setContacts(c);
      setAdmissions(a);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-primary">Enquiries</h2>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button onClick={() => setSub("admissions")} className={`px-4 py-2 text-sm font-medium transition-colors ${sub === "admissions" ? "bg-primary text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
            Admissions ({admissions.length})
          </button>
          <button onClick={() => setSub("contacts")} className={`px-4 py-2 text-sm font-medium transition-colors ${sub === "contacts" ? "bg-primary text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
            Contact ({contacts.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : sub === "admissions" ? (
        admissions.length === 0 ? <Empty label="No admission enquiries yet." /> : (
          <div className="space-y-3">
            {[...admissions].reverse().map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-slate-800">{a.studentName}</span>
                      <Badge variant="outline" className="text-xs">Class {a.gradeApplying}</Badge>
                      <span className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">Parent: {a.parentName}</div>
                    <div className="flex gap-4 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{a.email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{a.phone}</span>
                    </div>
                    {a.message && <p className="text-sm text-slate-500 mt-2 border-t pt-2">{a.message}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        contacts.length === 0 ? <Empty label="No contact messages yet." /> : (
          <div className="space-y-3">
            {[...contacts].reverse().map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-slate-800">{c.name}</span>
                      <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                    <div className="font-medium text-sm text-primary mt-0.5">{c.subject}</div>
                    <div className="flex gap-4 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span>
                      {c.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-2 border-t pt-2">{c.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function Empty({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-slate-400">
      <ChevronDown className="h-10 w-10 mx-auto mb-3 opacity-30" />
      <p>{label}</p>
    </div>
  );
}

// ── Payments Tab ──────────────────────────────────────────────────────────────

type PaymentItem = {
  id: number; studentName: string; studentClass: string; parentName: string;
  email: string; phone: string; feeType: string; amount: string;
  transactionId: string; paymentMethod: string; paymentDate: string;
  status: string; remarks: string | null; createdAt: string;
};

function PaymentsTab() {
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await apiFetch("/admin/payments");
    setItems((await r.json() as PaymentItem[]).reverse());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    await apiFetch(`/admin/payments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  };

  const statusBadge = (status: string) => {
    if (status === "verified") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-3 w-3" />Verified</span>;
    if (status === "rejected") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle className="h-3 w-3" />Rejected</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="h-3 w-3" />Pending</span>;
  };

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full" /></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-primary">Payment Confirmations</h2>
        <Badge variant="outline" className="text-sm">{items.length} total</Badge>
      </div>
      {items.length === 0 ? <Empty label="No payment confirmations yet." /> : (
        <div className="space-y-3">
          {items.map(p => (
            <div key={p.id} className={`rounded-xl border shadow-sm p-4 ${p.status === "verified" ? "border-emerald-100 bg-emerald-50/30" : p.status === "rejected" ? "border-red-100 bg-red-50/20" : "border-slate-100 bg-white"}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-semibold text-slate-800">{p.studentName}</span>
                    <Badge variant="outline" className="text-xs">{p.studentClass}</Badge>
                    {statusBadge(p.status)}
                    <span className="text-xs text-slate-400 ml-auto">{new Date(p.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-slate-600 mb-3">
                    <span>Parent: <strong>{p.parentName}</strong></span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{p.email}</span>
                    <span>Fee: <strong>{p.feeType}</strong></span>
                    <span>Amount: <strong>₹{p.amount}</strong></span>
                    <span>Method: <strong>{p.paymentMethod}</strong></span>
                    <span>Txn ID: <strong className="font-mono text-xs">{p.transactionId}</strong></span>
                    <span>Date: <strong>{p.paymentDate}</strong></span>
                  </div>
                  {p.status === "pending" && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                        disabled={updating === p.id}
                        onClick={() => void updateStatus(p.id, "verified")}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verify
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 h-8"
                        disabled={updating === p.id}
                        onClick={() => void updateStatus(p.id, "rejected")}>
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "news", label: "News & Events", icon: <Newspaper className="h-4 w-4" /> },
  { id: "faculty", label: "Faculty", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "gallery", label: "Gallery", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "enquiries", label: "Enquiries", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "payments", label: "Payments", icon: <IndianRupee className="h-4 w-4" /> },
];

export function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("news");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiFetch("/admin/me")
      .then(r => r.json())
      .then((d: { loggedIn: boolean }) => {
        if (!d.loggedIn) setLocation("/admin");
        else setChecking(false);
      })
      .catch(() => setLocation("/admin"));
  }, [setLocation]);

  const logout = async () => {
    await apiFetch("/admin/logout", { method: "POST" });
    setLocation("/admin");
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-serif font-bold text-base leading-tight">Admin Panel</div>
              <div className="text-xs text-primary-foreground/60 leading-tight">M. B. Convent H. S. School</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs text-primary-foreground/70 hover:text-white transition-colors hidden sm:block">
              View Website ↗
            </a>
            <Button size="sm" variant="outline" onClick={() => void logout()} className="gap-2 border-white/30 text-white hover:bg-white/10 bg-transparent">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 shadow-sm p-1 mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center
                ${tab === t.id ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-slate-50 rounded-2xl p-1">
          {tab === "news" && <NewsTab />}
          {tab === "faculty" && <FacultyTab />}
          {tab === "gallery" && <GalleryTab />}
          {tab === "enquiries" && <EnquiriesTab />}
          {tab === "payments" && <PaymentsTab />}
        </div>
      </div>
    </div>
  );
}
