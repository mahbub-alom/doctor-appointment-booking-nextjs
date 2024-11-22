// "use client";
import DoctorList from "@/app/_components/DoctorList";
import GlobalApi from "@/app/_utils/GlobalApi";
import React, { useEffect, useState } from "react";

// Define an interface for the params prop
// interface SearchParams {
//   cname: string;
// }

// // Define the component props interface
// interface SearchProps {
//   params: SearchParams;
// }

// Updated Doctor interface to match the expected properties
interface Doctor {
  _id: string;
  name: string;
  experience: number;
  category: string;
  address: string;
  image: string;
  categories: string[];
  year_of_experience: number;
  // Add other doctor properties as needed based on your API response
}

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const slug = (await params).slug;
//   return <div>My Post: {slug}</div>;
// }

const Search = async ({ params }: { params: Promise<{ cname: string }> }) => {
  const cname = (await params).cname;
  const getDoctor = await GlobalApi.getDoctorByCategory(cname)
    .then((resp) => resp.data)
    .catch((error) => {
      console.log("error fetching search doctor data", error);
      return null;
    });

  return (
    <div className="mt-5">
      {getDoctor && <DoctorList doctorList={getDoctor} heading={cname} />}
    </div>
  );
};

export default Search;
