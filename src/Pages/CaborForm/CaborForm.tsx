import React from "react";
import Styles from "./CaborForm.module.scss";
import { Button, Form, Input, Upload, message } from "antd";

import { ICaborFormProps } from "./CaborForm.d";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { useLocation, useNavigate } from "react-router-dom";
import { useCabor } from "Helpers/Hooks/Api/useCabor";
import { CaborProvider } from "Helpers/Hooks/Context/cabor";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { API_URL, IMAGE_URL } from "Config";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload";

function CaborForm({}: ICaborFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.includes("create");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [loadingUpload, setLoading] = React.useState<boolean>(false);
  const { loading, createCabor, updateCabor, getCaborById } = useCabor();

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
      createCabor({ name: values.name, imageUrl })
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "Cabang olahraga berhasil dibuat!",
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

    updateCabor(Number(location.pathname.split("/")[2]), {
      name: values.name,
      imageUrl,
    })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Cabang olahraga berhasil diubah!",
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
      getCaborById(Number(location.pathname.split("/")[2])).then((res) => {
        form.setFieldsValue({
          name: res.name,
        });
        setImageUrl(res.imageUrl);
      });
    }
  }, [isCreate]);

  const uploadButton = (
    <div>
      {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Foto harus lebih kecil dari 10MB!");
    }
    return isJpgOrPng && isLt10M;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setLoading(false);
      setImageUrl(info.file.response.data);
      console.log(info.file.response);
    }
  };

  return (
    <CaborProvider>
      <div className={Styles["wrapper"]}>
        {contextHolder}
        <Form
          form={form}
          name="form-cabor"
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Nama Cabang Olahraga"
            name="name"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama Cabang Olahraga",
              },
            ]}
          >
            <Input placeholder="Masukkan nama Cabang Olahraga" />
          </Form.Item>
          <Form.Item
            label="Logo Cabang Olahraga"
            name={"file"}
            rules={[
              {
                required: true,
                message: "Tolong masukkan logo Cabang Olahraga",
              },
            ]}
          >
            <Upload
              action={API_URL + "/uploads"}
              name="file"
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={handleChange}
              showUploadList={false}
            >
              {imageUrl ? (
                <img
                  src={`${IMAGE_URL}${imageUrl}`}
                  alt="avatar"
                  className={Styles["logo"]}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </div>
    </CaborProvider>
  );
}

export default CaborForm;
