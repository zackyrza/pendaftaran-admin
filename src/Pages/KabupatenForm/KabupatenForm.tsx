import React from "react";
import Styles from "./KabupatenForm.module.scss";
import { Button, Form, Input, message } from "antd";

import { IKabupatenFormProps } from "./KabupatenForm.d";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { useLocation, useNavigate } from "react-router-dom";
import { useKabupaten } from "Helpers/Hooks/Api/useKabupaten";
import { KabupatenProvider } from "Helpers/Hooks/Context/kabupaten";

function KabupatenForm({}: IKabupatenFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.includes("create");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { loading, createKabupaten, updateKabupaten, getKabupatenById } =
    useKabupaten();

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
      createKabupaten({ name: values.name })
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "Kabupaten berhasil dibuat!",
          });
          navigate(-1);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: err.message,
          });
        });
      return;
    }

    updateKabupaten(Number(location.pathname.split("/")[2]), {
      name: values.name,
    })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Kabupaten berhasil diubah!",
        });
        navigate(-1);
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
      getKabupatenById(Number(location.pathname.split("/")[2])).then((res) => {
        form.setFieldsValue({
          name: res.name,
        });
      });
    }
  }, [isCreate]);

  return (
    <KabupatenProvider>
      <div className={Styles["wrapper"]}>
        {contextHolder}
        <Form
          form={form}
          name="form-kabupaten"
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Nama Kota / Kabupaten"
            name="name"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama Kota / Kabupaten",
              },
            ]}
          >
            <Input placeholder="Masukkan nama Kota / Kabupaten" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </div>
    </KabupatenProvider>
  );
}

export default KabupatenForm;
