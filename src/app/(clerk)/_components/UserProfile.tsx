"use client";

import { useUser } from "@clerk/nextjs";

const UserProfile = () => {
  const { isSignedIn, isLoading, user } = useUser();

  if (isLoading) return <p>Loading user data...</p>;
  if (!isSignedIn) return <p>Please log in to see your profile.</p>;

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
        <p><strong>Profile Picture:</strong> <img src={user?.profileImageUrl} alt="Profile" /></p>
      </section>

      {/* Account Settings Section */}
      <section>
        <h2>Account Settings</h2>
        <p><strong>Created At:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
        <p><strong>Last Active At:</strong> {new Date(user?.lastSignInAt).toLocaleDateString()}</p>
      </section>

      {/* Security Settings Section */}
      <section>
        <h2>Security Settings</h2>
        <p><strong>Two-Factor Authentication:</strong> {user?.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
        <p><strong>Primary Email Verified:</strong> {user?.emailAddresses[0]?.verified ? "Yes" : "No"}</p>
      </section>

      {/* Debugging: Show All User Data */}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserProfile;
