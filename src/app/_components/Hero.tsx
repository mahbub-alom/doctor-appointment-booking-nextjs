import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
            <Image
              alt="doctors"
              src="/doctors.jpg"
              className="absolute inset-0 h-full w-full object-cover rounded-xl"
              width={800}
              height={800}
            />
          </div>

          <div className="lg:py-24">
              <h2 className="text-3xl font-bold sm:text-4xl">Find & Book <span className='text-primary'>Appointment</span> with your Fav <span className='text-primary'>Doctors</span></h2>
      
              <p className="mt-4 text-gray-600">
              our dedicated team of expert doctors spans a wide range of medical fields. Our collaborative approach ensures that no matter the complexity of your condition, you have access to the expertise and care you deserve—all under one roof.
              </p>
      
            <Button className="mt-10">Explore Now</Button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
