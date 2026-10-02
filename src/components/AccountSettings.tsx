"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { userAuthClient } from "@/lib/user-auth-client";

export function AccountSettings({ name, email }: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setProfileMessage("");
    const nameValue = String(new FormData(event.currentTarget).get("name") || "").trim();
    const result = await userAuthClient.updateUser({ name: nameValue });
    if (result.error) setError(result.error.message || "Could not update your profile.");
    else {
      setProfileMessage("Profile updated.");
      router.refresh();
    }
    setPending(false);
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setPasswordMessage("");
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");
    if (newPassword !== String(form.get("confirmPassword") || "")) {
      setError("Your new passwords do not match.");
      setPending(false);
      return;
    }
    const result = await userAuthClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (result.error) setError(result.error.message || "Could not change your password.");
    else {
      event.currentTarget.reset();
      setPasswordMessage("Password changed. Other sessions have been signed out.");
    }
    setPending(false);
  }

  async function signOut() {
    await userAuthClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <section className="border-t border-stone-200 pt-6">
        <h2 className="text-lg font-semibold text-stone-900">Profile</h2>
        <p className="mt-1 text-sm text-stone-600">{email}</p>
        <form onSubmit={updateProfile} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1">
            <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-stone-800">Display name</label>
            <input id="profile-name" name="name" defaultValue={name} required maxLength={80} className="field field-focus" />
          </div>
          <button disabled={pending} className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">
            Save profile
          </button>
        </form>
        {profileMessage && <p role="status" className="mt-2 text-sm text-emerald-700">{profileMessage}</p>}
      </section>

      <section className="border-t border-stone-200 pt-6">
        <h2 className="text-lg font-semibold text-stone-900">Change password</h2>
        <form onSubmit={updatePassword} className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="current-password" className="mb-1.5 block text-sm font-medium text-stone-800">Current password</label>
            <input id="current-password" name="currentPassword" type="password" required autoComplete="current-password" className="field field-focus" />
          </div>
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-stone-800">New password</label>
            <input id="new-password" name="newPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className="field field-focus" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-stone-800">Confirm new password</label>
            <input id="confirm-password" name="confirmPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className="field field-focus" />
          </div>
          <div className="sm:col-span-3">
            <button disabled={pending} className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500 disabled:opacity-60">
              Update password
            </button>
            {passwordMessage && <p role="status" className="mt-2 text-sm text-emerald-700">{passwordMessage}</p>}
          </div>
        </form>
      </section>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="border-t border-stone-200 pt-5">
        <button type="button" onClick={() => void signOut()} className="text-sm font-semibold text-stone-600 hover:text-red-700">Sign out</button>
      </div>
    </div>
  );
}