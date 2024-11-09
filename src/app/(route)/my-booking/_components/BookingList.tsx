import React from "react";
import moment from "moment";
import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import CancelAppointment from "./CancelAppointment";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";

const BookingList = ({ bookingList, expired, onDeleteBooking }) => {
  const handleDelete = (item) => {
    console.log(item);
    GlobalApi.deleteBooking(item?._id)
      .then((resp) => {
        if (resp.data.deletedCount > 0) {
          onDeleteBooking(item._id);
          toast("Booking Deleted Successfully");
        } else {
          toast("Failed to delete booking");
        }
      })
      .catch((error) => {
        console.error("Error deleting booking:", error);
        toast("Error deleting booking");
      });
  };
  return (
    <div>
      {bookingList.length > 0 ? (
        bookingList.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 items-center border p-5 m-3 rounded-lg"
          >
            <Image
              src={item?.doctorImage}
              width={70}
              height={70}
              className="rounded-full h-[70px] w-[70px] object-cover"
              alt="doctor image"
            />
            <div className="flex flex-col gap-2 w-full">
              <h2 className="font-bold text-[18px] items-center flex justify-between">
                {item?.doctorId}
                {!expired && (
                  <CancelAppointment
                    onContinueClick={() => handleDelete(item)}
                  />
                )}
              </h2>
              <h2 className="flex gap-2 text-gray-500">
                <MapPin className="text-primary h-5 w-5" />
                {item?.doctorAddress}
              </h2>
              <h2 className="flex gap-2">
                <Calendar className="text-primary h-5 w-5" /> Appointment On:
                {moment(item?.Date).format("DD-MMM-YYYY")}{" "}
              </h2>
              <h2 className="flex gap-2">
                <Clock className="text-primary h-5 w-5" /> At Time :{" "}
                {item?.Time}{" "}
              </h2>
            </div>
          </div>
        ))
      ) : (
        <div className="h-[150px] w-full bg-slate-100 animate-pulse rounded-lg"></div>
      )}
    </div>
  );
};

export default BookingList;
