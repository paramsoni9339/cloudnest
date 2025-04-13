"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log({ accountId, password });

    try {
      const sessionId = await verifySecret({ accountId, password });

      console.log({ sessionId });

      if (sessionId) router.push("/");
    } catch (error) {
      console.log("Failed to verify OTP, Pls check", error);
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="glass-card border-white/10 bg-white/5 backdrop-blur-md">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center text-white">
            Enter Your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-white/70">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot glass-card border-white/10 bg-white/5 backdrop-blur-md" />
            <InputOTPSlot index={1} className="shad-otp-slot glass-card border-white/10 bg-white/5 backdrop-blur-md" />
            <InputOTPSlot index={2} className="shad-otp-slot glass-card border-white/10 bg-white/5 backdrop-blur-md" />
            <InputOTPSlot index={3} className="shad-otp-slot glass-card border-white/10 bg-white/5 backdrop-blur-md" />
            <InputOTPSlot index={4} className="shad-otp-slot glass-card border-white/10 bg-white/5 backdrop-blur-md" />
            <InputOTPSlot index={5} className="shad-otp-slot glass-card border-white/10 bg-white/5 backdrop-blur-md" />
          </InputOTPGroup>
        </InputOTP>

        <div className="flex w-full flex-col gap-4">
          <AlertDialogAction
            onClick={handleSubmit}
            className="glass-card border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white h-12"
            type="button"
          >
            Submit
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </AlertDialogAction>

          <div className="subtitle-2 mt-2 text-center text-white/70">
            Didn&apos;t get a code?
            <Button
              type="button"
              variant="link"
              className="pl-1 text-brand"
              onClick={handleResendOtp}
            >
              Click to resend
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
