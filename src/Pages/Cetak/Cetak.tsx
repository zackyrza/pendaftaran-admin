import React from "react";
import { Tabs, Button, Form, Input, message, Select } from "antd";
import Styles from "./Cetak.module.scss";

import { ICetakProps } from "./Cetak.d";
import { useCabor } from "Helpers/Hooks/Api/useCabor";
import { useKabupaten } from "Helpers/Hooks/Api/useKabupaten";
import { useKategori } from "Helpers/Hooks/Api/useKategori";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { useMail } from "Helpers/Hooks/Api/useMail";

const { Option } = Select;

function Cetak({}: ICetakProps) {
  const { getCabor, cabor } = useCabor();
  const { getKabupaten, kabupaten } = useKabupaten();
  const { getKategoriBySportId, kategori } = useKategori();
  const [formTab1] = Form.useForm();
  const [formTab2] = Form.useForm();
  const { sendFirstStepMail, sendSecondStepMail } = useMail();
  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    getCabor();
    getKabupaten();
  }, []);

  const onFinishTab1 = (values: LooseObject) => {
    sendFirstStepMail(values.caborId, values.cityId, values.email).then(() => {
      messageApi.success({
        content: "Email berhasil dikirim ke " + values.email,
        duration: 2,
      });
    });
  };
  const onFinishTab1Failed = (values: LooseObject) => {};

  const onCaborChangeStep1 = (value: string) => {
    formTab1.setFieldsValue({
      caborId: Number(value),
    });
  };

  const onKabupatenChangeStep1 = (value: string) => {
    formTab1.setFieldsValue({
      cityId: Number(value),
    });
  };

  const onFinishTab2 = (values: LooseObject) => {
    sendSecondStepMail(values.classId, values.cityId, values.email).then(() => {
      messageApi.success({
        content: "Email berhasil dikirim ke " + values.email,
        duration: 2,
      });
    });
  };
  const onFinishTab2Failed = (values: LooseObject) => {};

  const onKabupatenChangeStep2 = (value: string) => {
    formTab2.setFieldsValue({
      cityId: Number(value),
    });
  };

  const onKategoriChangeStep2 = (value: string) => {
    formTab2.setFieldsValue({
      classId: Number(value),
    });
  };

  const onCaborChangeStep2 = (value: string) => {
    getKategoriBySportId(Number(value));
  };

  const renderTab1 = () => {
    return (
      <div className={Styles["tab1"]}>
        <Form
          form={formTab1}
          name="form-pendaftaran-tab1"
          layout={"vertical"}
          onFinish={onFinishTab1}
          onFinishFailed={onFinishTab1Failed}
        >
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
              onChange={onKabupatenChangeStep1}
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
            name="caborId"
            label="Cabang Olahraga"
            rules={[{ required: true, message: "Cabang Olahraga harus diisi" }]}
          >
            <Select
              placeholder="Pilih cabang olahraga"
              onChange={onCaborChangeStep1}
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
            name={"email"}
            label="Email"
            rules={[
              {
                required: true,
                message: "Tolong masukkan email",
              },
              {
                type: "email",
                message: "Email tidak valid",
              },
            ]}
          >
            <Input placeholder="Masukkan email penerima" type="email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const renderTab2 = () => {
    return (
      <div className={Styles["tab2"]}>
        <Form
          form={formTab2}
          name="form-pendaftaran-tab2"
          layout={"vertical"}
          onFinish={onFinishTab2}
          onFinishFailed={onFinishTab2Failed}
        >
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
              onChange={onKabupatenChangeStep2}
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
            name="caborId"
            label="Cabang Olahraga"
            rules={[{ required: true, message: "Cabang Olahraga harus diisi" }]}
          >
            <Select
              placeholder="Pilih cabang olahraga"
              onChange={onCaborChangeStep2}
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
              onChange={onKategoriChangeStep2}
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
            name={"email"}
            label="Email"
            rules={[
              {
                required: true,
                message: "Tolong masukkan email",
              },
              {
                type: "email",
                message: "Email tidak valid",
              },
            ]}
          >
            <Input placeholder="Masukkan email penerima" type="email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const TABS = [
    {
      label: "Pendaftaran Tahap 1",
      key: "1",
      children: renderTab1(),
    },
    {
      label: "Pendaftaran Tahap 2",
      key: "2",
      children: renderTab2(),
    },
  ];

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["space"]}>
        <p className={Styles["title"]}>Cetak Laporan</p>
      </div>
      <Tabs defaultActiveKey="1" centered items={TABS} />
    </div>
  );
}

export default Cetak;
