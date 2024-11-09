import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

const getCategory = () => axiosClient.get("/category");
const getDoctorList = () => axiosClient.get("/doctor");
const getDoctorByCategory = (category) =>
  axiosClient.get(`/doctor/${category}`);
const getDoctorById = (id) => axiosClient.get(`/doctors/${id}`);
const bookAppointment = (data) => axiosClient.post("/appointments", data);
const getUserBookingList = (userEmail) =>axiosClient.get(`/booking/${userEmail}`);
const deleteBooking = (id) =>axiosClient.delete(`/booking/${id}`);

export default {
  getCategory,
  getDoctorList,
  getDoctorByCategory,
  getDoctorById,
  bookAppointment,
  getUserBookingList,
  deleteBooking
};
