"use client";
import { Database } from "@/supabase";
import { createClient } from "@/utils/supabase/client";
import { AuthError, PostgrestError, User } from "@supabase/supabase-js";

export type PinRequest = Database["public"]["Tables"]["requests"]["Row"];
export type Pin = Database["public"]["Tables"]["pins"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export async function signOut(): Promise<AuthError | null> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  return error;
}

export async function fetchUser(): Promise<User | AuthError> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return error;
  }

  return data.user;
}

export async function fetchProfile(
  userID: string
): Promise<Profile | PostgrestError> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userID);

  if (error) {
    return error;
  }

  return data ? data[0] : {};
}

export async function fetchPins(): Promise<Pin[] | PostgrestError> {
  const supabase = createClient();
  const { data, error } = await supabase.from("pins").select("*");

  if (error) {
    return error;
  }

  return data ? data : [];
}

export async function fetchUserItems(
  user: User
): Promise<Pin[] | PostgrestError> {
  const supabase = createClient();
  let { data, error } = await supabase
    .from("pins")
    .select("*")
    .eq("creator_id", user.id);

  if (error) {
    return error;
  }

  return data ? data : [];
}

export async function fetchClaims(
  itemID: string,
  user: User
): Promise<PinRequest[] | PostgrestError> {
  const supabase = createClient();
  let { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("request_id", user?.id + itemID);

  if (error) {
    return error;
  }

  return data ? data : [];
}

export async function fetchRequests(
  itemID: string
): Promise<PinRequest[] | PostgrestError> {
  const supabase = createClient();

  let { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("item_id", itemID);

  if (error) {
    return error;
  }

  return data ? data : [];
}

export async function fetchPinRequest(
  requestID: string
): Promise<PinRequest | PostgrestError> {
  const supabase = createClient();
  let { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("request_id", requestID);

  if (error) {
    return error;
  }

  return data ? data[0] : {};
}

export async function fetchUserRequests(
  creator_id: string
): Promise<PinRequest[] | PostgrestError> {
  const supabase = createClient();
  let { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("creator_id", creator_id);

  if (error) {
    return error;
  }

  return data ? data : [];
}

export async function fetchPin(itemID: string): Promise<Pin | PostgrestError> {
  const supabase = createClient();
  let { data, error } = await supabase
    .from("pins")
    .select("*")
    .eq("item_id", itemID);

  if (error) {
    return error;
  }

  return data ? data[0] : {};
}

export async function createPin(
  pin: Pin,
  user: User | AuthError
): Promise<Pin | PostgrestError> {
  const supabase = createClient();

  if (user instanceof AuthError) {
    return {
      message: "Error retrieving user",
      details: "Error retrieving user",
      hint: "Error retrieving user",
      code: "Error retrieving user",
    };
  }

  const profile = await fetchProfile(user.id);

  if ("message" in profile) {
    return {
      message: "Error retrieving username",
      details: "Error retrieving username",
      hint: "Error retrieving username",
      code: "Error retrieving username",
    };
  }

  const { data, error } = await supabase
    .from("pins")
    .insert([
      {
        creator_id: user.id,
        user_name: profile.username,
        x_coordinate: pin.x_coordinate,
        y_coordinate: pin.y_coordinate,
        item: pin.item,
        description: pin.description,
      },
    ])
    .select();

  if (error) {
    return error;
  }

  return data ? data[0] : {};
}

export async function updatePin(
  itemID: string,
  item: string,
  description: string,
  x_coordinate: number,
  y_coordinate: number
): Promise<Pin | PostgrestError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pins")
    .update({
      item: item,
      description: description,
      x_coordinate: x_coordinate,
      y_coordinate: y_coordinate,
    })
    .eq("item_id", itemID)
    .select();

  if (error) {
    return error;
  }

  return data ? data[0] : {};
}

export async function claimItem(
  request: PinRequest,
  user: User,
  contactInfo: string
): Promise<PinRequest | PostgrestError> {
  const supabase = createClient();
  if (user instanceof AuthError) {
    return {
      message: "Error claiming item",
      details: "Error claiming item",
      hint: "Error claiming item",
      code: "Error claiming item",
    };
  }

  const profile = await fetchProfile(user.id);

  if ("message" in profile) {
    return {
      message: "Error retrieving username",
      details: "Error retrieving username",
      hint: "Error retrieving username",
      code: "Error retrieving username",
    };
  }

  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        description: request.description,
        item_id: request.item_id,
        request_id: user.id + request.item_id,
        creator_id: request.creator_id,
        creator_name: profile.username,
        contact: contactInfo,
        pin_creator_id: request.pin_creator_id,
      },
    ])
    .select();

  if (error) {
    return error;
  }

  return data ? data[0] : [];
}

export async function acceptClaim(
  creatorID: string,
  itemID: string
): Promise<PinRequest[] | PostgrestError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("requests")
    .update({ status: "accepted" })
    .eq("request_id", `${creatorID}${itemID}`)
    .select();

  if (error) {
    return error;
  }

  return data ? data : [];
}

export async function rejectClaim(
  creatorID: string,
  itemID: string
): Promise<PinRequest[] | PostgrestError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("requests")
    .update({ status: "rejected" })
    .eq("request_id", `${creatorID}${itemID}`)
    .select();

  console.log(error);

  if (error) {
    return error;
  }

  return data ? data : [];
}

export async function deletePin(
  itemID: string
): Promise<Pin[] | PostgrestError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pins")
    .delete()
    .eq("item_id", itemID)
    .select();

  if (error) {
    return error;
  }

  return data ? data : [];
}

export async function deleteRequest(
  requestID: string
): Promise<PinRequest[] | PostgrestError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("requests")
    .delete()
    .eq("request_id", requestID)
    .select();

  if (error) {
    return error;
  }

  return data ? data : [];
}
