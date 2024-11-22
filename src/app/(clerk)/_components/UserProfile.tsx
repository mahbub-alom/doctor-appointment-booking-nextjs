"use client";

import { useUser } from "@clerk/nextjs";

const UserProfile = () => {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) return <p>Loading user data...</p>;
  if (!isSignedIn) return <p>Please log in to see your profile.</p>;

  // Helper function to safely format dates
  const formatDate = (date: Date | null | undefined) => {
    return date ? new Date(date).toLocaleDateString() : "Not available";
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>

      {/* Personal Information Section */}
      <section>
        <h2>Personal Information</h2>
        <p><strong>Full Name:</strong> {user?.fullName}</p>
        <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Phone Number:</strong> {user?.phoneNumbers[0]?.phoneNumber}</p>
        <p><strong>Profile Picture:</strong> <img src={user?.imageUrl} alt="Profile" /></p>
      </section>

      {/* Account Settings Section */}
      <section>
        <h2>Account Settings</h2>
        <p><strong>Created At:</strong> {formatDate(user?.createdAt)}</p>
        <p><strong>Last Active At:</strong> {formatDate(user?.lastSignInAt)}</p>
      </section>

      {/* Security Settings Section */}
      <section>
        <h2>Security Settings</h2>
        <p><strong>Two-Factor Authentication:</strong> {user?.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
        <p><strong>Primary Email Verified:</strong> {user?.emailAddresses[0]?.verification?.status === "verified" ? "Yes" : "No"}</p>
      </section>

      {/* Debugging: Show All User Data */}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserProfile;