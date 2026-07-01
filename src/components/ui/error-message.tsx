"use client";

import React from "react";

interface ErrorMessageProps {
  error: unknown;
  defaultMessage?: string;
}

function getErrorMessage(error: unknown): string | string[] | undefined {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    const response = errObj.response as Record<string, unknown> | undefined;
    const data = response?.data as Record<string, unknown> | undefined;
    return (
      data?.message as string | undefined ||
      data?.title as string | undefined ||
      errObj.message as string | undefined
    );
  }
  return undefined;
}

export function ErrorMessage({
  error,
  defaultMessage = "An unexpected error occurred. Please try again.",
}: ErrorMessageProps) {
  if (!error) return null;

  const message = getErrorMessage(error) || defaultMessage;

  let errorsList: string[] = [];
  if (typeof message === "string") {
    // The backend sometimes returns comma-separated messages
    errorsList = message.split(",").map((m) => m.trim()).filter(Boolean);
  } else if (Array.isArray(message)) {
    errorsList = message;
  } else {
    errorsList = [defaultMessage];
  }

  // Format common backend errors to be more user friendly
  errorsList = errorsList
    .map((err) => {
      const lower = err.toLowerCase();
      if (lower.includes("user already exists")) {
        return "This email, username, or phone number is already registered.";
      }
      if (lower === "an unexpected error occurred") {
        return null; // Skip generic prefix
      }
      return err;
    })
    .filter(Boolean) as string[];

  if (errorsList.length === 0) {
    errorsList = [defaultMessage];
  }

  return (
    <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
      {errorsList.length > 1 ? (
        <ul className="list-disc pl-4 space-y-1">
          {errorsList.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      ) : (
        <p>{errorsList[0]}</p>
      )}
    </div>
  );
}

