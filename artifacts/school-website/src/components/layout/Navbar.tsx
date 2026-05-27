import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, BookOpen, GraduationCap, Users, Calendar, Image as ImageIcon, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Academics", path: "/academics" },
    { label: "Admissions", path: "/admissions" },
    { label: "News & Events", path: "/news" },
    { label: "Gallery", path: "/gallery" },
    { label: "Faculty", path: "/faculty" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">M. B. Convent H. S.</span>
              <span className="text-xs font-medium uppercase tracking-wider text-secondary">High School</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 ${
                    isActive ? "bg-white/10 text-secondary" : "text-primary-foreground/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/admissions" className="ml-4">
              <Button variant="secondary" className="font-semibold text-primary">Apply Now</Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-primary-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-primary border-b border-white/10 shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive ? "bg-white/10 text-secondary" : "text-primary-foreground/90"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/admissions" onClick={() => setIsMobileMenuOpen(false)} className="mt-4">
              <Button variant="secondary" className="w-full font-semibold text-primary py-6">Apply Now</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
