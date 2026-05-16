import { useState } from "react";
import type { ChangeEvent } from "react";

function Setting() {
  const [image, setImage] = useState("https://i.pravatar.cc/150?img=12");

  // ✅ by default Settings open
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // ✅ Save handler

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* Main Container */}
      <div className="w-full max-w-106 min-h-screen bg-white  overflow-hidden">
        {/* Header */}
        <div className="bg-[#07277F] h-52 flex items-center justify-center rounded-b-[40px]">
          <h1 className="text-white text-3xl font-bold">Profile Settings</h1>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center -mt-16 px-6">
          <div className="relative">
            <img
              src={image}
              alt="profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
            />

            <label
              htmlFor="fileUpload"
              className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#07277F] text-white flex items-center justify-center cursor-pointer"
            >
              ✏️
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
            Mr. Hasan Rohaman Tarek
          </h2>

          <p className="text-gray-500 text-sm">Edit your profile information</p>
        </div>

        {/* Form */}
        <div className="px-6 py-8 space-y-6">
          {/* Buttons */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setShowNamePopup(true);
                setShowPasswordPopup(false);
              }}
              className="text-[#07277F] font-semibold hover:underline "
            >
              Settings
            </button>

            <button
              onClick={() => {
                setShowPasswordPopup(true);
                setShowNamePopup(false);
              }}
              className="text-[#07277F] font-semibold hover:underline"
            >
              Change Password
            </button>
          </div>

          {/* Name Form */}
          {showNamePopup && (
            <div className="p-6 border rounded-xl border-blue-200 animate-fadeIn">
              <h2 className="font-bold text-[#07277F] mb-2 ml-2">
                Update Name
              </h2>

              <input
                type="text"
                placeholder="Enter new name"
                className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
              />

              <div className="flex gap-3 mt-6">
                <button className="w-full py-3 rounded-xl bg-[#07277F] text-white">
                  Update
                </button>
              </div>
            </div>
          )}

          {/* Password Form */}
          {showPasswordPopup && (
            <div className="border border-blue-200 rounded-xl p-6 shadow-sm animate-fadeIn">
              <h2 className="font-bold text-[#07277F] mb-2 ml-2">
                Update Password
              </h2>

              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-xl bg-white border outline-none focus:ring-2 focus:ring-[#07277F]"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button className="w-full py-3 rounded-xl bg-[#07277F] text-white">
                  Update
                </button>
              </div>
            </div>
          )}

          {/* Save */}
        </div>
      </div>
    </div>
  );
}

export default Setting;
