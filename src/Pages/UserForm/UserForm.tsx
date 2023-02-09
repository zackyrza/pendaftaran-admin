import React from "react";
import Styles from "./UserForm.module.scss";
import { Button, Form, Input, message, Select } from "antd";

import { IUserFormProps } from "./UserForm.d";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "Helpers/Hooks/Api/useAuth";
import { UserProvider } from "Helpers/Hooks/Context/user";

const { Option } = Select;

function UserForm({}: IUserFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.includes("create");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { loading, createUser, updateUser, getUserById } = useAuth();

  React.useEffect(() => {
    if (loading) {
      messageApi.open({
        key: "loading",
        type: "loading",
        content: "Sedang mengambil data...",
      });
    } else {
      messageApi.destroy("loading");
    }
  }, [loading]);

  const onFinish = (values: LooseObject) => {
    if (isCreate) {
      createUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
      })
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "User berhasil dibuat!",
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: err.message,
          });
        });
      return;
    }

    updateUser(Number(location.pathname.split("/")[2]), {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      role: values.role,
    })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "User berhasil diubah!",
        });
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: err.message,
        });
      });
  };

  const onFinishFailed = (errorInfo: LooseObject) => {
    console.log("Failed:", errorInfo);
  };

  React.useEffect(() => {
    if (!isCreate) {
      // Get data from API
      getUserById(Number(location.pathname.split("/")[2])).then((res) => {
        form.setFieldsValue({
          fullName: res.fullName,
          email: res.email,
          role: res.role,
        });
      });
    }
  }, [isCreate]);

  const onRoleChange = (value: string) => {
    form.setFieldsValue({
      role: value,
    });
  };

  return (
    <UserProvider>
      <div className={Styles["wrapper"]}>
        {contextHolder}
        <Form
          form={form}
          name="form-user"
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Nama"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama lengkap User",
              },
            ]}
          >
            <Input placeholder="Masukkan nama lengkap User" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Tolong masukkan email User",
              },
              {
                type: "email",
                message: "Email tidak valid",
              },
            ]}
          >
            <Input placeholder="Masukkan email User" type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Tolong masukkan password User",
              },
            ]}
          >
            <Input placeholder="Masukkan password User" type="password" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama Role",
              },
            ]}
          >
            <Select
              placeholder="Pilih role untuk user"
              onChange={onRoleChange}
              allowClear
            >
              <Option value="admin">Admin</Option>
              <Option value="user">Pendaftar</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </div>
    </UserProvider>
  );
}

export default UserForm;
