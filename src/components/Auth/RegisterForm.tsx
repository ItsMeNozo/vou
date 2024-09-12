import React from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  Divider,
  message,
  Select,
  Radio,
} from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.css";
import axios from "axios";

const { Title } = Typography;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: {
      day: string;
      month: string;
      year: string;
    };
    gender: string;
    phoneNumber: string;
  }) => {
    try {
      console.log(values);

      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}/api/user/player-signup`,
        {
          email: values.email,
          password: values.password,
          userDetails: {
            fullname: values.firstName + " " + values.lastName,
            dob: `${values.dateOfBirth.day}/${values.dateOfBirth.month}/${values.dateOfBirth.year}`,
            gender: values.gender,
            phoneNumber: values.phoneNumber,
            username: values.username,
          },
          
        },
      );

      if (response.data.success) {
        localStorage.setItem("email-on-process-verify-otp", values.email);
        message.success("Sign up successful! Please verify OTP from email.");
        navigate("/auth/verify-otp");
      } else {
        message.error("Registration failed. Please try again.");
        console.error("Registration failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      message.error("An error occurred during registration.");
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
        Sign Up
      </Title>
      {/* First Name and Last Name */}
      <div className="flex gap-4">
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: "First name is required" }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="First name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          rules={[{ required: true, message: "Last name is required" }]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Last name" />
        </Form.Item>
      </div>
      {/* Email */}
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Email is required" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="Email address" />
      </Form.Item>

      {/* Username */}
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Username is required" }]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      {/* Password */}
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Password is required" },
          { min: 6, message: "Password must be at least 6 characters" },
        ]}
      >
        <Input.Password placeholder="New password" />
      </Form.Item>

      {/* Phone number */}
      <Form.Item name="phoneNumber" rules={[{ required: false }]}>
        <Input placeholder="Phone number" />
      </Form.Item>
      <span className="flex w-100 text-sm">Date of Birth</span>
      <div className="flex gap-4">
        <Form.Item
          name={["dateOfBirth", "day"]}
          rules={[{ required: true, message: "Day is required" }]}
          style={{ flex: 1 }}
        >
          <Select placeholder="Day">
            {[...Array(31)].map((_, i) => (
              <Select.Option key={i} value={i + 1}>
                {i + 1}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={["dateOfBirth", "month"]}
          rules={[{ required: true, message: "Month is required" }]}
          style={{ flex: 1 }}
        >
          <Select placeholder="Month">
            {[
              { Jan: "01" },
              { Feb: "02" },
              { Mar: "03" },
              { Apr: "04" },
              { May: "05" },
              { Jun: "06" },
              { Jul: "07" },
              { Aug: "08" },
              { Sep: "09" },
              { Oct: "10" },
              { Nov: "11" },
              { Dec: "12" },
            ].map((month, i) => (
              <Select.Option key={i} value={Object(month).value}>
                {Object(month).key}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={["dateOfBirth", "year"]}
          rules={[{ required: true, message: "Year is required" }]}
          style={{ flex: 1 }}
        >
          <Select placeholder="Year">
            {Array.from({ length: 120 }, (_, i) => (
              <Select.Option key={i} value={2024 - i}>
                {2024 - i}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      {/* Gender */}
      <span className="flex w-100 text-sm">Gender</span>

      <Form.Item
        name="gender"
        rules={[{ required: true, message: "Please select your gender" }]}
      >
        <Radio.Group>
          <Radio value="female">Female</Radio>
          <Radio value="male">Male</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full" block>
          Sign Up
        </Button>
      </Form.Item>
      <div style={{ display: "flex", justifyContent: "center", gap: "small" }}>
        <span className="mr-2">Already have an account? </span>

        <span
          style={{ fontWeight: "600", cursor: "pointer" }}
          onClick={() => navigate("/auth/login", { replace: true })}
        >
          Log in
        </span>
      </div>
    </Form>
  );
};

export default RegisterForm;
