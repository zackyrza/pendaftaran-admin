import React from "react";
import Styles from "./GenderForm.module.scss";
import { Button, Form, Input, message } from "antd";

import { IGenderFormProps } from "./GenderForm.d";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { useLocation, useNavigate } from "react-router-dom";
import { useGender } from "Helpers/Hooks/Api/useGender";
import { GenderProvider } from "Helpers/Hooks/Context/gender";

function GenderForm({}: IGenderFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.includes("create");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { loading, createGender, updateGender, getGenderById } = useGender();

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
      createGender({ name: values.name })
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "Gender berhasil dibuat!",
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

    updateGender(Number(location.pathname.split("/")[2]), {
      name: values.name,
    })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Gender berhasil diubah!",
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
      getGenderById(Number(location.pathname.split("/")[2])).then((res) => {
        form.setFieldsValue({
          name: res.name,
        });
      });
    }
  }, [isCreate]);

  return (
    <GenderProvider>
      <div className={Styles["wrapper"]}>
        {contextHolder}
        <Form
          form={form}
          name="form-gender"
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Nama Kota / Gender"
            name="name"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama Kota / Gender",
              },
            ]}
          >
            <Input placeholder="Masukkan nama Kota / Gender" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </div>
    </GenderProvider>
  );
}

export default GenderForm;
