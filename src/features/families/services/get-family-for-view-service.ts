import "server-only";

import { findFamilyByIdForMember } from "@/features/families/repositories/family-repository";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

export async function getFamilyForView(familyId: string) {
  const user = await requireAuthenticatedAppUser();

  return findFamilyByIdForMember(familyId, user.id);
}
