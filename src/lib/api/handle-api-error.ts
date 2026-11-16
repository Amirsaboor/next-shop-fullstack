import { NextResponse } from "next/server";

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export function handleApiError(
  error: unknown,
  context: string,
  fallbackMessage: string,
) {
  console.error(context, error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        success: false,
        message: "فرمت JSON درخواست نامعتبر است",
      },
      { status: 400 },
    );
  }

  if (isDuplicateKeyError(error)) {
    return NextResponse.json(
      {
        success: false,
        message: "این مقدار قبلاً ثبت شده است",
      },
      { status: 409 },
    );
  }

  if (
    error instanceof Error &&
    (error.name === "ValidationError" || error.name === "CastError")
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "اطلاعات ارسالی معتبر نیست",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: fallbackMessage,
    },
    { status: 500 },
  );
}
