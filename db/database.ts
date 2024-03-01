"use server";
import { Database } from "@/supabase";
import { createClient } from "@/utils/supabase/server";
import {
  AuthError,
  PostgrestError,
  User,
} from "@supabase/supabase-js";
import { cookies } from "next/headers";

export type PinRequest = Database["public"]["Tables"]["requests"]["Row"];
export type Pin = Database["public"]["Tables"]["pins"]["Row"];


export async function signOut(): Promise<AuthError | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = await supabase.auth.signOut();

  return data.error;
}

export async function fetchUser(): Promise<User | AuthError> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  return user ? user : error ? error : new AuthError("User not found");
}

export async function getUserName(user: User | AuthError): Promise<string> {
  if (user instanceof AuthError || user.id === undefined) {
    return "Error retrieving user";
  }

  const user_name: string = user.identities![0].identity_data!.full_name!;

  return user_name;
}

export async function fetchPins(): Promise<Pin[] | PostgrestError> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("pins").select("*");

  if (error) {
    return error
      ? error
      : {
          message: "Error fetching pins",
          details: "Error fetching pins",
          hint: "Error fetching pins",
          code: "Error fetching pins",
        };
  }

  return data;
}

export async function fetchUserItems(
  user: User
): Promise<Pin[] | PostgrestError> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let { data: pins, error } = await supabase
    .from("pins")
    .select("*")
    .eq("creator_id", user.id);

  return pins
    ? pins
    : error
    ? error
    : {
        message: "Error fetching user items",
        details: "Error fetching user items",
        hint: "Error fetching user items",
        code: "Error fetching user items",
      };
}

export async function fetchClaims(
  itemID: string,
  user: User
): Promise<PinRequest[] | PostgrestError> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("request_id", user?.id + itemID);

  if (error) {
    return error
      ? error
      : {
          message: "Error fetching claims",
          details: "Error fetching claims",
          hint: "Error fetching claims",
          code: "Error fetching claims",
        };
  }

  return data ? data : [];
}

export async function fetchRequests(itemID: string): Promise<PinRequest[] | PostgrestError> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("item_id", itemID);

  if (error) {
    return error
      ? error
      : {
          message: "Error fetching requests",
          details: "Error fetching requests",
          hint: "Error fetching requests",
          code: "Error fetching requests",
        };
  }

  return data ? data : [];
}

export async function fetchPin(itemID: string): Promise<Pin | PostgrestError> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let { data, error } = await supabase
    .from("pins")
    .select("*")
    .eq("item_id", itemID);

  if (error) {
    return error
      ? error
      : {
          message: "Error fetching pin",
          details: "Error fetching pin",
          hint: "Error fetching pin",
          code: "Error fetching pin",
        };
  }

  return data ? data[0] : error;
}

export async function createPin(pin: Pin, user: User | AuthError): Promise<Pin | PostgrestError> {

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (user instanceof AuthError) {
    return {
      message: "Error retrieving user",
      details: "Error retrieving user",
      hint: "Error retrieving user",
      code: "Error retrieving user",
    };
  }

  const { data, error } = await supabase
    .from("pins")
    .insert([
      {
        creator_id: user.id,
        user_name: await getUserName(user),
        x_coordinate: pin.x_coordinate,
        y_coordinate: pin.y_coordinate,
        item: pin.item,
        description: pin.description,
      },
    ])
    .select();

    if (error) {
        return error?
        error:
        {
            message: "Error creating pin",
            details: "Error creating pin",
            hint: "Error creating pin",
            code: "Error creating pin",
        }
    }

    return data ? data[0] : error;
}

export async function claimItem(
  request: PinRequest,
  user: User,
  contactInfo: string,
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  if (user instanceof AuthError) {
    return "Error retrieving user";
  }

  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        description: request.description,
        item_id: request.item_id,
        request_id: user.id + request.item_id,
        creator_name: await getUserName(user),
        contact: contactInfo,
        pin_creator_id: user.id,
      },
    ])
    .select();

    if (error) {
        return error?
        error:
        {
            message: "Error claiming item",
            details: "Error claiming item",
            hint: "Error claiming item",
            code: "Error claiming item",
        }
    }

    return data ? data : [];
}

export async function acceptClaim(creatorID: string, itemID: string): Promise<PinRequest[] | PostgrestError> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("requests")
    .update({ status: "accepted" })
    .eq("request_id", `${creatorID}${itemID}`)
    .select();

    if (error) {
        return error?
        error:
        {
            message: "Error accepting claim",
            details: "Error accepting claim",
            hint: "Error accepting claim",
            code: "Error accepting claim",
        }
    }

    return data ? data : [];
}

export async function rejectClaim(creatorID: string, itemID: string): Promise<PinRequest[] | PostgrestError> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("requests")
    .update({ status: "rejected" })
    .eq("request_id", `${creatorID}${itemID}`)
    .select();

    if (error) {
        return error?
        error:
        {
            message: "Error rejecting claim",
            details: "Error rejecting claim",
            hint: "Error rejecting claim",
            code: "Error rejecting claim",
        }
    }

    return data ? data : [];
}
