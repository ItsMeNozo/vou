import React from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.css";
import axios from "axios";

const { Title } = Typography;

const VerifyOTPForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values: { email: string; otp: Int16Array }) => {
    try {
      console.log(values);

      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}/api/auth/verify-otp`,
        {
          email: values.email,
          otp: values.otp,
        },
      );

      if (response.data.success) {
        message.success("Sign up successful! Please log in again");
        navigate("/auth/login");
      } else {
        message.error("Verify OTP failed. Please try again.");
        console.error("Verify OTP failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during verify OTP:", error);
      message.error("An error occurred during verify OTP.");
    }
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className={`${styles["register-form"]} !my-8`}
      form={form}
    >
      <Title level={2} className="!text-left">
        Verify OTP
      </Title>
      {/* Email */}
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Email is required" },
          { type: "email", message: "Please enter a valid email" },
        ]}
        initialValue={localStorage.getItem("email-on-process-verify-otp")}
      >
        <Input disabled={true} placeholder="Email address" />
      </Form.Item>

      {/* OTP number */}
      <Form.Item name="otp" rules={[{ required: true }]}>
        <Input placeholder="OTP" />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full" block>
          Submit
        </Button>
      </Form.Item>
      <div style={{ display: "flex", justifyContent: "center", gap: "small" }}>
        <span className="mr-2">Is this information incorrect?</span>

        <span
          style={{ fontWeight: "600", cursor: "pointer" }}
          onClick={() => navigate("/auth/register", { replace: false })}
        >
          Change
        </span>
      </div>
    </Form>
  );
};

export default VerifyOTPForm;
