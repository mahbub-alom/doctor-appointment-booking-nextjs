"use client";
import { Button } from "@/components/ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { userId } = useAuth();
  // const {user} = useUser();

  const Menu = [
    {
      id: 1,
      name: "Home",
      path: "/",
    },
    {
      id: 2,
      name: "Explore",
      path: "/explore",
    },
    {
      id: 3,
      name: "Contact Us",
      path: "/contactUs",
    },
  ];

  return (
    <div className="flex items-center justify-between p-4 shadow-sm">
      <div className="flex items-center gap-10">
        <Image src="/logo.svg" alt="logo" width={50} height={50} />
        <ul className="md:flex gap-8 hidden">
          {Menu.map((item, index) => (
            <Link href={item.path} key={index}>
              <li className="hover:text-primary hover:scale-105 transition-all ease-in-out cursor-pointer">
                {item.name}
              </li>
            </Link>
          ))}
          {userId && (
            <Link href={'/my-booking'} className="hover:text-primary hover:scale-105 transition-all ease-in-out cursor-pointer">
              My Booking
            </Link>
          )}
        </ul>
      </div>
      <div className="flex gap-3 items-center">
        <UserButton />
        {!userId && (
          <>
            <Button
              onClick={() => router.push("/sign-in")}
              size="sm"
              variant="outline"
            >
              Sign In
            </Button>
            <Button onClick={() => router.push("/sign-up")} size="sm">
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
