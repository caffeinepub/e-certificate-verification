import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CertificateId = bigint;
export interface Certificate {
    traineeName: string;
    instituteName: string;
    trade: string;
    trainingEndDate: string;
    fatherName: string;
    instituteAddress: string;
    trainingStartDate: string;
    certified: boolean;
    certificateIssueDate: string;
    certificateNumber: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCertificate(certificateData: Certificate): Promise<CertificateId>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCertificate(id: CertificateId): Promise<Certificate>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCertificates(): Promise<Array<Certificate>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCertificate(id: CertificateId, certificateData: Certificate): Promise<void>;
}
