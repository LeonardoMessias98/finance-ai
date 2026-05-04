import { beforeEach, describe, expect, it, vi } from "vitest";

import { findUserById } from "@/features/auth/repositories/user-repository";
import {
  addFamilyMember as addFamilyMemberRecord,
  createFamily as createFamilyRecord,
  findFamilyByIdForMember,
  findFamilyByIdForOwner
} from "@/features/families/repositories/family-repository";
import { addFamilyMember } from "@/features/families/services/add-family-member-service";
import { createFamily } from "@/features/families/services/create-family-service";
import {
  DuplicateFamilyMemberError,
  FamilyAccessDeniedError,
  FamilyMemberNotFoundError
} from "@/features/families/services/family-errors";
import { getFamilyForView } from "@/features/families/services/get-family-for-view-service";
import type { Family } from "@/features/families/types/family";
import { requireAuthenticatedAppUser } from "@/lib/auth/session";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/session", () => ({
  requireAuthenticatedAppUser: vi.fn()
}));

vi.mock("@/features/auth/repositories/user-repository", () => ({
  findUserById: vi.fn()
}));

vi.mock("@/features/families/repositories/family-repository", () => ({
  addFamilyMember: vi.fn(),
  createFamily: vi.fn(),
  findFamilyByIdForMember: vi.fn(),
  findFamilyByIdForOwner: vi.fn()
}));

const familyId = "507f1f77bcf86cd799439010";
const ownerUserId = "507f1f77bcf86cd799439011";
const memberUserId = "507f1f77bcf86cd799439012";
const outsideUserId = "507f1f77bcf86cd799439013";

function buildFamily(memberIds: string[] = [ownerUserId]): Family {
  return {
    id: familyId,
    name: "Casa",
    ownerUserId,
    members: memberIds.map((userId, index) => ({
      userId,
      role: index === 0 ? "owner" : "member",
      canView: true
    })),
    createdAt: new Date("2026-05-03T12:00:00.000Z"),
    updatedAt: new Date("2026-05-03T12:00:00.000Z")
  };
}

describe("family services", () => {
  const requireAuthenticatedAppUserMock = vi.mocked(requireAuthenticatedAppUser);
  const createFamilyRecordMock = vi.mocked(createFamilyRecord);
  const addFamilyMemberRecordMock = vi.mocked(addFamilyMemberRecord);
  const findFamilyByIdForOwnerMock = vi.mocked(findFamilyByIdForOwner);
  const findFamilyByIdForMemberMock = vi.mocked(findFamilyByIdForMember);
  const findUserByIdMock = vi.mocked(findUserById);

  beforeEach(() => {
    requireAuthenticatedAppUserMock.mockReset();
    createFamilyRecordMock.mockReset();
    addFamilyMemberRecordMock.mockReset();
    findFamilyByIdForOwnerMock.mockReset();
    findFamilyByIdForMemberMock.mockReset();
    findUserByIdMock.mockReset();
    requireAuthenticatedAppUserMock.mockResolvedValue({
      id: ownerUserId,
      email: "owner@example.com",
      firstName: "Owner",
      lastName: "User",
      birthDate: new Date("1990-01-01T12:00:00.000Z"),
      sessionId: "session-1"
    });
  });

  it("creates a family for the authenticated user", async () => {
    const family = buildFamily();
    createFamilyRecordMock.mockResolvedValue(family);

    await expect(createFamily({ name: "Casa" })).resolves.toEqual(family);
    expect(createFamilyRecordMock).toHaveBeenCalledWith({
      name: "Casa",
      ownerUserId
    });
  });

  it("adds an existing member when requester owns the family", async () => {
    const initialFamily = buildFamily();
    const updatedFamily = buildFamily([ownerUserId, memberUserId]);
    findFamilyByIdForOwnerMock.mockResolvedValue(initialFamily);
    findUserByIdMock.mockResolvedValue({
      id: memberUserId,
      email: "member@example.com",
      firstName: "Member",
      lastName: "User",
      birthDate: new Date("1990-01-01T12:00:00.000Z"),
      passwordHash: "0".repeat(64),
      createdAt: new Date("2026-05-03T12:00:00.000Z"),
      updatedAt: new Date("2026-05-03T12:00:00.000Z")
    });
    addFamilyMemberRecordMock.mockResolvedValue(updatedFamily);

    await expect(addFamilyMember({ familyId, memberUserId })).resolves.toEqual(updatedFamily);
  });

  it("prevents adding a missing user", async () => {
    findFamilyByIdForOwnerMock.mockResolvedValue(buildFamily());
    findUserByIdMock.mockResolvedValue(null);

    await expect(addFamilyMember({ familyId, memberUserId })).rejects.toBeInstanceOf(FamilyMemberNotFoundError);
  });

  it("prevents duplicate members", async () => {
    findFamilyByIdForOwnerMock.mockResolvedValue(buildFamily([ownerUserId, memberUserId]));
    findUserByIdMock.mockResolvedValue({
      id: memberUserId,
      email: "member@example.com",
      firstName: "Member",
      lastName: "User",
      birthDate: new Date("1990-01-01T12:00:00.000Z"),
      passwordHash: "0".repeat(64),
      createdAt: new Date("2026-05-03T12:00:00.000Z"),
      updatedAt: new Date("2026-05-03T12:00:00.000Z")
    });

    await expect(addFamilyMember({ familyId, memberUserId })).rejects.toBeInstanceOf(DuplicateFamilyMemberError);
  });

  it("prevents non-owner from adding members", async () => {
    findFamilyByIdForOwnerMock.mockResolvedValue(null);
    findUserByIdMock.mockResolvedValue({
      id: memberUserId,
      email: "member@example.com",
      firstName: "Member",
      lastName: "User",
      birthDate: new Date("1990-01-01T12:00:00.000Z"),
      passwordHash: "0".repeat(64),
      createdAt: new Date("2026-05-03T12:00:00.000Z"),
      updatedAt: new Date("2026-05-03T12:00:00.000Z")
    });

    await expect(addFamilyMember({ familyId, memberUserId })).rejects.toBeInstanceOf(FamilyAccessDeniedError);
  });

  it("returns null when a user outside the family tries to view it", async () => {
    requireAuthenticatedAppUserMock.mockResolvedValue({
      id: outsideUserId,
      email: "outside@example.com",
      firstName: "Outside",
      lastName: "User",
      birthDate: new Date("1990-01-01T12:00:00.000Z"),
      sessionId: "session-2"
    });
    findFamilyByIdForMemberMock.mockResolvedValue(null);

    await expect(getFamilyForView(familyId)).resolves.toBeNull();
    expect(findFamilyByIdForMemberMock).toHaveBeenCalledWith(familyId, outsideUserId);
  });
});
