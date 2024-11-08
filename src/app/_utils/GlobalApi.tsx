import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

const getCategory = () => axiosClient.get("/category");
const getDoctorList = () => axiosClient.get("/doctor");
const getDoctorByCategory = (category) => axiosClient.get(`/doctor/${category}`);
const getDoctorById = (id) => axiosClient.get(`/doctors/${id}`);


export default {
  getCategory,
  getDoctorList,
  getDoctorByCategory,
  getDoctorById
};
