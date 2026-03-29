import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";
import type { Certificate } from "../backend";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useActor } from "../hooks/useActor";
import { useQrCode } from "../hooks/useQrCode";

const SAMPLE_CERT: Certificate = {
  traineeName: "Rajesh Kumar Sharma",
  fatherName: "Ramesh Lal Sharma",
  instituteName: "Government Industrial Training Institute",
  instituteAddress: "Sector 12, Dwarka, New Delhi - 110078",
  trade: "Electrician",
  trainingStartDate: "01/04/2023",
  trainingEndDate: "31/03/2024",
  certified: true,
  certificateIssueDate: "15/06/2024",
  certificateNumber: "NCVT/2024/001",
};

export default function CertificatePage() {
  const { id } = useParams({ from: "/certificate/$id" });
  const certNumber = decodeURIComponent(id);
  const { qrCodeDataUrl, generateQrCode } = useQrCode();
  const { actor, isFetching: actorFetching } = useActor();

  const {
    data: certificate,
    isLoading,
    isError,
  } = useQuery<Certificate | null>({
    queryKey: ["certificate-by-number", certNumber],
    queryFn: async () => {
      if (!actor) return null;
      // Try to list and find by certificate number
      const list = await actor.listCertificates();
      const found = list.find((c) => c.certificateNumber === certNumber);
      if (found) return found;
      // Fallback: show sample if matches demo number
      if (certNumber === "NCVT/2024/001") return SAMPLE_CERT;
      return null;
    },
    enabled: !!actor && !actorFetching,
  });

  useEffect(() => {
    generateQrCode(window.location.href);
  }, [generateQrCode]);

  const cert = certificate;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero band */}
      <div className="bg-navy py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white text-xl font-bold uppercase tracking-widest">
            Certificate Verification
          </h2>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-4 py-2">
        <div className="max-w-5xl mx-auto text-xs text-muted-foreground flex items-center gap-1">
          <Link
            to="/"
            className="hover:text-navy transition-colors"
            data-ocid="breadcrumb.link"
          >
            Home
          </Link>
          <span>&gt;</span>
          <span>Verification</span>
          <span>&gt;</span>
          <span className="text-navy font-medium">Trainee Details</span>
        </div>
      </div>

      <main
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-6"
        data-ocid="certificate.section"
      >
        {isLoading || actorFetching ? (
          <div className="space-y-4" data-ocid="certificate.loading_state">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : isError ? (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3"
            data-ocid="certificate.error_state"
          >
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-700">
                Error loading certificate
              </p>
              <p className="text-red-600 text-sm">Please try again later.</p>
            </div>
          </div>
        ) : !cert ? (
          <div
            className="bg-orange-50 border border-orange-200 rounded-lg p-6 flex items-center gap-3"
            data-ocid="certificate.empty_state"
          >
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-700">
                Certificate Not Found
              </p>
              <p className="text-orange-600 text-sm">
                No certificate found with number: <strong>{certNumber}</strong>
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Trainee Details Card */}
            <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden mb-6">
              {/* Card header */}
              <div className="bg-navy px-5 py-3">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm">
                  Trainee Details
                </h3>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Photo + verified badge */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-36 h-44 border-2 border-border overflow-hidden rounded">
                    <img
                      src="/assets/generated/trainee-portrait-placeholder.dim_200x250.png"
                      alt="Trainee portrait"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {cert.certified ? (
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 text-xs font-bold uppercase tracking-wider">
                        Verified Trainee
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 text-xs font-bold uppercase tracking-wider">
                        Not Certified
                      </span>
                    </div>
                  )}
                </div>

                {/* Middle: Details */}
                <div className="col-span-1 md:col-span-1">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Trainee Name", cert.traineeName],
                        ["Father's Name", cert.fatherName],
                        ["Institute", cert.instituteName],
                        ["Institute Address", cert.instituteAddress],
                        ["Trade", cert.trade],
                        [
                          "Training Duration",
                          `${cert.trainingStartDate} – ${cert.trainingEndDate}`,
                        ],
                        ["Certificate No.", cert.certificateNumber],
                        [
                          "Certified Status",
                          <span
                            key="status"
                            className={
                              cert.certified
                                ? "text-green-600 font-bold"
                                : "text-red-500 font-bold"
                            }
                          >
                            {cert.certified ? "CERTIFIED" : "NOT CERTIFIED"}
                          </span>,
                        ],
                      ].map(([label, value]) => (
                        <tr
                          key={label as string}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-2 pr-3 text-muted-foreground font-medium whitespace-nowrap text-xs w-36">
                            {label}
                          </td>
                          <td className="py-2 font-semibold text-foreground text-xs">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right: QR Code */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Scan to Verify
                  </p>
                  {qrCodeDataUrl ? (
                    <div className="border-2 border-border rounded-lg p-2 bg-white">
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Code"
                        className="w-40 h-40"
                      />
                    </div>
                  ) : (
                    <Skeleton className="w-40 h-40" />
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    Scan to Verify Authenticity
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Issuance Card */}
            <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
              <div className="bg-navy px-5 py-3">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm">
                  Certificate Issuance Details
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Issue Date
                    </p>
                    <p className="font-bold text-foreground">
                      {cert.certificateIssueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Issued By
                    </p>
                    <p className="font-bold text-foreground">
                      National Council for Vocational Training
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Certificate Number
                    </p>
                    <p className="font-bold font-mono text-navy">
                      {cert.certificateNumber}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 bg-navy/5 border border-border rounded flex items-center justify-center">
                      <span className="text-2xl">📜</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Government of India
                      </p>
                      <p className="font-semibold text-navy text-sm">
                        Ministry of Skill Development &amp; Entrepreneurship
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued under the Craftsmen Training Scheme (CTS)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
