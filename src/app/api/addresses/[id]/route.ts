import { NextResponse } from 'next/server';

import { handleApiError } from '@/lib/api/handle-api-error';
import { requireUser } from '@/lib/auth/require-user';
import { updateAddressSchema } from '@/lib/validations/address.schema';
import { deleteAddress, updateAddress } from '@/modules/addresses/services/address.service';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await requireUser();
    const { id } = await params;

    const body: unknown = await request.json();
    const validation = updateAddressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message ?? 'اطلاعات ویرایش آدرس معتبر نیست',
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const address = await updateAddress(userId, id, validation.data);

    return NextResponse.json({
      success: true,
      message: 'آدرس با موفقیت ویرایش شد',
      data: address,
    });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/addresses/[id] error:', 'خطا در ویرایش آدرس');
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { userId } = await requireUser();
    const { id } = await params;

    await deleteAddress(userId, id);

    return NextResponse.json({
      success: true,
      message: 'آدرس با موفقیت حذف شد',
    });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/addresses/[id] error:', 'خطا در حذف آدرس');
  }
}
