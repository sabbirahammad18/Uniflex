import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useChangePasswordMutation } from "@/queries/passwordQuery";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/queries/profileQuery";
import { getApiErrorMessage } from "@/utils/format";

function Setting() {
  const { data: profileResponse } = useGetProfileQuery();
  const [updateProfile, { isLoading: updatingProfile }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();
  const profile = profileResponse?.data;

  const [image, setImage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const displayImage =
    image || profile?.avatar_url || "https://i.pravatar.cc/150?img=12";
  const profileName = name ?? profile?.name ?? "";
  const profilePhoneNumber = phoneNumber ?? profile?.phone_number ?? "";

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const clearStatus = () => {
    setMessage("");
    setErrorMessage("");
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearStatus();

    try {
      await updateProfile({
        name: profileName,
        phone_number: profilePhoneNumber,
        avatar: avatarFile,
      }).unwrap();
      setMessage("Profile updated successfully");
      setAvatarFile(null);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Profile update failed"));
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearStatus();

    try {
      await changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      }).unwrap();
      setMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Password update failed"));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-106 min-h-screen bg-white overflow-hidden">
        <div className="bg-[#07277F] h-52 flex items-center justify-center rounded-b-[40px]">
          <h1 className="text-white text-3xl font-bold">Profile Settings</h1>
        </div>

        <div className="flex flex-col items-center -mt-16 px-6">
          <div className="relative">
            <img
              src={displayImage}
              alt="profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
            />

            <label
              htmlFor="fileUpload"
              className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#07277F] text-white flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-body-lg">
                edit
              </span>
            </label>

            <input
              type="file"
              id="fileUpload"
              className="hidden"
              accept="image/*"
              onChange={handleImage}
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-center">
            {profile?.name || "User"}
          </h2>

          <p className="text-gray-500 text-sm">Edit your profile information</p>
        </div>

        <div className="px-6 py-8 space-y-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                clearStatus();
                setShowNamePopup(true);
                setShowPasswordPopup(false);
              }}
              className="text-[#07277F] font-semibold hover:underline"
            >
              Settings
            </button>

            <button
              onClick={() => {
                clearStatus();
                setShowPasswordPopup(true);
                setShowNamePopup(false);
              }}
              className="text-[#07277F] font-semibold hover:underline"
            >
              Change Password
            </button>
          </div>

          {message && (
            <p className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {message}
            </p>
          )}

          {errorMessage && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </p>
          )}

          {showNamePopup && (
            <form
              onSubmit={handleProfileSubmit}
              className="p-6 border rounded-xl border-blue-200 animate-fadeIn"
            >
              <h2 className="font-bold text-[#07277F] mb-2 ml-2">
                Update Profile
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  value={profileName}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter new name"
                  className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
                />
                <input
                  type="text"
                  value={profilePhoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  disabled={updatingProfile}
                  className="w-full py-3 rounded-xl bg-[#07277F] text-white disabled:opacity-60"
                >
                  {updatingProfile ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          )}

          {showPasswordPopup && (
            <form
              onSubmit={handlePasswordSubmit}
              className="border border-blue-200 rounded-xl p-6 shadow-sm animate-fadeIn"
            >
              <h2 className="font-bold text-[#07277F] mb-2 ml-2">
                Update Password
              </h2>

              <div className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Current Password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
                  required
                />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="New Password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
                  required
                  minLength={6}
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  disabled={changingPassword}
                  className="w-full py-3 rounded-xl bg-[#07277F] text-white disabled:opacity-60"
                >
                  {changingPassword ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Setting;
