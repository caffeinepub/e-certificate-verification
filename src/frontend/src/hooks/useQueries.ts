import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Certificate, CertificateId } from "../backend";
import { useActor } from "./useActor";

export type { Certificate, CertificateId };

export interface CertificateWithId {
  id: CertificateId;
  certificate: Certificate;
}

export function useListCertificates() {
  const { actor, isFetching } = useActor();
  return useQuery<CertificateWithId[]>({
    queryKey: ["certificates"],
    queryFn: async () => {
      if (!actor) return [];
      const list = await actor.listCertificates();
      return list.map((cert, idx) => ({ id: BigInt(idx), certificate: cert }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCertificate(id: CertificateId | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Certificate | null>({
    queryKey: ["certificate", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCertificate(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cert: Certificate) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createCertificate(cert);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}

export function useUpdateCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      cert,
    }: { id: CertificateId; cert: Certificate }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateCertificate(id, cert);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}
