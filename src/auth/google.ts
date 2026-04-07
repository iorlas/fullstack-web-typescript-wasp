import { defineUserSignupFields } from "wasp/server/auth";

export const googleUserSignupFields = defineUserSignupFields({
  username: (data) => {
    const profile = data.profile as { name?: string; email?: string } | undefined;
    return profile?.name || profile?.email || "user";
  },
});
