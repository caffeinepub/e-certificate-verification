import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export default function SiteHeader() {
  return (
    <header>
      {/* Brand strip */}
      <div className="bg-white border-b border-border py-2 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Government of India
            </p>
            <h1 className="text-sm font-bold text-navy uppercase tracking-wide leading-tight">
              Ministry of Skill Development &amp; Entrepreneurship
            </h1>
          </div>
        </div>
      </div>
      {/* Nav bar */}
      <nav className="bg-navy px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-10">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-white text-sm font-medium hover:text-yellow-300 transition-colors"
              data-ocid="nav.link"
            >
              Home
            </Link>
            <Link
              to="/admin"
              className="text-white text-sm font-medium hover:text-yellow-300 transition-colors"
              data-ocid="admin.link"
            >
              Admin
            </Link>
          </div>
          <span className="text-white/60 text-xs">NCVTMIS Portal</span>
        </div>
      </nav>
    </header>
  );
}
