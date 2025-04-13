"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface Props {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
      {/* Small Logo */}
      <div className="flex items-center">
        <Image
          src="/assets/icons/logo-small.svg"
          alt="logo"
          width={50}
          height={50}
          className=" w-auto"
        />
      </div>

      {/* Menu Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-2">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </SheetTrigger>
        <SheetContent side="right" className="w-full p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <Image
                  src={avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{fullName}</p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map(({ url, name, icon }) => (
                  <Link key={name} href={url}>
                    <li
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                        pathname === url
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        width={20}
                        height={20}
                        className={cn(
                          "w-5 h-5",
                          pathname === url ? "opacity-100" : "opacity-60"
                        )}
                      />
                      <span className="text-sm font-medium">{name}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-border/40 space-y-4">
              <FileUploader ownerId={ownerId} accountId={accountId} />
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={async () => await signOutUser()}
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logout"
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-60"
                />
                <span className="text-sm font-medium">Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
