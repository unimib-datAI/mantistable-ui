import { cn } from "~/lib/utils";
import Image from "next/image";
import logo from "public/images/MantisTableLogo.png";

export type LogoProps = React.HTMLAttributes<HTMLDivElement> & {};
export const Logo = (logoProps: LogoProps) => {
  const { className, ...props } = logoProps;
  return (
    <Image
      className={cn("h-[4rem] w-[4rem] p-2", className)}
      src={logo}
      alt="logo"
      width={40}
      height={40}
      {...props}
    />
  );
};
