"use client";
import DoctorList from "@/app/_components/DoctorList";
import GlobalApi from "@/app/_utils/GlobalApi";
import React, { use, useEffect, useState } from "react";

const Search = ({ params }) => {
  const resolveParams = use(params);
  const { cname } = resolveParams;

  const [doctorList, setDoctorList] = useState([]);

  const getDoctor = () => {
    GlobalApi.getDoctorByCategory(cname).then((resp) => {
      setDoctorList(resp.data);
    });
  };

  useEffect(() => {
    getDoctor();
  }, []);

  return (
    <div className="mt-5">
      <DoctorList doctorList={doctorList} heading={cname} />
    </div>
  );
};

export default Search;
