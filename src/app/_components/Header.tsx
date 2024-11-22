"use client";
import { Button } from "@/components/ui/button";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GlobalApi from "@/app/_utils/GlobalApi";

const Header = () => {
  const router = useRouter();
  const { userId, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [databaseUser, setDatabaseUser] = useState(false);

  useEffect(() => {
    const fetchDatabaseUser = async () => {
      if (isSignedIn && userLoaded && user?.primaryEmailAddress?.emailAddress) {
        setLoading(true);
  
        try {
          const email = user.primaryEmailAddress.emailAddress;
          
          // Create a UserInfo object with all required properties
          const userInfo = {
            email: email,
            name: user.fullName || user.firstName || '', // Add name from user object
            // Add any other required fields from the UserInfo type
          };
          
          await GlobalApi.userStore(userInfo);
          const response = await GlobalApi.getUserStore(email);
  
          setDatabaseUser(response?.data?.doctor);
        } catch (error) {
          console.error("Error fetching or storing database user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
  
    fetchDatabaseUser();
  }, [isSignedIn, userLoaded, user]);
  
  

  if (loading) {
    return <div>Loading.....</div>;
  }

  const Menu = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "Explore", path: "/explore" },
    { id: 3, name: "Contact Us", path: "/contactUs" },
  ];

  return (
    <div className="flex items-center justify-between p-4 shadow-sm">
      <div className="flex items-center gap-10">
        <Image src="/logo.svg" alt="logo" width={50} height={50} />
        <ul className="md:flex gap-8 hidden">
          {Menu.map((item) => (
            <Link href={item.path} key={item.id}>
              <li className="hover:text-primary hover:scale-105 transition-all ease-in-out cursor-pointer">
                {item.name}
              </li>
            </Link>
          ))}

          {userId &&
            (databaseUser ? (
              <Link
                href="/my-appointments"
                className="hover:text-primary hover:scale-105 transition-all ease-in-out cursor-pointer"
              >
                My Appointments
              </Link>
            ) : (
              <Link
                href="/my-booking"
                className="hover:text-primary hover:scale-105 transition-all ease-in-out cursor-pointer"
              >
                My Booking
              </Link>
            ))}
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
