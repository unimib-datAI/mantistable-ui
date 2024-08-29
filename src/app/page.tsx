import { Button } from "~/app/components/ui/button";
import Link from "next/link";
import logo from "public/images/MantisTableLogo.png";
import Image from "next/image";
import { IoIosArrowRoundForward } from "react-icons/io";

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen flex-row">
      <div className="flex flex-1 flex-col items-start justify-center">
        <div className="p-16">
          <div className="flex min-h-[16rem] max-w-[20rem] flex-col justify-between">
            <div className="flex flex-col">
              <h1 className="text-6xl font-bold text-mantis-green-400">
                MantisTable
              </h1>
              <p className="w-full text-3xl font-normal text-mantis-green-700">
                A Graphic User Interface for Semantic Table Interpretation
              </p>
            </div>
            <Link href="/mantis/home">
              <Button
                className="flex flex-row gap-2 self-start bg-mantis-green-300 p-4 text-mantis-black-200 hover:bg-mantis-green-400 hover:text-white"
                variant="destructive"
              >
                Get Started
                <IoIosArrowRoundForward size={24} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col justify-center bg-mantis-green-200">
        <Image
          priority
          className="h-230 w-230 absolute -left-40"
          src={logo}
          alt="Logo"
          width={650}
          height={650}
        />
      </div>
    </div>
  );
}
