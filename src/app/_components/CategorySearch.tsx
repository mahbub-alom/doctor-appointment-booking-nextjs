"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import GlobalApi from "@/app/_utils/GlobalApi";
import Image from "next/image";
import Link from "next/link";

// Define the interface for category item
interface Category {
  name: string;
  icon: string;
}

const CategorySearch = () => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () =>
    GlobalApi.getCategory().then((resp) => {
      setCategoryList(resp.data);
    });

  return (
    <div className="mb-10 items-center flex flex-col gap-2">
      <h2 className="font-bold text-4xl tracking-wide">
        Search <span className="text-primary">Doctors</span>
      </h2>
      <h2 className="text-gray-500 text-xl px-3">
        Search Your Doctor and Book Appointment in one click
      </h2>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Search..." />
        <Button type="submit">
          <Search />
          Search
        </Button>
      </div>
      <div>
        {/* display list of category */}
        <div className="grid grid-cols-3 mt-5 md:grid-cols-4 lg:grid-cols-6 ">
          {categoryList?.length > 0
            ? categoryList.map(
                (item, index) =>
                  index < 10 && (
                    <Link
                      href={"/search/" + item.name}
                      key={index}
                      className="flex flex-col text-center gap-2 items-center p-5 bg-blue-50 m-2 rounded-lg hover:scale-110 transition-all ease-in-out cursor-pointer"
                    >
                      <Image
                        src={item.icon}
                        width={40}
                        height={40}
                        alt="icon"
                      />
                      <label className="text-blue-600 text-sm">
                        {item.name}
                      </label>
                    </Link>
                  )
              )
            : [1, 2, 3, 4, 5, 6].map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-200 m-2 w-[130px] h-[120px] rounded-lg animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySearch;