import Image from "next/image";
import Link from "next/link";

// Define the interface for a doctor
interface Doctor {
  _id: string;
  image: string;
  categories: string[];
  name: string;
  year_of_experience: number;
  address: string;
}

// Define the interface for component props
interface DoctorListProps {
  doctorList: Doctor[];
  heading?: string;
}

const DoctorList = ({ doctorList, heading = "Popular Doctors" }: DoctorListProps) => {
  return (
    <div className="mb-10 px-8">
      <h2 className="font-bold text-xl text-center">{heading}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-4">
        {doctorList.length > 0
          ? doctorList.map((doctor, index) => (
              <div
                key={index}
                className="border-[1px] rounded-lg p-3 cursor-pointer hover:border-primary hover:shadow-sm transition-all ease-in-out"
              >
                <Image
                  className="h-[200px] object-contain w-full rounded-lg"
                  src={doctor.image}
                  alt="doctor"
                  width={500}
                  height={200}
                />
                <div className="mt-3 items-baseline flex flex-col gap-2">
                  <div>
                    {doctor.categories.map((category, index) => (
                      <span
                        key={index}
                        className="text-[10px] bg-blue-100 p-1 rounded-full px-2 text-primary inline-block mr-2"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-bold">{doctor.name}</h2>
                  <h2 className="text-primary text-sm">
                    {doctor.year_of_experience} +Years
                  </h2>
                  <h2 className="text-gray-500 text-sm">{doctor.address}</h2>
                  <Link href={"/details/" + doctor._id} className="w-full">
                    <h2 className="p-2 px-3 border-[1px] border-primary text-primary cursor-pointer rounded-full w-full text-center text-[11px] mt-2 hover:bg-primary hover:text-white">
                      Book Now
                    </h2>
                  </Link>
                </div>
              </div>
            ))
          : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(
              (item, index) => (
                <div
                  key={index}
                  className="h-[220px] bg-slate-200 w-full rounded-lg animate-pulse"
                ></div>
              )
            )}
      </div>
    </div>
  );
};

export default DoctorList;
