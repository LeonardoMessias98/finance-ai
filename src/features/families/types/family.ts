export const familyMemberRoleValues = ["owner", "member"] as const;

export type FamilyMemberRole = (typeof familyMemberRoleValues)[number];
export type FamilyFieldName = "name" | "familyId" | "memberUserId";

export type FamilyMember = {
  userId: string;
  role: FamilyMemberRole;
  canView: boolean;
};

export type Family = {
  id: string;
  name: string;
  ownerUserId: string;
  members: FamilyMember[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateFamilyInput = {
  name: string;
  ownerUserId: string;
};

export type AddFamilyMemberInput = {
  familyId: string;
  requesterUserId: string;
  memberUserId: string;
};

export type FamilyActionResult =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<FamilyFieldName, string[]>>;
    };
