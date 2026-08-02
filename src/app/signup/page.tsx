"use client";

import { App, Button, Card, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { authClient } from "@/lib/auth-client";

interface FormInputs {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormInputs>();

  const onFinish = useCallback(
    (values: FormInputs) => {
      authClient.signUp
        .email({
          name: values.name,
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          if (res.error) {
            console.error("Problem signing up: ", res.error);
            message.error("There was a problem signing you up");
          } else {
            message.success(`Successfully made an account for '${values.email}'`);
            router.push("/");
          }
        })
        .catch((error) => {
          console.error("Error signing up:", error);
          message.error("There was an error signing you up");
        });
    },
    [message, router],
  );

  return (
    <div className="container flex justify-center p-8">
      <Card className="max-w-md" title="Sign Up">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Email must have correct format" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" block>
              Signup
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
