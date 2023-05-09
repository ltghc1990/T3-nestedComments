import React from "react";
import Link from "next/link";

const blog = () => {
  return (
    <div>
      <Link href={"/posts/new"}>Create Post</Link>
    </div>
  );
};

export default blog;
