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
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin Only: Create certificate
  public shared ({ caller }) func createCertificate(certificateData : Certificate) : async CertificateId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create certificates");
    };

    let id = nextCertificateId;
    nextCertificateId += 1;
    certificates.add(id, certificateData);
    id;
  };

  // Admin Only: Update certificate
  public shared ({ caller }) func updateCertificate(id : CertificateId, certificateData : Certificate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update certificates");
    };

    switch (certificates.get(id)) {
      case (?_) {
        certificates.add(id, certificateData);
      };
      case (null) {
        Runtime.trap("Certificate not found");
      };
    };
  };

  // Anyone: Query certificate (no authentication required)
  public query func getCertificate(id : CertificateId) : async Certificate {
    switch (certificates.get(id)) {
      case (?certificate) { certificate };
      case (null) {
        Runtime.trap("Certificate not found");
      };
    };
  };

  // Admin Only: List all certificates
  public query ({ caller }) func listCertificates() : async [Certificate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list certificates");
    };

    certificates.values().toArray();
  };
};
