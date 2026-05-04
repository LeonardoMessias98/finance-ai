import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { Types } from "mongoose";

import {
  addFamilyMember,
  createFamily,
  findFamilyByIdForMember
} from "@/features/families/repositories/family-repository";
import { FamilyModel } from "@/lib/db/models/family-model";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/db/connect", () => ({
  connectToDatabase: vi.fn()
}));

vi.mock("@/lib/db/models/family-model", () => ({
  FamilyModel: {
    create: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn()
  }
}));

const familyId = "507f1f77bcf86cd799439010";
const ownerUserId = "507f1f77bcf86cd799439011";
const memberUserId = "507f1f77bcf86cd799439012";
const createdAt = new Date("2026-05-03T12:00:00.000Z");
const updatedAt = new Date("2026-05-03T12:30:00.000Z");

type FamilyDocumentMock = {
  _id: Types.ObjectId;
  name: string;
  ownerUserId: Types.ObjectId;
  members: Array<{
    userId: Types.ObjectId;
    role: "owner" | "member";
    canView: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

function buildFamilyDocument(members: FamilyDocumentMock["members"]): FamilyDocumentMock {
  return {
    _id: new Types.ObjectId(familyId),
    name: "Casa",
    ownerUserId: new Types.ObjectId(ownerUserId),
    members,
    createdAt,
    updatedAt
  };
}

function createExecQuery<T>(value: T) {
  return {
    exec: vi.fn<() => Promise<T>>(async () => value)
  };
}

describe("family-repository", () => {
  const createMock = FamilyModel.create as unknown as Mock;
  const findOneMock = FamilyModel.findOne as unknown as Mock;
  const findOneAndUpdateMock = FamilyModel.findOneAndUpdate as unknown as Mock;

  beforeEach(() => {
    createMock.mockReset();
    findOneMock.mockReset();
    findOneAndUpdateMock.mockReset();
  });

  it("creates a family and adds the owner member automatically", async () => {
    createMock.mockResolvedValue(
      buildFamilyDocument([
        {
          userId: new Types.ObjectId(ownerUserId),
          role: "owner",
          canView: true
        }
      ])
    );

    const family = await createFamily({
      name: "Casa",
      ownerUserId
    });

    expect(createMock).toHaveBeenCalledWith({
      name: "Casa",
      ownerUserId: new Types.ObjectId(ownerUserId),
      members: [
        {
          userId: new Types.ObjectId(ownerUserId),
          role: "owner",
          canView: true
        }
      ]
    });
    expect(family.members).toEqual([
      {
        userId: ownerUserId,
        role: "owner",
        canView: true
      }
    ]);
  });

  it("adds a member to an owned family", async () => {
    findOneAndUpdateMock.mockReturnValue(
      createExecQuery(
        buildFamilyDocument([
          {
            userId: new Types.ObjectId(ownerUserId),
            role: "owner",
            canView: true
          },
          {
            userId: new Types.ObjectId(memberUserId),
            role: "member",
            canView: true
          }
        ])
      )
    );

    const family = await addFamilyMember({
      familyId,
      requesterUserId: ownerUserId,
      memberUserId
    });

    expect(family?.members).toEqual([
      {
        userId: ownerUserId,
        role: "owner",
        canView: true
      },
      {
        userId: memberUserId,
        role: "member",
        canView: true
      }
    ]);
  });

  it("returns null when a user outside the family tries to view it", async () => {
    findOneMock.mockReturnValue(createExecQuery(null));

    await expect(findFamilyByIdForMember(familyId, memberUserId)).resolves.toBeNull();
  });
});
