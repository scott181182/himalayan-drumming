"use client";

import { App, Button, Card, Divider, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { authClient } from "@/lib/client/auth";

interface FormInputs {
  email: string;
  password: string;
}
const FormItem = Form.Item<FormInputs>;

// oxlint-disable-next-line max-lines-per-function
export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormInputs>();

  const onFinish = useCallback(
    (values: FormInputs) => {
      authClient.signIn
        .email({
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          if (res.error) {
            console.error("Problem logging in:", res.error);
            message.error("There was a problem logging in");
          } else {
            router.push("/");
          }
        })
        .catch((error) => {
          console.error("Error logging in:", error);
          message.error("There was an error logging in");
        });
    },
    [message, router],
  );

  return (
    <div className="flex justify-center p-8">
      <Card className="max-w-md">
        <h1>Login</h1>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <FormItem
            name="email"
            label="Name"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Email must have correct format" },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password />
          </FormItem>
          <FormItem label={null}>
            <Button type="primary" htmlType="submit" block>
              Login with Email
            </Button>
          </FormItem>
        </Form>
        <Divider>or</Divider>
        <Button href="/signup" block>
          Sign Up
        </Button>
      </Card>
    </div>
  );
}
