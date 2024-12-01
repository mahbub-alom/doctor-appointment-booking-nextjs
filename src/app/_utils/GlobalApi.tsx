import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "https://doctor-appointment-booking-web-app.netlify.app/api",
// });
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
});
// const axiosClient = axios.create({
//   baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
// });


interface AppointmentData {
  UserName: string | null;
  Email: string | undefined;
  Time: string | undefined;
  Date: string;
  Note: string | undefined;
  doctorId: string;
  doctorImage: string;
  doctorAddress: string;
}

interface UserInfo {
  name: string;
  email: string;
}

const getCategory = () => axiosClient.get("/category");
const getDoctorList = () => axiosClient.get("/doctor");
const getDoctorByCategory = (category: string) =>
  axiosClient.get(`/doctor/${category}`);
const getDoctorById = (id: string | number) =>
  axiosClient.get(`/doctors/${id}`);
const bookAppointment = (data: AppointmentData) =>
  axiosClient.post("/appointments", data);
const getUserBookingList = (userEmail: string) =>
  axiosClient.get(`/booking/${userEmail}`);
const deleteBooking = (id: string | number) =>
  axiosClient.delete(`/booking/${id}`);
const userStore = (userinfo: UserInfo) => axiosClient.post("/user", userinfo);
const getUserStore = (userEmail: string) =>
  axiosClient.get(`/users/doctor/${userEmail}`);

export default {
  getCategory,
  getDoctorList,
  getDoctorByCategory,
  getDoctorById,
  bookAppointment,
  getUserBookingList,
  deleteBooking,
  userStore,
  getUserStore,
};
