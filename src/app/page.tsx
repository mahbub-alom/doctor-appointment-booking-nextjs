"use client";
import CategorySearch from "./_components/CategorySearch";
import Hero from "@/app/_components/Hero";
import DoctorList from "@/app/_components/DoctorList";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useEffect, useState } from "react";

export default function Home() {
  const [doctorList, setDoctorList] = useState([]);

  useEffect(() => {
    getDoctorList();
  }, []);

  const getDoctorList = () => {
    GlobalApi.getDoctorList().then((resp) => setDoctorList(resp.data));
  };

  return (
    <div>
      {/* hero section */}
      <Hero />

      {/* category search  */}
      <CategorySearch />

      {/* popular doctor list  */}

      <DoctorList doctorList={doctorList} />
    </div>
  );
}
