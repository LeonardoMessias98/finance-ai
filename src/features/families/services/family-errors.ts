import type { FamilyFieldName } from "@/features/families/types/family";

type FamilyFieldErrors = Partial<Record<FamilyFieldName, string[]>>;

export class FamilyBusinessError extends Error {
  readonly fieldErrors?: FamilyFieldErrors;

  constructor(message: string, fieldErrors?: FamilyFieldErrors) {
    super(message);
    this.name = "FamilyBusinessError";
    this.fieldErrors = fieldErrors;
  }
}

export class FamilyAccessDeniedError extends FamilyBusinessError {
  constructor(message = "Família não encontrada ou sem permissão de acesso.") {
    super(message);
    this.name = "FamilyAccessDeniedError";
  }
}

export class FamilyMemberNotFoundError extends FamilyBusinessError {
  constructor(message = "Usuário selecionado não foi encontrado.") {
    super(message, {
      memberUserId: [message]
    });
    this.name = "FamilyMemberNotFoundError";
  }
}

export class DuplicateFamilyMemberError extends FamilyBusinessError {
  constructor(message = "Este usuário já participa da família.") {
    super(message, {
      memberUserId: [message]
    });
    this.name = "DuplicateFamilyMemberError";
  }
}
