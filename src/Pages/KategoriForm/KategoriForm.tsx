import React from "react";
import Styles from "./KategoriForm.module.scss";
import { Button, Form, Input, message, Select } from "antd";

import { IKategoriFormProps } from "./KategoriForm.d";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { useLocation, useNavigate } from "react-router-dom";
import { useKategori } from "Helpers/Hooks/Api/useKategori";
import { KategoriProvider } from "Helpers/Hooks/Context/kategori";
import { useCabor } from "Helpers/Hooks/Api/useCabor";

const { Option } = Select;

function KategoriForm({}: IKategoriFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.includes("create");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { loading, createKategori, updateKategori, getKategoriById } =
    useKategori();
  const { getCabor, cabor } = useCabor();

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
      createKategori({ name: values.name, sportId: values.sportId })
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "Kategori berhasil dibuat!",
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

    updateKategori(Number(location.pathname.split("/")[2]), {
      name: values.name,
      sportId: values.sportId,
    })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Kategori berhasil diubah!",
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
    getCabor();
    if (!isCreate) {
      // Get data from API
      getKategoriById(Number(location.pathname.split("/")[2])).then((res) => {
        form.setFieldsValue({
          name: res.name,
          sportId: res.sportId,
        });
      });
    }
  }, [isCreate]);

  const onCaborChange = (value: string) => {
    form.setFieldsValue({
      sportId: Number(value),
    });
  };

  return (
    <KategoriProvider>
      <div className={Styles["wrapper"]}>
        {contextHolder}
        <Form
          form={form}
          name="form-kategori"
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Kategori"
            name="name"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama Kategori",
              },
            ]}
          >
            <Input placeholder="Masukkan nama Kategori" />
          </Form.Item>
          <Form.Item
            label="Cabang Olahraga"
            name="sportId"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama Cabang Olahraga",
              },
            ]}
          >
            <Select
              placeholder="Pilih cabang olahraga"
              onChange={onCaborChange}
              allowClear
            >
              {cabor.map((item) => (
                <Option key={item.id + "-" + item.name} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </div>
    </KategoriProvider>
  );
}

export default KategoriForm;
