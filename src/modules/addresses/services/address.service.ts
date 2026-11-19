import "server-only";

import mongoose from "mongoose";

import { AppError } from "@/lib/errors/app-error";
import Address from "@/modules/addresses/models/address.model";
import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "@/lib/validations/address.schema";

function validateId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("شناسه آدرس معتبر نیست", 400);
  }
}

export async function getUserAddresses(userId: string) {
  return Address.find({ user: userId })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();
}

export async function createAddress(
  userId: string,
  input: CreateAddressInput,
) {
  const addressCount = await Address.countDocuments({ user: userId });
  const isDefault = input.isDefault === true || addressCount === 0;

  if (isDefault) {
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } },
    );
  }

  return Address.create({
    ...input,
    user: userId,
    isDefault,
  });
}

export async function updateAddress(
  userId: string,
  addressId: string,
  input: UpdateAddressInput,
) {
  validateId(addressId);

  const currentAddress = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!currentAddress) {
    throw new AppError("آدرس موردنظر پیدا نشد", 404);
  }

  if (input.isDefault === true) {
    await Address.updateMany(
      { user: userId },
      { $set: { isDefault: false } },
    );
  }

  const updatedAddress = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    { $set: input },
    { new: true, runValidators: true },
  );

  if (!updatedAddress) {
    throw new AppError("ویرایش آدرس انجام نشد", 500);
  }

  if (input.isDefault === false && currentAddress.isDefault) {
    const nextAddress = await Address.findOne({
      user: userId,
      _id: { $ne: addressId },
    }).sort({ createdAt: 1 });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return updatedAddress;
}

export async function deleteAddress(userId: string, addressId: string) {
  validateId(addressId);

  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new AppError("آدرس موردنظر پیدا نشد", 404);
  }

  await address.deleteOne();

  if (address.isDefault) {
    const nextAddress = await Address.findOne({ user: userId }).sort({
      createdAt: 1,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return true;
}
