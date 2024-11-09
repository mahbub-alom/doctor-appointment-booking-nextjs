"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingList from "./_components/BookingList";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useUser } from "@clerk/nextjs";

const MyBooking = () => {
  const { user } = useUser();
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    getUserBookingList();
  }, []);

  const getUserBookingList = () => {
    GlobalApi.getUserBookingList(user?.primaryEmailAddress?.emailAddress).then(
      (resp) => {
        setBookingList(resp?.data);
      }
    );
  };

  const filterUserBookingList = (type) => {
    const result = bookingList.filter((item) =>
      type == "upcoming"
        ? new Date(item.Date) >= new Date()
        : new Date(item.Date) <= new Date()
    );
    return result;
  };

  const handleDeleteBooking = (deletedId) => {
    setBookingList((prevList) =>
      prevList.filter((item) => item._id !== deletedId)
    );
  };

  return (
    <div className="px-4 sm:px-10 mt-10">
      <h2 className="font-bold text-2xl">My Booking</h2>
      <Tabs defaultValue="upcoming" className="w-full mt-5">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <BookingList
            bookingList={filterUserBookingList("upcoming")}
            expired={false}
            onDeleteBooking={handleDeleteBooking}
          />
        </TabsContent>
        <TabsContent value="expired">
          <BookingList
            bookingList={filterUserBookingList("expired")}
            expired={true}
            onDeleteBooking={handleDeleteBooking}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyBooking;
