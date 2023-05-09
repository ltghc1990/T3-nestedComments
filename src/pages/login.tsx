import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "~/utils/api";
import type { createUserInput } from "~/server/api/routers/userRouter";

const RegisterPage = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { handleSubmit, register } = useForm<createUserInput>();

  // const { data, error } = api.user.loginUser.useQuery({
  //   email: "ltgdrgn@gmail.com",
  // });

  const onSubmit = (values: createUserInput) => {};
  return (
    <div>
      <h1 className=" styled my-4 text-xl font-semibold text-slate-800">
        Login
      </h1>
      {/* <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        {success && <p>Check your email</p>}
        <input
          className="styled-input px-2"
          type="email"
          placeholder="jane.doe@example.com"
          {...register("email")}
        />
        <div className="mt-4">
          <button className="btn" type="submit">
            Login
          </button>
        </div>
      </form> */}
      <Link href="/register">register</Link>
    </div>
  );
};

export default RegisterPage;
