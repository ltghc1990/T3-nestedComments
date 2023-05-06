import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "~/utils/api";
import type { createUserInput } from "~/server/api/routers/userRouter";

const RegisterPage = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<createUserInput>();

  const { mutate, error, isLoading } = api.user.registerUser.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
  });

  const onSubmit = (values: createUserInput) => {
    mutate(values);
  };
  return (
    <div className="flex flex-col">
      <h1 className=" my-4 text-xl font-semibold text-slate-800">Register</h1>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <input
          type="email"
          placeholder="jane.doe@example.com"
          {...register("email")}
        />
        <input type="text" placeholder="Tom" {...register("name")} />
        <div>
          <button className=" inline-block" type="submit">
            Register
          </button>
        </div>
      </form>
      <Link href="/login">Login</Link>
    </div>
  );
};

export default RegisterPage;
