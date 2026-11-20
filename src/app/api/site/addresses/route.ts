import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/site/handle-api-error";
import { requireUser } from "@/lib/auth/require-user";
import { createAddressSchema } from "@/lib/validations/address.schema";
import {
  createAddress,
  getUserAddresses,
} from "@/modules/addresses/services/address.service";

export async function GET() {
  try {
    const { userId } = await requireUser();
    const addresses = await getUserAddresses(userId);

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return handleApiError(
      error,
      "GET /api/site/addresses error:",
      "خطا در دریافت آدرس‌ها",
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();

    const body: unknown = await request.json();
    const validation = createAddressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ??
            "اطلاعات آدرس معتبر نیست",
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const address = await createAddress(userId, validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "آدرس با موفقیت ثبت شد",
        data: address,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "POST /api/site/addresses error:",
      "خطا در ثبت آدرس",
    );
  }
}
