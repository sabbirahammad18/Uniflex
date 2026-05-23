type ApiErrorShape = {
  status?: number | string;
  data?: {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
  };
};

export const formatCurrency = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return String(value ?? "0");
  }

  return `৳ ${amount.toLocaleString("en-BD", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatPlainNumber = (
  value: number | string | null | undefined,
) => {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return String(value ?? "0");
  }

  return amount.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  });
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  const apiError = error as ApiErrorShape;
  const firstValidationMessage = apiError.data?.errors
    ? Object.values(apiError.data.errors).flat()[0]
    : null;

  return (
    firstValidationMessage ||
    apiError.data?.message ||
    apiError.data?.error ||
    fallback
  );
};
