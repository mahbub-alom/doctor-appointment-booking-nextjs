"use client";
import React from "react";
import { useSocket } from "../../../../context/SocketContext";
import { useUser } from "@clerk/nextjs";
import Avatar from "./_components/Avatar";

const MyAppointments = () => {
  const { user } = useUser();
  const { onlineUsers } = useSocket();
  return (
    <div className="flex items-center pb-2 border-b border-b-primary/10 w-full">
      {onlineUsers &&
        onlineUsers.map((onlineUser) => {
          if (onlineUser.profile.id === user?.id) return null;
          return (
            <div key={onlineUser.userId} className="flex flex-col items-center cursor-pointer gap-1">
              <Avatar src={onlineUser?.profile?.imageUrl} />
              <div className="text-sm">{onlineUser.profile.fullName}</div>
            </div>
          );
        })}
    </div>
  );
};

export default MyAppointments;
