import React, { useState } from "react";
import { Input, Button, Card, Spacer } from "@nextui-org/react";
import Link from "next/link";

import { EyeFilledIcon, EyeSlashFilledIcon } from "../common/icons";

import { useAppDispatch } from "@/redux/hooks";
import { loginRequest } from "@/components/user/redux/slices/user-slice";
import { validateEmail, validatePassword } from "@/utils/validation-utils";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  type ErrorType = {
    email: null | string;
    password: null | string;
  };
  const initialErrors: ErrorType = {
    email: null,
    password: null,
  };
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: ErrorType = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);

    const invalid = Object.values(newErrors).some((error) => error !== null);

    if (!invalid) dispatch(loginRequest(formData));
  };

  return (
    <Card className="m-auto	mt-[1%] min-w-[320px] max-w-[420px] max-h-[60%] w-[40%] p-6 border border-gray-200 rounded-lg">
      <h2 className="uppercase tracking-wide text-lg font-bold text-gray-700 pl-[10%]">
        Welcome to Todo App!!!
      </h2>
      <Spacer y={5} />
      <form onSubmit={handleSubmit}>
        <Input
          fullWidth
          color="secondary"
          label="Email"
          name="email"
          placeholder="abc@def.com"
          value={formData.email}
          variant="underlined"
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-700">*{errors.email}</p>}
        <Spacer y={1} />
        <Input
          fullWidth
          color="secondary"
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          id="password"
          label="Password"
          name="password"
          placeholder="******"
          type={isVisible ? "text" : "password"}
          value={formData.password}
          variant="underlined"
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-700">*{errors.password}</p>}
        <Spacer y={5} />
        <p className="text-center">
          Do not have an Account?{" "}
          <Link className="text-blue-700" href="/signup">
            SignUp
          </Link>
        </p>
        <Spacer y={5} />
        <Button fullWidth color="secondary" type="submit" variant="shadow">
          Log In
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
