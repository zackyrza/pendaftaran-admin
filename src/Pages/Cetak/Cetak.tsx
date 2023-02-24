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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
  const {
    sendFirstStepMail,
    sendSecondStepMail,
    generateSecondStepMail,
    uploadPdf,
    sendEmail,
  } = useMail();
  const [messageApi, contextHolder] = message.useMessage();

  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedSport, setSelectedSport] = React.useState("");
  const [currentData, setCurrentData] = React.useState<LooseObject[]>([]);

  const componentRef = React.useRef<HTMLDivElement>(null);
  const rekapRef = React.useRef<HTMLDivElement>(null);
  const step2Ref = React.useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrintRekap = useReactToPrint({
    content: () => rekapRef.current,
  });
  const handlePrintStep2 = useReactToPrint({
    content: () => step2Ref.current,
    print: (target) => {
      return new Promise(async (resolve, reject) => {
        const canvas = await html2canvas(
          target.contentWindow?.document.children[0] as HTMLElement
        );
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        const doc = new jsPDF("p", "mm");
        let position = 10; // give some top padding to first page

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position += heightLeft - imgHeight; // top padding for other pages
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save("file.pdf");
      });
    },
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

  const handleSavePdf = async (values: LooseObject) => {
    const element = step2Ref.current;
    if (!element) return;
    const canvas = await html2canvas(element);
    // const data = canvas.toDataURL("image/png");
    // const pdf = new jsPDF({
    //   orientation: "portrait",
    //   format: "letter",
    // });
    // const imgProperties = pdf.getImageProperties(data);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    // console.log(
    //   { imgProperties, pdfWidth, pdfHeight },
    //   "=============================="
    // );
    // pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    // pdf.save("download.pdf");
    // pdf.output("blob");

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    const doc = new jsPDF("p", "mm");
    let position = 10; // give some top padding to first page

    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10; // top padding for other pages
      doc.addPage();
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    const pdfBlob = doc.output("blob");
    onUpload(pdfBlob || new Blob(), values);
  };

  const onUpload = (file: Blob, values: LooseObject) => {
    const newFile = new File([file], "file.pdf", { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", newFile);
    uploadPdf(formData)
      .then((res) => {
        messageApi.destroy("loading-upload");
        messageApi.success({
          content: "File pdf berhasil di upload",
          duration: 2,
        });
        messageApi.loading({
          key: "loading-send",
          content: "Mengirimkan file pdf ke email...",
          duration: 0,
        });
        sendEmail(
          currentData?.[0]?.main?.city,
          currentData?.[0]?.main?.sport,
          currentData?.[0]?.main?.className,
          values.email,
          res
        )
          .then((res) => {
            messageApi.destroy("loading-send");
            messageApi.success({
              content: "Email berhasil dikirim ke " + values.email,
              duration: 2,
            });
          })
          .catch((err) => {
            messageApi.destroy("loading-send");
            messageApi.error({
              content: "Email gagal dikirim ke " + values.email,
              duration: 2,
            });
          });
      })
      .catch((err) => {
        messageApi.destroy("loading-upload");
        messageApi.error({
          content: "File pdf gagal di upload",
          duration: 2,
        });
      });
  };

  const onFinishTab2 = (values: LooseObject) => {
    // messageApi.loading({
    //   key: "loading",
    //   content: "Memproses file pdf...",
    //   duration: 0,
    // });
    // generateSecondStepMail(values.classId, values.cityId, values.email)
    //   .then((res) => {
    //     setCurrentData(res);

    //     setTimeout(async () => {
    //       handleSavePdf(values);
    //       messageApi.destroy("loading");
    //       messageApi.success({
    //         content: "File pdf berhasil di buat",
    //         duration: 2,
    //       });
    //       messageApi.loading({
    //         key: "loading-upload",
    //         content: "Mengupload file pdf untuk dikirim ke email...",
    //         duration: 0,
    //       });
    //       // onUpload(pdfBlob || new Blob(), values);
    //       // handlePrintStep2();
    //     }, 1000);
    //   })
    //   .catch((err) => {
    //     console.log(err, "==============================");
    //     messageApi.destroy("loading");
    //     messageApi.destroy("loading-upload");
    //     messageApi.error({
    //       content: "Email gagal dikirim ke " + values.email,
    //       duration: 2,
    //     });
    //   });
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPrintStep2 = () => {
    return (
      <div className={Styles["for-printing"]}>
        <div
          ref={step2Ref}
          style={{
            width: "210mm",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            backgroundColor: "#fff",
            marginTop: 25,
          }}
        >
          {currentData.map((item: any, index: number) => (
            <div key={index + "-print"}>
              {renderPrintStep2Form(item.main)}
              {renderPrintStep2Attachment(
                item.attachment.ktp,
                item.attachment.ijazah
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPrintStep2Form = (data: any) => {
    const month = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const photoUrl = IMAGE_URL + data.candidate.photo.replaceAll(" ", "%20");
    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              textAlign: "center",
              margin: 0,
              marginBottom: 10,
            }}
          >
            PORPROV XII TAHUN 2023 KALIMANTAN TENGAH - KOTAWARINGIN TIMUR
          </p>
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              textAlign: "center",
              margin: 0,
              marginBottom: 10,
            }}
          >
            FORM TAHAP II
          </p>
          <p
            style={{
              fontSize: 10,
              textAlign: "center",
              margin: 0,
              marginBottom: 10,
            }}
          >
            Dilaksanakan pada tanggal _________ Juni 2023 di Sampit
          </p>
        </div>
        <hr />
        <div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderSpacing: 0,
              border: "solid 1px #000000",
            }}
          >
            <colgroup>
              <col style={{ width: 250 }} />
              <col style={{ width: 450 }} />
            </colgroup>
            <thead>
              <tr>
                <th
                  colSpan={2}
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 10,
                    fontWeight: "normal",
                    overflow: "hidden",
                    padding: "10px 5px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  DETAIL FORM
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 10,
                    overflow: "hidden",
                    padding: "6px 3px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  KONTINGEN KAB/KOTA
                </td>
                <td
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 10,
                    overflow: "hidden",
                    padding: "6px 3px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  {data.city.toUpperCase()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 10,
                    overflow: "hidden",
                    padding: "6px 3px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  CABANG OLAHRAGA
                </td>
                <td
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 10,
                    overflow: "hidden",
                    padding: "6px 3px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  {data.sport.toUpperCase()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 10,
                    overflow: "hidden",
                    padding: "6px 3px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  NOMOR/EVENT/KELAS
                </td>
                <td
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 10,
                    overflow: "hidden",
                    padding: "6px 3px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  {data.className.toUpperCase()}
                </td>
              </tr>
              {Object.keys(data.candidate).map((key) => {
                let keyName = key.toUpperCase();
                let value: string | number | Date = data.candidate[key];
                if (key === "birthDate") {
                  value =
                    new Date(value).getDate() +
                    " " +
                    month[new Date(value).getMonth()] +
                    " " +
                    new Date(value).getFullYear();
                }
                if (typeof value === "string") {
                  value = value.toUpperCase();
                }
                if (
                  value === null ||
                  key === "email" ||
                  key === "photo" ||
                  key === "deletedAt" ||
                  key === "createdAt" ||
                  key === "updatedAt" ||
                  key === "id" ||
                  key === "registrationId" ||
                  key === "ktp" ||
                  key === "ijazah" ||
                  key === "registration"
                ) {
                  return;
                }
                switch (key) {
                  case "name":
                    keyName = "NAMA";
                    break;
                  case "status":
                    keyName = "STATUS PADA KONTINGEN";
                    break;
                  case "nik":
                    keyName = "NIK KTP/KK";
                    break;
                  case "gender":
                    keyName = "JENIS KELAMIN";
                    break;
                  case "placeOfBirth":
                    keyName = "TEMPAT LAHIR";
                    break;
                  case "birthDate":
                    keyName = "TANGGAL LAHIR";
                    break;
                  case "age":
                    keyName = "USIA";
                    break;
                  case "education":
                    keyName = "PENDIDIKAN TERAKHIR";
                    break;
                  case "bloodType":
                    keyName = "GOLONGAN DARAH";
                    break;
                  case "rhesusType":
                    keyName = "RHESUS";
                    break;
                  case "weight":
                    keyName = "BERAT BADAN";
                    break;
                  case "height":
                    keyName = "TINGGI BADAN";
                    break;
                  case "religion":
                    keyName = "AGAMA";
                    break;
                  case "handphone":
                    keyName = "NO. HANDPHONE";
                    break;
                  case "occupation":
                    keyName = "PEKERJAAN";
                    break;
                  case "maritalStatus":
                    keyName = "STATUS PERKAWINAN";
                    break;
                  case "shoesNumber":
                    keyName = "NOMOR SEPATU";
                    break;
                  case "shirtSize":
                    keyName = "SIZE BAJU";
                    break;
                  default:
                    break;
                }
                return (
                  <tr key={value.toString()}>
                    <td
                      style={{
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: 1,
                        fontFamily: "Arial, sans-serif",
                        fontSize: 10,
                        overflow: "hidden",
                        padding: "6px 3px",
                        wordBreak: "normal",
                        border: "solid 1px #000000",
                      }}
                    >
                      {keyName}
                    </td>
                    <td
                      style={{
                        borderColor: "black",
                        borderStyle: "solid",
                        borderWidth: 1,
                        fontFamily: "Arial, sans-serif",
                        fontSize: 10,
                        overflow: "hidden",
                        padding: "6px 3px",
                        wordBreak: "normal",
                        border: "solid 1px #000000",
                      }}
                    >
                      {value.toString()} {keyName === "BERAT BADAN" ? "KG" : ""}
                      {keyName === "TINGGI BADAN" ? "CM" : ""}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  colSpan={2}
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 10,
                    overflow: "hidden",
                    padding: "6px 3px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        flex: 0.65,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: 8,
                            margin: 0,
                            marginBottom: 2.5,
                          }}
                        >
                          Syarat Keabsahan Data (dokumen yang wajib dilampirkan)
                          :
                        </p>
                        <p
                          style={{
                            fontSize: 8,
                            margin: 0,
                            marginBottom: 2.5,
                          }}
                        >
                          1. Fotocopy KTP (Kartu Tanda Penduduk);
                        </p>
                        <p
                          style={{
                            fontSize: 8,
                            margin: 0,
                            marginBottom: 2.5,
                          }}
                        >
                          2. Fotocopy KK (Kartu Keluarga);
                        </p>
                        <p
                          style={{
                            fontSize: 8,
                            margin: 0,
                            marginBottom: 2.5,
                          }}
                        >
                          3. Fotocopy Akta Kelahiran;
                        </p>
                        <p
                          style={{
                            fontSize: 8,
                            margin: 0,
                            marginBottom: 2.5,
                          }}
                        >
                          4. Fotocopy Ijazah Terakhir bagi yang berusia dibawah
                          17 tahun;
                        </p>
                        <p
                          style={{
                            fontSize: 8,
                            margin: 0,
                            marginBottom: 5,
                          }}
                        >
                          5. Pas Foto 3 x 4 sebanyak 3 lembar.
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 8,
                            margin: 0,
                            marginBottom: 5,
                          }}
                        >
                          Form Tahap II kepada Panitia selambat-lambatnya pada
                          tanggal 28 Februari 2023 di Sekretariat KONI
                          Kotawaringin Timur - Sampit.
                        </p>
                        <p
                          style={{
                            fontSize: 8,
                            margin: 0,
                          }}
                        >
                          Pada Tahap III (Keabsahan Data) wajib membawa
                          persyaratan atlet berupa KTP asli, KK asli, Akta
                          Kelahiran asli / Ijazah Terakhir bagi yang berusia
                          dibawah 17 tahun.
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        flex: 0.35,
                      }}
                    >
                      {data.candidate.photo !== null ? (
                        <img
                          src={photoUrl}
                          style={{
                            width: "35%",
                            objectFit: "contain",
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    borderColor: "black",
                    borderStyle: "solid",
                    borderWidth: 1,
                    fontFamily: "Arial, sans-serif",
                    fontSize: 8,
                    overflow: "hidden",
                    padding: "6px 3px",
                    wordBreak: "normal",
                    border: "solid 1px #000000",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 0.45,
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          margin: 0,
                        }}
                      >
                        {new Date().getDate()} {month[new Date().getMonth()]}{" "}
                        {new Date().getFullYear()}
                      </p>
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          borderBottom: "1px solid #000",
                          margin: 0,
                          marginTop: 45,
                        }}
                      >
                        {data.candidate.name}
                      </p>
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          margin: 0,
                        }}
                      >
                        {data.candidate.status}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: 65,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 0.45,
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          borderTop: "1px solid #000",
                          margin: 0,
                        }}
                      >
                        Ketua / Sekretaris KONI Kabupaten Kota
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 0.45,
                      }}
                    >
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: 10,
                          borderTop: "1px solid #000",
                          margin: 0,
                        }}
                      >
                        Ketua / Sekretaris Pengkab / Pengkot
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 5,
            }}
          >
            <p
              style={{
                fontSize: 7,
                margin: 0,
                marginBottom: 5,
              }}
            >
              *Wajib TTD dan Cap Stampel Ketua / Sekretaris KONI Kabupaten /
              Kota
            </p>
            <p
              style={{
                fontSize: 7,
                margin: 0,
                marginBottom: 5,
              }}
            >
              *Wajib TTD dan Cap Stampel Ketua / Sekretaris Pengkab / Pengkot
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <p
              style={{
                textAlign: "center",
                fontSize: 10,
                margin: 0,
                marginBottom: 10,
              }}
            >
              Formulir Pendaftaran Tahap 2 ini diterima oleh
            </p>
            <p
              style={{
                textAlign: "center",
                fontSize: 10,
                margin: 0,
                marginBottom: 10,
              }}
            >
              Panitia Besar PORPROV XII Tahun 2023 Kalimantan Tengah
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderPrintStep2Attachment = (photoUrl: string, ijazahUrl: string) => {
    const photo = IMAGE_URL + photoUrl.replaceAll(" ", "%20");
    const ijazah = IMAGE_URL + ijazahUrl.replaceAll(" ", "%20");
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 75,
          marginBottom: 500,
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: 60,
            margin: 0,
            marginBottom: 20,
            width: "100%",
          }}
        >
          Lampiran
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            margin: 0,
            marginBottom: 10,
            width: "100%",
          }}
        >
          Foto KTP
        </p>
        {photoUrl ? (
          <img
            src={photo}
            style={{
              width: "100%",
              height: "15vh",
              objectFit: "contain",
              marginBottom: 10,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "15vh",
              marginBottom: 10,
            }}
          />
        )}
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            margin: 0,
            marginBottom: 10,
            width: "100%",
          }}
        >
          Foto Ijazah
        </p>
        {ijazahUrl ? (
          <img
            src={ijazah}
            style={{
              width: "100%",
              height: "40vh",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "40vh",
            }}
          />
        )}
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
      {renderPrintStep2()}
    </div>
  );
}

export default Cetak;
