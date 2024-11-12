import React from "react";
import ListOnlineUsers from "./_components/ListOnlineUsers";
import CallNotification from "./_components/CallNotification";

const MyAppointments = () => {
  return (
    <div>
      <ListOnlineUsers />
      <CallNotification/>
    </div>
  );
};

export default MyAppointments;
