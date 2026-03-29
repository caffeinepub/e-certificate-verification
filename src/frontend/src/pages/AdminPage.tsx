import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Loader2, Pencil, Plus, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateCertificate,
  useListCertificates,
  useUpdateCertificate,
} from "../hooks/useQueries";
import type { Certificate, CertificateId } from "../hooks/useQueries";

const EMPTY_CERT: Certificate = {
  traineeName: "",
  fatherName: "",
  instituteName: "",
  instituteAddress: "",
  trade: "",
  trainingStartDate: "",
  trainingEndDate: "",
  certified: false,
  certificateIssueDate: "",
  certificateNumber: "",
};

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

function CertForm({
  value,
  onChange,
}: {
  value: Certificate;
  onChange: (c: Certificate) => void;
}) {
  const set = (field: keyof Certificate, val: string | boolean) =>
    onChange({ ...value, [field]: val });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
      <div className="space-y-1">
        <Label className="text-xs">Trainee Name *</Label>
        <Input
          value={value.traineeName}
          onChange={(e) => set("traineeName", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Father's Name *</Label>
        <Input
          value={value.fatherName}
          onChange={(e) => set("fatherName", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Institute Name *</Label>
        <Input
          value={value.instituteName}
          onChange={(e) => set("instituteName", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Institute Address</Label>
        <Input
          value={value.instituteAddress}
          onChange={(e) => set("instituteAddress", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Trade *</Label>
        <Input
          value={value.trade}
          onChange={(e) => set("trade", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Certificate Number *</Label>
        <Input
          value={value.certificateNumber}
          onChange={(e) => set("certificateNumber", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Training Start Date (DD/MM/YYYY)</Label>
        <Input
          placeholder="01/04/2023"
          value={value.trainingStartDate}
          onChange={(e) => set("trainingStartDate", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Training End Date (DD/MM/YYYY)</Label>
        <Input
          placeholder="31/03/2024"
          value={value.trainingEndDate}
          onChange={(e) => set("trainingEndDate", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Certificate Issue Date (DD/MM/YYYY)</Label>
        <Input
          placeholder="15/06/2024"
          value={value.certificateIssueDate}
          onChange={(e) => set("certificateIssueDate", e.target.value)}
          data-ocid="cert.input"
        />
      </div>
      <div className="flex items-center gap-3 pt-4">
        <Switch
          checked={value.certified}
          onCheckedChange={(v) => set("certified", v)}
          data-ocid="cert.switch"
        />
        <Label className="text-xs">Certified</Label>
      </div>
    </div>
  );
}

function AdminContent() {
  const { data: certs, isLoading } = useListCertificates();
  const createMutation = useCreateCertificate();
  const updateMutation = useUpdateCertificate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{ id: CertificateId } | null>(
    null,
  );
  const [formData, setFormData] = useState<Certificate>(EMPTY_CERT);

  const openAdd = () => {
    setEditTarget(null);
    setFormData(EMPTY_CERT);
    setDialogOpen(true);
  };

  const openEdit = (id: CertificateId, cert: Certificate) => {
    setEditTarget({ id });
    setFormData({ ...cert });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.traineeName || !formData.certificateNumber) {
      toast.error("Trainee name and certificate number are required.");
      return;
    }
    try {
      if (editTarget) {
        await updateMutation.mutateAsync({ id: editTarget.id, cert: formData });
        toast.success("Certificate updated.");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Certificate created.");
      }
      setDialogOpen(false);
    } catch {
      toast.error(
        "Failed to save certificate. Ensure you are logged in as admin.",
      );
    }
  };

  const handleSeedSample = async () => {
    try {
      await createMutation.mutateAsync(SAMPLE_CERT);
      toast.success("Sample certificate added.");
    } catch {
      toast.error("Failed to add sample. Ensure you are logged in as admin.");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy uppercase tracking-wider">
          Certificate Records
        </h2>
        <Button
          onClick={openAdd}
          className="bg-navy hover:bg-navy-dark text-white text-sm"
          data-ocid="cert.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Certificate
        </Button>
      </div>

      {isLoading ? (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="cert.loading_state"
        >
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          Loading certificates...
        </div>
      ) : !certs || certs.length === 0 ? (
        <div
          className="text-center py-12 bg-card rounded-lg border border-dashed border-border"
          data-ocid="cert.empty_state"
        >
          <p className="text-muted-foreground text-sm mb-3">
            No certificates found.
          </p>
          <Button
            variant="outline"
            onClick={handleSeedSample}
            className="text-sm"
          >
            Add Sample Certificate
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
          <table className="w-full text-sm" data-ocid="cert.table">
            <thead className="bg-navy text-white">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  Trainee
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                  Certificate No.
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                  Trade
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {certs.map((item, idx) => (
                <tr
                  key={item.id.toString()}
                  className="border-t border-border hover:bg-background/50"
                  data-ocid={`cert.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">
                      {item.certificate.traineeName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.certificate.fatherName}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs hidden md:table-cell">
                    {item.certificate.certificateNumber}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {item.certificate.trade}
                  </td>
                  <td className="px-4 py-3">
                    {item.certificate.certified ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Certified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Not Certified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(item.id, item.certificate)}
                        className="text-xs h-7"
                        data-ocid={`cert.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Link
                        to="/certificate/$id"
                        params={{
                          id: encodeURIComponent(
                            item.certificate.certificateNumber,
                          ),
                        }}
                        className="text-xs text-navy underline hover:no-underline"
                        data-ocid={`cert.link.${idx + 1}`}
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="cert.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-navy uppercase tracking-wider text-sm">
              {editTarget ? "Edit Certificate" : "Add New Certificate"}
            </DialogTitle>
          </DialogHeader>
          <CertForm value={formData} onChange={setFormData} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="cert.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-navy hover:bg-navy-dark text-white"
              data-ocid="cert.save_button"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : null}
              {isPending ? "Saving..." : "Save Certificate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero band */}
      <div className="bg-navy py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest">
              Admin Panel
            </h2>
            <p className="text-white/60 text-xs mt-1">
              Manage certificate records
            </p>
          </div>
          {isAuthenticated ? (
            <span className="text-green-300 text-xs font-medium">
              ● Logged In
            </span>
          ) : null}
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
          <span className="text-navy font-medium">Admin</span>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {!isAuthenticated ? (
          <div className="text-center py-16">
            <div className="inline-block bg-card rounded-lg shadow-card border border-border p-10">
              <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-navy text-lg mb-2">
                Admin Access Required
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                You must log in with Internet Identity to access the admin
                panel.
              </p>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="bg-navy hover:bg-navy-dark text-white px-8"
                data-ocid="admin.primary_button"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isLoggingIn ? "Logging in..." : "Login to Continue"}
              </Button>
            </div>
          </div>
        ) : (
          <AdminContent />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
