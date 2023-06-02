import Image from "next/image";
import React from "react";

type ProfileImageProps = {
  src?: string | null;
  className?: string;
};
export const ProfileImage = ({ src, className = "" }: ProfileImageProps) => {
  return (
    <div
      className={`relative h-12 w-12 overflow-auto rounded-full ${className}`}
    >
      {src == null ? null : (
        <Image src={src} alt="Profile Image" quality={100} fill />
      )}
    </div>
  );
};
