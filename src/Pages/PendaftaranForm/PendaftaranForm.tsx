import React from "react";
import Styles from "./PendaftaranForm.module.scss";
import { Button, Form, Input, message, Select, Space, Table } from "antd";

import { IPendaftaranFormProps } from "./PendaftaranForm.d";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePendaftaran } from "Helpers/Hooks/Api/usePendaftaran";
import { PendaftaranProvider } from "Helpers/Hooks/Context/pendaftaran";
import { useCabor } from "Helpers/Hooks/Api/useCabor";
import { useKabupaten } from "Helpers/Hooks/Api/useKabupaten";
import { useGender } from "Helpers/Hooks/Api/useGender";
import { useKategori } from "Helpers/Hooks/Api/useKategori";
import { ColumnsType } from "antd/es/table";
import { IKandidat } from "Helpers/Interface/Kandidat";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

function PendaftaranForm({}: IPendaftaranFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.includes("create");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const {
    loading,
    createPendaftaran,
    updatePendaftaran,
    getPendaftaranById,
    pendaftaranDetail,
  } = usePendaftaran();
  const { getCabor, cabor } = useCabor();
  const { getKabupaten, kabupaten } = useKabupaten();
  const { getGender, gender } = useGender();
  const { getKategoriBySportId, kategori } = useKategori();

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
      createPendaftaran({
        quantity: values.quantity,
        cityId: values.cityId,
        email: values.email,
        classId: values.classId,
        sportGenderId: values.sportGenderId,
      })
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "Pendaftaran berhasil dibuat!",
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

    updatePendaftaran(Number(location.pathname.split("/")[2]), {
      quantity: values.quantity,
      cityId: values.cityId,
      email: values.email,
      classId: values.classId,
      sportGenderId: values.sportGenderId,
    })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Pendaftaran berhasil diubah!",
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
    getKabupaten();
    getGender();
  }, []);

  React.useEffect(() => {
    if (!isCreate) {
      // Get data from API
      getPendaftaranById(Number(location.pathname.split("/")[2])).then(
        (res) => {
          form.setFieldsValue({
            quantity: res.quantity,
            cityId: res.cityId,
            sportId: res.class.sportId,
            classId: res.classId,
            sportGenderId: res.sportGenderId,
          });
        }
      );
    }
  }, [isCreate]);

  const onKabupatenChange = (value: string) => {
    form.setFieldsValue({
      cityId: Number(value),
    });
  };

  const onCaborChange = (value: string) => {
    getKategoriBySportId(Number(value));
  };

  const onKategoriChange = (value: string) => {
    form.setFieldsValue({
      classId: Number(value),
    });
  };

  const onGenderChange = (value: string) => {
    form.setFieldsValue({
      sportGenderId: Number(value),
    });
  };

  const columns: ColumnsType<IKandidat> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Nomor Handphone",
      dataIndex: "handphone",
      key: "handphone",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={"/kandidat/" + record.id}>Ubah</Link>
        </Space>
      ),
    },
  ];

  return (
    <PendaftaranProvider>
      <div className={Styles["wrapper"]}>
        {contextHolder}
        <Form
          form={form}
          name="form-pendaftaran"
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Jumlah Peserta"
            name="quantity"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Jumlah Peserta",
              },
            ]}
          >
            <Input placeholder="Masukkan Jumlah Peserta" type="number" />
          </Form.Item>
          <Form.Item
            label="Email Pendaftar"
            name="email"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Email pendaftar",
              },
            ]}
          >
            <Input placeholder="Masukkan Email pendaftar" type="number" />
          </Form.Item>
          <Form.Item
            label="Kabupaten / Kota"
            name="cityId"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama Kabupaten / Kota",
              },
            ]}
          >
            <Select
              placeholder="Pilih kabupaten atau kota"
              onChange={onKabupatenChange}
              allowClear
            >
              {kabupaten.map((item) => (
                <Option key={item.id + "-" + item.name} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
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
          <Form.Item
            label="Kategori"
            name="classId"
            rules={[
              {
                required: true,
                message: "Tolong masukkan tipe Kategori",
              },
            ]}
          >
            <Select
              placeholder="Pilih tipe kategori"
              onChange={onKategoriChange}
              allowClear
            >
              {kategori.map((item) => (
                <Option key={item.id + "-" + item.name} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Tipe Gender"
            name="sportGenderId"
            rules={[
              {
                required: true,
                message: "Tolong masukkan tipe Gender",
              },
            ]}
          >
            <Select
              placeholder="Pilih tipe gender"
              onChange={onGenderChange}
              allowClear
            >
              {gender.map((item) => (
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
        <div className={Styles["space"]}>
          <p className={Styles["title"]}>Kandidat</p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/kandidat/create")}
          >
            Tambah
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={pendaftaranDetail.candidates ?? []}
          loading={loading}
        />
      </div>
    </PendaftaranProvider>
  );
}

export default PendaftaranForm;
