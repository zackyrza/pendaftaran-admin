import React from "react";
import { Button, Form, Input, message } from "antd";

import Styles from "./Login.module.scss";

import { ILoginProps } from "./Login.d";
import { useAuth } from "Helpers/Hooks/Api/useAuth";
import { useNavigate } from "react-router-dom";

function Login({}: ILoginProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [formType] = React.useState<"login" | "register">("login");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    login(values.email, values.password)
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Login berhasil!",
        });
        navigate("/");
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: err.message,
        });
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const renderForm = React.useMemo(() => {
    if (formType === "login") {
      return (
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Tolong masukkan email anda!" },
              { type: "email", message: "Email tidak valid!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Tolong masukkan password anda!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      );
    }

    return <div />;
  }, [formType]);

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["form"]}>{renderForm}</div>
    </div>
  );
}

export default Login;
