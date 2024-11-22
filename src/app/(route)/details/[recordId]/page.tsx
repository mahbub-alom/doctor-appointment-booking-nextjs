import { Metadata } from "next";
import GlobalApi from "@/app/_utils/GlobalApi";
import React from "react";
import DoctorDetails from "../_components/DoctorDetails";
import DoctorSuggestionList from "../_components/DoctorSuggestionList";

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const slug = (await params).slug;
//   return <div>My Post: {slug}</div>;
// }
// Updated type definition for Next.js page props
// type Props = {
//   params: {
//     recordId: string;
//   };
//   searchParams: { [key: string]: string | string[] | undefined };
// };

// Add metadata generation
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   return {
//     title: `Doctor Details - ${params.recordId}`,
//   };
// }
const Details = async ({
  params,
}: {
  params: Promise<{ recordId: number | string }>;
}) => {
  const recordId = (await params).recordId;

  const doctor = await GlobalApi.getDoctorById(recordId)
    .then((resp) => resp.data)
    .catch((error) => {
      console.error("Error fetching doctor data:", error);
      return null;
    });

  return (
    <div className="p-5 md:px-20">
      <h2 className="font-bold text-[22px]">Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4">
        <div className="col-span-3">
          {doctor && <DoctorDetails doctor={doctor} />}
        </div>
        <div>
          <DoctorSuggestionList />
        </div>
      </div>
    </div>
  );
};

export default Details;
