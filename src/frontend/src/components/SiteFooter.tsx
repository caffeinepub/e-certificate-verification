export default function SiteFooter() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);
  return (
    <footer className="bg-[#2c3e50] text-white mt-10">
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="font-bold mb-2 uppercase tracking-wider text-xs text-white/70">
            About
          </h3>
          <p className="text-white/60 text-xs leading-relaxed">
            National Council for Vocational Training (NCVT) certificate
            verification portal. Verify the authenticity of certificates issued
            under the skill development programs.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2 uppercase tracking-wider text-xs text-white/70">
            Quick Links
          </h3>
          <ul className="space-y-1 text-xs text-white/60">
            <li>Certificate Verification</li>
            <li>Trainee Registration</li>
            <li>Institute Portal</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2 uppercase tracking-wider text-xs text-white/70">
            Contact
          </h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Ministry of Skill Development &amp; Entrepreneurship
            <br />
            Shram Shakti Bhawan, New Delhi - 110001
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-xs text-white/40">
        &copy; {year}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          caffeine.ai
        </a>
      </div>
    </footer>
  );
}
