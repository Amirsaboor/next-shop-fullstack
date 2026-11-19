import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

import { connectToDatabase } from "@/lib/db/connect";
import { sessionCookie, verifySessionToken } from "@/lib/auth/session";
import { getPublicUserById } from "@/modules/auth/services/auth.service";
import { mergeGuestCart } from "@/modules/cart/services/cart.service";

const GUEST_COOKIE_NAME = "shop_guest_id";
const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export type CartOwner =
  | { userId: string }
  | { guestId: string };

export async function getCartOwner(): Promise<CartOwner> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(sessionCookie.name)?.value;
  const guestId = cookieStore.get(GUEST_COOKIE_NAME)?.value;

  if (sessionToken) {
    const session = verifySessionToken(sessionToken);

    if (session) {
      await connectToDatabase();
      await getPublicUserById(session.userId);

      if (guestId) {
        await mergeGuestCart(guestId, session.userId);
        cookieStore.set(GUEST_COOKIE_NAME, "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 0,
        });
      }

      return { userId: session.userId };
    }
  }

  const currentGuestId = guestId || randomUUID();

  if (!guestId) {
    cookieStore.set(GUEST_COOKIE_NAME, currentGuestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: GUEST_COOKIE_MAX_AGE,
    });
  }

  return { guestId: currentGuestId };
}
