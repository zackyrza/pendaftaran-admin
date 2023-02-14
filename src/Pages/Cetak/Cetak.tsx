import React from "react";
import { Tabs, Button, Form, Input, message, Select } from "antd";
import Styles from "./Cetak.module.scss";

import { ICetakProps } from "./Cetak.d";
import { useCabor } from "Helpers/Hooks/Api/useCabor";
import { useKabupaten } from "Helpers/Hooks/Api/useKabupaten";
import { useKategori } from "Helpers/Hooks/Api/useKategori";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { useMail } from "Helpers/Hooks/Api/useMail";
import { IMAGE_URL } from "Config";
import { useReactToPrint } from "react-to-print";

import background from "Images/id-card-bg.png";
import { useKandidat } from "Helpers/Hooks/Api/useKandidat";

const { Option } = Select;

function Cetak({}: ICetakProps) {
  const { getCabor, cabor } = useCabor();
  const { getKabupaten, kabupaten } = useKabupaten();
  const { getKategoriBySportId, kategori } = useKategori();
  const { getKandidatForIdCard, kandidat } = useKandidat();
  const [formTab1] = Form.useForm();
  const [formTab2] = Form.useForm();
  const [formTab3] = Form.useForm();
  const [formTab4] = Form.useForm();
  const { sendFirstStepMail, sendSecondStepMail } = useMail();
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedSport, setSelectedSport] = React.useState("");

  const componentRef = React.useRef<HTMLDivElement>(null);
  const rekapRef = React.useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrintRekap = useReactToPrint({
    content: () => rekapRef.current,
  });

  React.useEffect(() => {
    getCabor();
    getKabupaten();
  }, []);

  const onFinishTab1 = (values: LooseObject) => {
    messageApi.loading({
      key: "loading",
      content: "Memproses data...",
      duration: 0,
    });
    sendFirstStepMail(values.caborId, values.cityId, values.email)
      .then(() => {
        messageApi.destroy("loading");
        messageApi.success({
          content: "Email berhasil dikirim ke " + values.email,
          duration: 2,
        });
      })
      .catch(() => {
        messageApi.destroy("loading");
        messageApi.error({
          content: "Email gagal dikirim ke " + values.email,
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
    messageApi.loading({
      key: "loading",
      content: "Mengirim email...",
      duration: 0,
    });
    sendSecondStepMail(values.classId, values.cityId, values.email)
      .then(() => {
        messageApi.destroy("loading");
        messageApi.success({
          content: "Email berhasil dikirim ke " + values.email,
          duration: 2,
        });
      })
      .catch(() => {
        messageApi.destroy("loading");
        messageApi.error({
          content: "Email gagal dikirim ke " + values.email,
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

  const onFinishTab3 = (values: LooseObject) => {
    messageApi.loading({
      key: "loading",
      content: "Memproses data...",
      duration: 0,
    });
    getKandidatForIdCard(values.cityId, values.caborId)
      .then(() => {
        messageApi.destroy("loading");
        messageApi.success({
          content: "Data berhasil dimuat",
          duration: 1,
        });
        messageApi.loading({
          key: "loading2",
          content: "Memproses file pdf...",
          duration: 0,
        });
        setTimeout(() => {
          messageApi.destroy("loading2");
          handlePrint();
        }, 2500);
      })
      .catch(() => {
        messageApi.destroy("loading");
        messageApi.error({
          content: "Data gagal dimuat",
          duration: 2,
        });
      });
  };
  const onFinishTab3Failed = (values: LooseObject) => {};

  const onKabupatenChangeStep3 = (value: string) => {
    formTab3.setFieldsValue({
      cityId: Number(value),
    });
  };

  const onCaborChangeStep3 = (value: string) => {
    formTab3.setFieldsValue({
      caborId: Number(value),
    });
  };

  const onFinishTab4 = (values: LooseObject) => {
    messageApi.loading({
      key: "loading",
      content: "Memproses data...",
      duration: 0,
    });
    getKandidatForIdCard(values.cityId, values.caborId)
      .then(() => {
        messageApi.destroy("loading");
        messageApi.success({
          content: "Data berhasil dimuat",
          duration: 1,
        });
        messageApi.loading({
          key: "loading2",
          content: "Memproses file pdf...",
          duration: 0,
        });
        setTimeout(() => {
          messageApi.destroy("loading2");
          handlePrintRekap();
        }, 2500);
      })
      .catch(() => {
        messageApi.destroy("loading");
        messageApi.error({
          content: "Data gagal dimuat",
          duration: 2,
        });
      });
  };
  const onFinishTab4Failed = (values: LooseObject) => {};

  const onKabupatenChangeStep4 = (value: string) => {
    formTab4.setFieldsValue({
      cityId: Number(value),
    });
    setSelectedCity(
      kabupaten.find((item) => item.id === Number(value))?.name ?? ""
    );
  };

  const onCaborChangeStep4 = (value: string) => {
    formTab4.setFieldsValue({
      caborId: Number(value),
    });
    setSelectedSport(
      cabor.find((item) => item.id === Number(value))?.name ?? ""
    );
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

  const renderTab3 = () => {
    return (
      <div className={Styles["tab3"]}>
        <Form
          form={formTab3}
          name="form-pendaftaran-tab3"
          layout={"vertical"}
          onFinish={onFinishTab3}
          onFinishFailed={onFinishTab3Failed}
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
              onChange={onKabupatenChangeStep3}
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
              onChange={onCaborChangeStep3}
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
              Cetak
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const renderTab4 = () => {
    return (
      <div className={Styles["tab4"]}>
        <Form
          form={formTab4}
          name="form-pendaftaran-tab4"
          layout={"vertical"}
          onFinish={onFinishTab4}
          onFinishFailed={onFinishTab4Failed}
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
              onChange={onKabupatenChangeStep4}
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
              onChange={onCaborChangeStep4}
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
              Cetak
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
    {
      label: "Cetak ID Card",
      key: "3",
      children: renderTab3(),
    },
    {
      label: "Cetak Rekapitulasi",
      key: "4",
      children: renderTab4(),
    },
  ];

  const renderCardPrint = () => {
    return kandidat.map((candidate, index) => {
      return (
        <>
          <div
            style={{
              width: 210,
              height: 357,
              backgroundImage: `url(${background})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: index % 8 === 0 && index !== 0 ? 60 : 0,
              marginLeft: 5,
              marginRight: 5,
            }}
            key={index}
          >
            <div
              style={{
                width: 80,
                height: 80,
                marginTop: 100,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 15,
                  border: "2px solid dimgray",
                  backgroundImage: `url(${IMAGE_URL}${encodeURIComponent(
                    candidate.photo.trim()
                  )})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
            <div
              style={{
                width: "82%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: "#000",
                  margin: 0,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {candidate.name}
              </p>
              <div
                style={{
                  width: "80%",
                  height: 2,
                  backgroundColor: "#000",
                  margin: "2.5px 0px",
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: "#000",
                  margin: 0,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {candidate.registration?.city?.name}
              </p>
            </div>
            <div
              style={{
                width: "82%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: "800",
                  color: "#000",
                  margin: 0,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {candidate.status.toUpperCase()}
              </p>
            </div>
            <div
              style={{
                width: "82%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <p
                style={{
                  fontSize: 9,
                  fontWeight: "800",
                  color: "#000",
                  margin: 0,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Kotawaringin Timur - JUNI 2023
              </p>
            </div>
          </div>
        </>
      );
    });
  };

  const renderPrint = () => {
    return (
      <div className={Styles["for-printing"]}>
        <div
          ref={componentRef}
          style={{
            width: "210mm",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            backgroundColor: "#fff",
            marginTop: 25,
            transform: "scale(-1, 1)",
          }}
        >
          {renderCardPrint()}
        </div>
      </div>
    );
  };

  const renderPrintRekap = () => {
    return (
      <div className={Styles["for-printing"]}>
        <div
          ref={rekapRef}
          style={{
            width: "100%",
            backgroundColor: "#fff",
            marginTop: 25,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 25,
              fontWeight: 600,
              margin: 0,
              marginBottom: 15,
            }}
          >
            REKAPITULASI
          </p>
          <p
            style={{
              fontSize: 25,
              fontWeight: 600,
              margin: 0,
              marginBottom: 25,
            }}
          >
            {selectedCity.toUpperCase()} - {selectedSport.toUpperCase()}
          </p>
          <table
            border={1}
            width={"100%"}
            style={{ borderCollapse: "collapse", borderSpacing: 0 }}
          >
            <thead style={{ backgroundColor: "yellow" }}>
              <tr>
                <th>NO</th>
                <th>KONTINGEN KAB/KOTA</th>
                <th>NAMA</th>
                <th>CABANG OLAHRAGA</th>
                <th>NOMOR/EVENT/KELAS</th>
                <th>STATUS KONTINGEN</th>
                <th>NIK KTP/KK</th>
                <th>NO HP</th>
                <th>PARAF</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              {kandidat.map((item, index) => (
                <tr style={{ height: 50 }} key={item.id + "-kandidat"}>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    {selectedCity}
                  </td>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    {selectedSport}
                  </td>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    {item.registration?.class?.name}
                  </td>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    {item.status}
                  </td>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    {item.nik}
                  </td>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    {item.handphone}
                  </td>
                  <td
                    style={{
                      overflow: "hidden",
                      wordBreak: "normal",
                      verticalAlign: "center",
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["space"]}>
        <p className={Styles["title"]}>Cetak Laporan</p>
      </div>
      <Tabs defaultActiveKey="1" centered items={TABS} />
      {renderPrint()}
      {renderPrintRekap()}
    </div>
  );
}

export default Cetak;
