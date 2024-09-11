import React from "react";
import { Button, Checkbox, Form, Input, Typography, Flex, message } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import axios from "axios";
import { auth } from "@/config/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth"; // Import Firebase's signInWithCustomToken

const AUTH_USER_PORT = import.meta.env.VITE_AUTH_USER_PORT;

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values: { email: string; password: string }) => {
    console.log("Login attempt:", values);

    try {
      // Send a request to your backend for login and custom token generation
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}/api/auth/login`,
        {
          email: values.email,
          password: values.password,
        },
      );

      if (response.data.success) {
        const { customToken, role } = response.data.data;

        if (role !== "player") {
          // If the user is not an admin, show an error message and do not proceed
          message.error("Invalid credentials");
          return; // Prevent further execution
        }

        // Use Firebase's signInWithCustomToken to sign the user in
        await signInWithCustomToken(auth, customToken);

        message.success("Login successful!");
        navigate("/"); // Navigate after successful login
      } else {
        // Handle backend login failure
        message.error(
          response.data.message || "Login failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className={styles["login-form"]}
      form={form}
    >
      <Title level={1} className="text-center">
        Log in to your account
      </Title>

      <Form.Item
        label="Email"
        name="email"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          { required: true, message: "Email must not be empty!" },
          { type: "email", message: "Email is invalid!" },
        ]}
      >
        <Input
          className={`mb-1.5 ${styles["input-style"]}`}
          placeholder="Enter your email"
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "Password must not be empty!",
          },
          {
            min: 6,
            message: "Password must be at least 6 characters!",
          },
        ]}
      >
        <Input.Password
          className={`mb-1 ${styles["input-style"]}`}
          placeholder="Enter your password"
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Flex className="mt-3" justify="space-between">
          <Checkbox>Remember me</Checkbox>
          <span
            style={{ fontWeight: "500", cursor: "pointer" }}
            onClick={() => navigate("/auth/forgot-password")}
          >
            Forgot password ?
          </span>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className={`${styles["btn-style"]} justify-center"`}
          block
        >
          Log in to your account
        </Button>
      </Form.Item>

      <Flex className="!mt-6" justify="center" gap="small">
        <span className={styles[""]}>Not registered yet?</span>
        <span
          style={{ fontWeight: "600", cursor: "pointer" }}
          onClick={() => navigate("/auth/register")}
        >
          Create an account
        </span>
      </Flex>
    </Form>
  );
};

export default LoginForm;
