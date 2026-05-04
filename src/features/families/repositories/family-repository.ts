import "server-only";

import type { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

import {
  addFamilyMemberSchema,
  createFamilySchema
} from "@/features/families/schemas/family-schema";
import type { AddFamilyMemberInput, CreateFamilyInput, Family } from "@/features/families/types/family";
import { connectToDatabase } from "@/lib/db/connect";
import { type FamilyDocument, FamilyModel } from "@/lib/db/models/family-model";
import { isObjectIdString } from "@/lib/db/object-id";

function mapFamilyDocument(document: HydratedDocument<FamilyDocument>): Family {
  return {
    id: document._id.toString(),
    name: document.name,
    ownerUserId: document.ownerUserId.toString(),
    members: document.members.map((member) => ({
      userId: member.userId.toString(),
      role: member.role,
      canView: member.canView
    })),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  };
}

export async function createFamily(input: CreateFamilyInput): Promise<Family> {
  const payload = createFamilySchema.parse(input);

  await connectToDatabase();

  const ownerUserObjectId = new Types.ObjectId(payload.ownerUserId);
  const document = await FamilyModel.create({
    name: payload.name,
    ownerUserId: ownerUserObjectId,
    members: [
      {
        userId: ownerUserObjectId,
        role: "owner",
        canView: true
      }
    ]
  });

  return mapFamilyDocument(document);
}

export async function findFamilyByIdForMember(familyId: string, userId: string): Promise<Family | null> {
  if (!isObjectIdString(familyId) || !isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await FamilyModel.findOne({
    _id: familyId,
    members: {
      $elemMatch: {
        userId,
        canView: true
      }
    }
  }).exec();

  return document ? mapFamilyDocument(document) : null;
}

export async function findFirstFamilyForMember(userId: string): Promise<Family | null> {
  if (!isObjectIdString(userId)) {
    return null;
  }

  await connectToDatabase();

  const document = await FamilyModel.findOne({
    members: {
      $elemMatch: {
        userId,
        canView: true
      }
    }
  })
    .sort({
      createdAt: 1,
      name: 1
    })
    .exec();

  return document ? mapFamilyDocument(document) : null;
}

export async function findFamilyByIdForOwner(familyId: string, ownerUserId: string): Promise<Family | null> {
  if (!isObjectIdString(familyId) || !isObjectIdString(ownerUserId)) {
    return null;
  }

  await connectToDatabase();

  const document = await FamilyModel.findOne({
    _id: familyId,
    ownerUserId
  }).exec();

  return document ? mapFamilyDocument(document) : null;
}

export async function addFamilyMember(input: AddFamilyMemberInput): Promise<Family | null> {
  const payload = addFamilyMemberSchema.parse(input);

  await connectToDatabase();

  const document = await FamilyModel.findOneAndUpdate(
    {
      _id: payload.familyId,
      ownerUserId: payload.requesterUserId,
      "members.userId": {
        $ne: new Types.ObjectId(payload.memberUserId)
      }
    },
    {
      $push: {
        members: {
          userId: new Types.ObjectId(payload.memberUserId),
          role: "member",
          canView: true
        }
      }
    },
    {
      new: true,
      runValidators: true
    }
  ).exec();

  return document ? mapFamilyDocument(document) : null;
}
