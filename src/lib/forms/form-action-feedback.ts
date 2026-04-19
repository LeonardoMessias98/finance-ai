import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type FormActionFeedback = {
  status: "success" | "error";
  message: string;
};

type FormActionErrorResult<TFieldName extends string> = {
  fieldErrors?: Partial<Record<TFieldName, string[]>>;
};

export function applyFormActionFieldErrors<TFieldValues extends FieldValues, TFieldName extends Path<TFieldValues>>(
  form: UseFormReturn<TFieldValues>,
  result: FormActionErrorResult<TFieldName>
) {
  if (!result.fieldErrors) {
    return;
  }

  const fieldErrors = result.fieldErrors as Partial<Record<TFieldName, string[] | undefined>>;

  (Object.keys(fieldErrors) as TFieldName[]).forEach((fieldName) => {
    const messages = fieldErrors[fieldName];

    if (!Array.isArray(messages) || messages.length === 0) {
      return;
    }

    form.setError(fieldName, {
      type: "server",
      message: messages[0]
    });
  });
}
