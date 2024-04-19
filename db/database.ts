"use client";
import { Database } from "@/supabase";
import { createClient } from "@/utils/supabase/client";
import { AuthError, PostgrestError, User } from "@supabase/supabase-js";

export type PinRequest = Database["public"]["Tables"]["requests"]["Row"];
export type Pin = Database["public"]["Tables"]["pins"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
/**
 * Function that returns the URL of the site.
 *
 * @returns The URL of the site.
 */
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";
  url = url.includes("http") ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

/**
 * Function that signs the user out.
 *
 * @returns The error if there is one.
 */
export async function signOut(): Promise<AuthError | null> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  return error;
}

/**
 * Function that fetches the user.
 *
 * @returns The user or an error.
 */
export async function fetchUser(): Promise<User | AuthError> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return error;
  }

  return data.user;
}

/**
 * Function that fetches the profile of a user.
 *
 * @param userID The ID of the user
 * @returns The profile or an error.
 */
export async function fetchProfile(
  userID: string,
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

/**
 * Function that fetches the pins.
 *
 * @returns The pins or an error.
 */
export async function fetchPins(): Promise<Pin[] | PostgrestError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return error;
  }

  return data ? data : [];
}

/**
 * Function that fetches the items of a user.
 *
 * @param user The user
 * @returns The items of the user or an error.
 */
export async function fetchUserItems(
  user: User,
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

/**
 * Function that fetches the claims of an a specific user.
 *
 * @param itemID The ID of the item
 * @param user The user
 * @returns The claims of the user or an error.
 */
export async function fetchClaims(
  itemID: string,
  user: User,
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

/**
 * Function that fetches the requests of an item.
 *
 * @param itemID The ID of the item
 * @returns The requests of the item or an error.
 */
export async function fetchRequests(
  itemID: string,
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

/**
 * Function that fetches a request.
 *
 * @param requestID The ID of the request
 * @returns The request or an error.
 */
export async function fetchPinRequest(
  requestID: string,
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

/**
 * Function that fetches the requests of a user.
 *
 * @param creator_id The ID of the creator
 * @returns The requests of the user or an error.
 */
export async function fetchUserRequests(
  creator_id: string,
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

/**
 * Function that fetches a pin.
 *
 * @param itemID The ID of the item
 * @returns The pin or an error.
 */
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

/**
 * Function that creates a pin.
 *
 * @param pin the pin to be created
 * @param user the user who is creating the pin
 * @returns The pin or an error.
 */
export async function createPin(
  pin: Pin,
  user: User | AuthError,
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
        in_posession: pin.in_possession,
      },
    ])
    .select();

  if (error) {
    return error;
  }

  return data ? data[0] : {};
}

/**
 * Function that updates a pin.
 *
 * @param itemID the ID of the item
 * @param item the item
 * @param description the description of the item
 * @param x_coordinate the x coordinate of the item
 * @param y_coordinate the y coordinate of the item
 * @returns The pin or an error.
 */
export async function updatePin(
  itemID: string,
  item: string,
  description: string,
  x_coordinate: number,
  y_coordinate: number,
  inPossession: boolean,
): Promise<Pin | PostgrestError> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pins")
    .update({
      item: item,
      description: description,
      x_coordinate: x_coordinate,
      y_coordinate: y_coordinate,
      in_possession: inPossession,
    })
    .eq("item_id", itemID)
    .select();

  if (error) {
    return error;
  }

  return data ? data[0] : {};
}

/**
 * Function that claims an item.
 *
 * @param request the request to claim the item
 * @param user the user who is claiming the item
 * @param contactInfo the contact information of the user
 * @returns The request or an error.
 */
export async function claimItem(
  request: PinRequest,
  user: User,
  contactInfo: string,
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

/**
 * Function that accepts a claim.
 *
 * @param creatorID the ID of the creator of the pin
 * @param itemID the ID of the item
 * @returns The request or an error.
 */
export async function acceptClaim(
  creatorID: string,
  itemID: string,
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

/**
 * Function that rejects a claim.
 *
 * @param creatorID the ID of the creator of the pin
 * @param itemID the ID of the item
 * @returns The request or an error.
 */
export async function rejectClaim(
  creatorID: string,
  itemID: string,
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

/**
 * Function that deletes a pin.
 *
 * @param itemID the ID of the item
 * @returns The pin or an error.
 */
export async function deletePin(
  itemID: string,
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

/**
 * Function that deletes a request.
 *
 * @param requestID the ID of the request
 * @returns The request or an error.
 */
export async function deleteRequest(
  requestID: string,
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

/**
 * Function that converts supabase military time format to EST.
 *
 * @param time
 * @returns The time in EST.
 */
export const convertMilitaryToEst = (time: string): string => {
  const hour = parseInt(time.slice(11, 13));
  const minute = time.slice(14, 16);
  let period = "AM";

  if (hour > 12) {
    period = "PM";
    return `${hour - 12}:${minute} ${period}`;
  } else if (hour === 12) {
    period = "PM";
  }

  return `${hour}:${minute} ${period}`;
};
