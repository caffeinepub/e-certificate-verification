import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function HomePage() {
  const [certNumber, setCertNumber] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    const trimmed = certNumber.trim();
    if (!trimmed) return;
    navigate({
      to: "/certificate/$id",
      params: { id: encodeURIComponent(trimmed) },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero band */}
      <div className="bg-navy py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white text-2xl font-bold uppercase tracking-widest mb-2">
            Verify Certificate
          </h2>
          <p className="text-white/70 text-sm mb-6">
            Enter your certificate number to verify its authenticity
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <Input
              placeholder="Enter Certificate Number (e.g. NCVT/2024/001)"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-white border-0 text-foreground placeholder:text-muted-foreground h-11"
              data-ocid="verify.input"
            />
            <Button
              onClick={handleVerify}
              className="bg-yellow-500 hover:bg-yellow-400 text-navy font-bold h-11 px-6 whitespace-nowrap uppercase tracking-wide text-sm"
              data-ocid="verify.primary_button"
            >
              <Search className="w-4 h-4 mr-2" />
              Verify Certificate
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg shadow-card p-5 border border-border">
            <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-navy" />
            </div>
            <h3 className="font-bold text-navy text-sm uppercase tracking-wide mb-1">
              Quick Verification
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Instantly verify the authenticity of any NCVT certificate by
              entering the certificate number.
            </p>
          </div>
          <div className="bg-card rounded-lg shadow-card p-5 border border-border">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-3">
              <span className="text-lg">✓</span>
            </div>
            <h3 className="font-bold text-navy text-sm uppercase tracking-wide mb-1">
              QR Code Scan
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Each certificate has a unique QR code. Scan it with your phone to
              instantly view trainee details.
            </p>
          </div>
          <div className="bg-card rounded-lg shadow-card p-5 border border-border">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <span className="text-lg">🏛️</span>
            </div>
            <h3 className="font-bold text-navy text-sm uppercase tracking-wide mb-1">
              Official Records
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              All records are maintained by the Ministry of Skill Development
              &amp; Entrepreneurship.
            </p>
          </div>
        </div>

        {/* Sample certificate hint */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <span className="font-semibold text-navy">Demo:</span>{" "}
          <span className="text-muted-foreground">Try certificate number </span>
          <button
            type="button"
            className="font-mono font-bold text-navy underline cursor-pointer"
            onClick={() => {
              setCertNumber("NCVT/2024/001");
            }}
          >
            NCVT/2024/001
          </button>
          <span className="text-muted-foreground">
            {" "}
            to see a sample trainee profile.
          </span>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
