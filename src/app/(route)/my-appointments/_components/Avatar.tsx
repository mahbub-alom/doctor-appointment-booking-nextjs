import Image from "next/image";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";

const Avatar = ({ src }: { src?: string }) => {
  if (src) {
    return (
      <Image
        src={src}
        height={40}
        width={40}
        alt="avatar"
        className="rounded-full"
      />
    );
  }
  return <FaRegUserCircle size={24} />;
};

export default Avatar;