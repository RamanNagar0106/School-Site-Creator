const announcements = [
  "🎓 Admissions Open for Classes 8–11 — Apply before June 30, 2026",
  "🏆 Board Exam Results: 98% Pass Rate — Congratulations to all students!",
  "📅 Annual Sports Day — June 15, 2026 | All parents are invited",
  "✏️ New academic session begins July 1, 2026",
  "📚 Library upgraded with 500+ new books for the 2026–27 session",
  "🌟 M. B. Convent H. S. School — Knowledge, Discipline, Character",
];

export function AnnouncementTicker() {
  const items = [...announcements, ...announcements];

  return (
    <div className="bg-secondary text-primary overflow-hidden border-b border-yellow-500/30 relative">
      <div className="flex items-center">
        <div className="shrink-0 bg-primary text-secondary text-xs font-bold px-4 py-2 uppercase tracking-widest z-10 shadow-md">
          Notice
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex animate-ticker whitespace-nowrap py-2 gap-16">
            {items.map((item, i) => (
              <span key={i} className="shrink-0 text-xs font-semibold tracking-wide">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
