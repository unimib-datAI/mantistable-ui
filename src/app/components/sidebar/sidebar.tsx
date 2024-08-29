"use client";

import { FaTable } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";
import { SidebarButton } from "./sidebarButton";
import { useState } from "react";
import * as React from "react";
import { cn } from "~/lib/utils";

export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {};

export const Sidebar = (sidebarProps: SidebarProps) => {
  const { className, ...props } = sidebarProps;
  const [selected, setSelected] = useState<number>(0);
  const sidebarItems: { icon: React.ReactNode; link: string }[] = [
    {
      icon: <FaTable className="text-white" size={24} />,
      link: "/mantis/home",
    },
    {
      icon: <HiPlus className="text-white" size={24} />,
      link: "/mantis/home/upload",
    },
  ];

  return (
    <div className={cn("flex h-full w-full flex-col", className)} {...props}>
      {sidebarItems.map((item, index) => {
        return (
          <SidebarButton
            key={index}
            icon={item.icon}
            link={item.link}
            index={index}
            isButtonSelected={selected == index}
            action={setSelected}
          />
        );
      })}
    </div>
  );
};
