import { Link } from "wouter";
import { BookOpen, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-white">M.B. Convent</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-secondary">High School</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400">
              A place of tradition, discipline, and genuine care for students' futures. Building leaders since 2009.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link href="/academics" className="hover:text-secondary transition-colors">Academics</Link></li>
              <li><Link href="/admissions" className="hover:text-secondary transition-colors">Admissions</Link></li>
              <li><Link href="/faculty" className="hover:text-secondary transition-colors">Faculty & Staff</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news" className="hover:text-secondary transition-colors">News & Events</Link></li>
              <li><Link href="/gallery" className="hover:text-secondary transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-secondary transition-colors">Student Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-white">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-secondary" />
                <span>123 Education Lane, Knowledge Park, City, State 123456</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 shrink-0 text-secondary" />
                <span>info@mbconvent.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} M.B. Convent High School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
