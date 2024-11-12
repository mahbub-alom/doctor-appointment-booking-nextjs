import React from "react";
import ListOnlineUsers from "./_components/ListOnlineUsers";
import CallNotification from "./_components/CallNotification";
import VideoCall from "./_components/VideoCall";

const MyAppointments = () => {
  return (
    <div>
      <ListOnlineUsers />
      <CallNotification />
      <VideoCall />
    </div>
  );
};

export default MyAppointments;
