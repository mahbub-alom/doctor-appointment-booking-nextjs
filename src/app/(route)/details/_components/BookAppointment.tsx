import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";

const BookAppointment = ({ doctor }: { doctor: { name: string } }) => {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState<{ time: string }[]>([]);
  const [note, setNote] = useState<string | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    string | undefined
  >();
  const { user } = useUser();
  useEffect(() => {
    getTime();
  }, []);

  const getTime = () => {
    const timeList = [];
    for (let i = 10; i <= 12; i++) {
      timeList.push({
        time: i + ":00 AM",
      });
      timeList.push({
        time: i + ":30 AM",
      });
    }
    for (let i = 1; i <= 6; i++) {
      timeList.push({
        time: i + ":00 PM",
      });
      timeList.push({
        time: i + ":30 PM",
      });
    }

    setTimeSlot(timeList);
  };

  // UserName: user?.fullName,
  // Email: user?.primaryEmailAddress?.emailAddress,
  // Time: selectedTimeSlot,
  // Date: date,
  // Note: note,
  // doctorId: doctor?._id,

  const saveBooking = () => {
    const formattedDate = date.toLocaleDateString("en-CA");
    const data = {
      UserName: user?.fullName,
      Email: user?.primaryEmailAddress?.emailAddress,
      Time: selectedTimeSlot,
      Date: formattedDate,
      Note: note,
      doctorId: doctor?.name,
    };
    GlobalApi.bookAppointment(data)
      .then((resp) => {
        if (resp) {
          toast("Booking confirmation sent to your email.");
        }
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
        toast("Failed to book appointment. Please try again.");
      });
  };

  const isPastDay = (day: Date) => {
    return day < new Date();
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <span className="mt-3 rounded-full inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white cursor-pointer">
            Book Appointment
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription asChild>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                  {/* calendar */}
                  <div className="flex flex-col gap-3 items-baseline">
                    <h2 className="flex gap-2 items-center">
                      <CalendarDays className="text-primary h-5 w-5" />
                      Select Date
                    </h2>
                    <Calendar
                      mode="single"
                      selected={date}
                      disabled={isPastDay}
                      onSelect={(day) => {
                        if (day) setDate(day);
                      }}
                      className="rounded-md border"
                    />
                  </div>
                  {/* time slot  */}
                  <div className="mt-3 md:mt-0">
                    <h2 className="flex gap-2 items-center mb-3">
                      <Clock className="text-primary h-5 w-5" />
                      Select Time Slot
                    </h2>
                    <div className="grid grid-cols-3 gap-2 border rounded-lg p-2">
                      {timeSlot?.map((item, index) => (
                        <h2
                          key={index}
                          onClick={() => setSelectedTimeSlot(item?.time)}
                          className={`p-2 border cursor-pointer
                            text-center hover:bg-primary hover:text-white
                            rounded-full
                            ${
                              item.time == selectedTimeSlot &&
                              "bg-primary text-white"
                            }`}
                        >
                          {item.time}
                        </h2>
                      ))}
                    </div>
                  </div>
                </div>
                <Textarea
                  className="mt-3"
                  placeholder="Note"
                  onChange={(e) => setNote(e?.target?.value)}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                className="text-red-500 border-red-500"
                variant="outline"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={!(date && selectedTimeSlot)}
              onClick={() => saveBooking()}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment;
