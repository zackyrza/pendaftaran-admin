import React from "react";
import Styles from "./KandidatForm.module.scss";
import { DatePickerProps, Upload, UploadFile, UploadProps } from "antd";
import { Button, Form, Input, message, Select, DatePicker } from "antd";
import moment from "moment";

import { IKandidatFormProps } from "./KandidatForm.d";
import { LooseObject } from "Helpers/Interface/LooseObject";
import { useLocation, useNavigate } from "react-router-dom";
import { useKandidat } from "Helpers/Hooks/Api/useKandidat";
import { KandidatProvider } from "Helpers/Hooks/Context/kandidat";
import { usePendaftaran } from "Helpers/Hooks/Api/usePendaftaran";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { API_URL, IMAGE_URL } from "Config";
import { RcFile, UploadChangeParam } from "antd/es/upload";

const { Option } = Select;

function KandidatForm({}: IKandidatFormProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.includes("create");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [loadingUpload, setLoading] = React.useState<boolean>(false);
  const [photo, setPhoto] = React.useState<string>("");
  const [ktp, setKTP] = React.useState<string>("");
  const [ijazah, setIjazah] = React.useState<string>("");

  const { loading, createKandidat, updateKandidat, getKandidatById } =
    useKandidat();
  const { getPendaftaran, pendaftaran } = usePendaftaran();

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
      createKandidat({
        name: values.name,
        registrationId: values.registrationId,
        status: values.status,
        nik: values.nik,
        gender: values.gender,
        placeOfBirth: values.placeOfBirth,
        birthDate: values.birthDate,
        age: values.age,
        education: values.education,
        bloodType: values.bloodType,
        rhesusType: values.rhesusType,
        weight: values.weight,
        height: values.height,
        handphone: values.handphone,
        religion: values.religion,
        occupation: values.occupation,
        maritalStatus: values.maritalStatus,
        email: values.email,
        photo,
        ktp,
        ijazah,
        shoesNumber: values.shoesNumber,
        shirtSize: values.shirtSize,
      })
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "Kandidat berhasil dibuat!",
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

    updateKandidat(Number(location.pathname.split("/")[2]), {
      name: values.name,
      registrationId: values.registrationId,
      status: values.status,
      nik: values.nik,
      gender: values.gender,
      placeOfBirth: values.placeOfBirth,
      birthDate: values.birthDate,
      age: values.age,
      education: values.education,
      bloodType: values.bloodType,
      rhesusType: values.rhesusType,
      weight: values.weight,
      height: values.height,
      handphone: values.handphone,
      religion: values.religion,
      occupation: values.occupation,
      maritalStatus: values.maritalStatus,
      email: values.email,
      photo,
      ktp,
      ijazah,
      shoesNumber: values.shoesNumber,
      shirtSize: values.shirtSize,
    })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Kandidat berhasil diubah!",
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
    getPendaftaran();
  }, []);

  React.useEffect(() => {
    if (!isCreate) {
      // Get data from API
      getKandidatById(Number(location.pathname.split("/")[2])).then((res) => {
        form.setFieldsValue({
          name: res.name,
          registrationId: res.registrationId,
          status: res.status,
          nik: res.nik,
          gender: res.gender,
          placeOfBirth: res.placeOfBirth,
          birthDate: res.birthDate,
          age: res.age,
          education: res.education,
          bloodType: res.bloodType,
          rhesusType: res.rhesusType,
          weight: res.weight,
          height: res.height,
          handphone: res.handphone,
          religion: res.religion,
          occupation: res.occupation,
          maritalStatus: res.maritalStatus,
          email: res.email,
          shoesNumber: res.shoesNumber,
          shirtSize: res.shirtSize,
        });
        setPhoto(res.photo);
        setKTP(res.ktp);
        setIjazah(res.ijazah);
      });
    } else {
      form.setFieldsValue({
        status: "Atlet",
      });
    }
  }, [isCreate]);

  const onPendaftaranChange = (value: string) => {
    form.setFieldsValue({
      registrationId: Number(value),
    });
  };

  const onGenderChange = (value: string) => {
    form.setFieldsValue({
      gender: value,
    });
  };

  const onMaritalStatusChange = (value: string) => {
    form.setFieldsValue({
      maritalStatus: value,
    });
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    if (!date) return;
    form.setFieldsValue({
      birthDate: date.toDate(),
      age: moment().diff(date.toDate(), "years"),
    });
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("File yang bisa dipakai hanyalah file JPG atau PNG!");
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Foto harus lebih kecil dari 10MB!");
    }
    return isJpgOrPng && isLt10M;
  };

  const uploadButton = (
    <div>
      {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleUpload: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setLoading(false);
      setPhoto(info.file.response.data);
    }
  };

  const handleUploadKTP: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setLoading(false);
      setKTP(info.file.response.data);
    }
  };

  const handleUploadIjazah: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setLoading(false);
      setIjazah(info.file.response.data);
    }
  };

  return (
    <KandidatProvider>
      <div className={Styles["wrapper"]}>
        {contextHolder}
        <Form
          form={form}
          name="form-kandidat"
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Pendaftaran"
            name="registrationId"
            rules={[
              {
                required: true,
                message: "Tolong masukkan data Pendaftaran",
              },
            ]}
          >
            <Select
              placeholder="Pilih data pendaftaran"
              onChange={onPendaftaranChange}
              allowClear
            >
              {pendaftaran.map((item) => (
                <Option
                  key={
                    item.id +
                    "-" +
                    item.email +
                    "-" +
                    item.class?.sport?.name +
                    "-" +
                    item.class?.name +
                    "-" +
                    item.city?.name
                  }
                  value={item.id}
                >
                  {item.email} - {item.class?.sport?.name} - {item.class?.name}{" "}
                  - {item.city?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kandidat"
            name="name"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nama Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan nama Kandidat" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Tolong masukkan email Kandidat",
              },
              {
                type: "email",
                message: "Email tidak valid",
              },
            ]}
          >
            <Input placeholder="Masukkan email Kandidat" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Tolong masukkan status Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan status Kandidat" />
          </Form.Item>
          <Form.Item
            label="NIK"
            name="nik"
            rules={[
              {
                required: true,
                message: "Tolong masukkan nik Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan nik Kandidat" />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              {
                required: true,
                message: "Tolong masukkan gender Kandidat",
              },
            ]}
          >
            <Select
              placeholder="Pilih gender Kandidat"
              onChange={onGenderChange}
              allowClear
            >
              <Option value={"laki-laki"}>Laki - Laki</Option>
              <Option value={"perempuan"}>Perempuan</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Tempat Lahir"
            name="placeOfBirth"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Tempat Lahir Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan Tempat Lahir Kandidat" />
          </Form.Item>
          <Form.Item
            label="Tanggal Lahir"
            name="birthDate"
            valuePropName="date"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Tanggal Lahir Kandidat",
              },
            ]}
          >
            <DatePicker
              placeholder="Masukkan Tanggal Lahir Kandidat"
              onChange={onChange}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Umur"
            name="age"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Umur Kandidat",
              },
            ]}
          >
            <Input type="number" placeholder="Masukkan Umur Kandidat" />
          </Form.Item>
          <Form.Item
            label="Pendidikan Terakhir"
            name="education"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Pendidikan Terakhir Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan Pendidikan Terakhir Kandidat" />
          </Form.Item>
          <Form.Item
            label="Golongan Darah"
            name="bloodType"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Golongan Darah Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan Golongan Darah Kandidat" />
          </Form.Item>
          <Form.Item label="Rhesus" name="rhesusType">
            <Input placeholder="Masukkan Rhesus Kandidat" />
          </Form.Item>
          <Form.Item
            label="Berat badan"
            name="weight"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Berat badan Kandidat",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Masukkan Berat badan Kandidat dalam KG"
              suffix={"kg"}
            />
          </Form.Item>
          <Form.Item
            label="Tinggi badan"
            name="height"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Tinggi badan Kandidat",
              },
            ]}
          >
            <Input
              placeholder="Masukkan Tinggi badan Kandidat dalam CM"
              suffix={"cm"}
            />
          </Form.Item>
          <Form.Item
            label="Handphone"
            name="handphone"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Nomor Handphone Kandidat",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Masukkan Nomor Handphone Kandidat"
            />
          </Form.Item>
          <Form.Item
            label="Agama"
            name="religion"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Agama Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan Agama Kandidat" />
          </Form.Item>
          <Form.Item
            label="Pekerjaan"
            name="occupation"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Pekerjaan Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan Pekerjaan Kandidat" />
          </Form.Item>
          <Form.Item
            label="Status Pernikahan"
            name="maritalStatus"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Status Pernikahan Kandidat",
              },
            ]}
          >
            <Select
              placeholder="Pilih status pernikahan Kandidat"
              onChange={onMaritalStatusChange}
              allowClear
            >
              <Option value={"KAWIN"}>Kawin</Option>
              <Option value={"BELUM KAWIN"}>Belum Kawin</Option>
              <Option value={"CERAI"}>Telah Cerai</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Nomor Sepatu"
            name="shoesNumber"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Nomor Sepatu Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan Nomor Sepatu Kandidat" type="number" />
          </Form.Item>
          <Form.Item
            label="Ukuran Baju"
            name="shirtSize"
            rules={[
              {
                required: true,
                message: "Tolong masukkan Ukuran Baju Kandidat",
              },
            ]}
          >
            <Input placeholder="Masukkan Ukuran Baju Kandidat" />
          </Form.Item>
          <Form.Item label="Pas Foto" name={"file"}>
            <Upload
              action={API_URL + "/uploads"}
              name="file"
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={handleUpload}
              showUploadList={false}
            >
              {photo ? (
                <img
                  src={`${IMAGE_URL}${photo}`}
                  alt="avatar"
                  className={Styles["logo"]}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="Foto KTP" name={"file"}>
            <Upload
              action={API_URL + "/uploads"}
              name="file"
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={handleUploadKTP}
              showUploadList={false}
            >
              {ktp ? (
                <img
                  src={`${IMAGE_URL}${ktp}`}
                  alt="avatar"
                  className={Styles["logo"]}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="Foto Ijazah" name={"file"}>
            <Upload
              action={API_URL + "/uploads"}
              name="file"
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={handleUploadIjazah}
              showUploadList={false}
            >
              {ijazah ? (
                <img
                  src={`${IMAGE_URL}${ijazah}`}
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
    </KandidatProvider>
  );
}

export default KandidatForm;
