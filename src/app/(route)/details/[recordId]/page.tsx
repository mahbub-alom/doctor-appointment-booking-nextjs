"use client";
import GlobalApi from "@/app/_utils/GlobalApi";
import React, { use, useEffect, useState } from "react";
import DoctorDetails from "../_components/DoctorDetails";
import DoctorSuggestionList from "../_components/DoctorSuggestionList";

const Details = ({ params }) => {
  const { recordId } = use(params);
  const [doctor, setDoctor] = useState([]);
  useEffect(() => {
    if (recordId) {
      getDoctorById();
    }
  }, [recordId]);

  const getDoctorById = () => {
    GlobalApi.getDoctorById(recordId)
      .then((resp) => {
        setDoctor(resp.data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
      });
  };

  return (
    <div className="p-5 md:px-20">
      <h2 className="font-bold text-[22px]">Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* doctor details */}
        <div className="col-span-3">
          {doctor && <DoctorDetails doctor={doctor} />}
        </div>
        {/* doctor suggestions */}
        <div>
          <DoctorSuggestionList />
        </div>
      </div>
    </div>
  );
};

export default Details;
