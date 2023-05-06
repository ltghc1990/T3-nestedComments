import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "~/utils/api";
import type { createUserInput } from "~/server/api/routers/userRouter";

const RegisterPage = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<createUserInput>();

  // const { mutate, error, isLoading } = api.user.registerUser.useMutation({
  //   onSuccess: () => {
  //     router.push("/login");
  //   },
  // });

  // const onSubmit = (values: createUserInput) => {
  //   mutate(values);
  // };
  return (
    <div>
      <h1 className=" styled my-4 text-xl font-semibold text-slate-800">
        Login
      </h1>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <input
          type="email"
          placeholder="jane.doe@example.com"
          {...register("email")}
        />
      </form> */}
      <Link href="/register">register</Link>
    </div>
  );
};

export default RegisterPage;
