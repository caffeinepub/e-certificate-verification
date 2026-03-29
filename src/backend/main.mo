import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type CertificateId = Nat;

  // Certificate Record
  type Certificate = {
    traineeName : Text;
    fatherName : Text;
    instituteName : Text;
    instituteAddress : Text;
    trade : Text;
    trainingStartDate : Text;
    trainingEndDate : Text;
    certified : Bool;
    certificateIssueDate : Text;
    certificateNumber : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextCertificateId : CertificateId = 0;
  let certificates = Map.empty<CertificateId, Certificate>();
  let certIdByNumber = Map.empty<Text, CertificateId>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Login required");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Login required");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Login required");
    };
    userProfiles.add(caller, profile);
  };

  // Authenticated users: Create certificate
  public shared ({ caller }) func createCertificate(certificateData : Certificate) : async CertificateId {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Login required to create certificates");
    };

    let id = nextCertificateId;
    nextCertificateId += 1;
    certificates.add(id, certificateData);
    certIdByNumber.add(certificateData.certificateNumber, id);
    id;
  };

  // Authenticated users: Update certificate
  public shared ({ caller }) func updateCertificate(id : CertificateId, certificateData : Certificate) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Login required to update certificates");
    };

    switch (certificates.get(id)) {
      case (?_existing) {
        // Overwrite certificate and update number->id mapping
        certificates.add(id, certificateData);
        certIdByNumber.add(certificateData.certificateNumber, id);
      };
      case (null) {
        Runtime.trap("Certificate not found");
      };
    };
  };

  // Anyone: Query certificate by numeric ID
  public query func getCertificate(id : CertificateId) : async Certificate {
    switch (certificates.get(id)) {
      case (?certificate) { certificate };
      case (null) {
        Runtime.trap("Certificate not found");
      };
    };
  };

  // Anyone: Query certificate by certificate number string
  public query func getCertificateByNumber(certNumber : Text) : async Certificate {
    switch (certIdByNumber.get(certNumber)) {
      case (?id) {
        switch (certificates.get(id)) {
          case (?certificate) { certificate };
          case (null) { Runtime.trap("Certificate not found") };
        };
      };
      case (null) {
        Runtime.trap("Certificate number not found");
      };
    };
  };

  // Authenticated users: List all certificates
  public query ({ caller }) func listCertificates() : async [Certificate] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Login required to list certificates");
    };
    certificates.values().toArray();
  };
};
