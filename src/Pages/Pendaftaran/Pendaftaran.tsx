import React from "react";
import Styles from "./Pendaftaran.module.scss";
import { Space, Table, Button, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import { IPendaftaranProps } from "./Pendaftaran.d";
import { usePendaftaran } from "Helpers/Hooks/Api/usePendaftaran";
import { IPendaftaran } from "Helpers/Interface/Pendaftaran";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Pendaftaran({}: IPendaftaranProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { getPendaftaran, loading, pendaftaran, deletePendaftaran } =
    usePendaftaran();
  const navigate = useNavigate();

  const onDelete = (
    id: number,
    email?: string,
    kategori?: string,
    cabor?: string
  ) => {
    confirm({
      title: `Anda yakin ingin menghapus pendaftaran tahap 1 ini?`,
      icon: <ExclamationCircleFilled />,
      content: `Pendaftaran tahap 1 dari ${email} untuk kategori ${kategori} dari cabang olahraga ${cabor} akan dihapus, dan tidak dapat dikembalikan lagi.`,
      onOk() {
        deletePendaftaran(id)
          .then(() => {
            messageApi.open({
              type: "success",
              content: `Pendaftaran tahap 1 dari ${email} untuk kategori ${kategori} dari cabang olahraga ${cabor} berhasil dihapus.`,
            });
            getPendaftaran();
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: `Pendaftaran tahap 1 dari ${email} untuk kategori ${kategori} dari cabang olahraga ${cabor} gagal dihapus.`,
            });
          });
      },
      onCancel() {},
    });
  };

  const columns: ColumnsType<IPendaftaran> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Pendaftar",
      dataIndex: "user",
      key: "user",
      render: (text) => <span>{text?.fullName}</span>,
    },
    {
      title: "Kabupaten / Kota",
      dataIndex: "city",
      key: "city",
      render: (text) => <span>{text?.name}</span>,
    },
    {
      title: "Cabang Olahraga",
      dataIndex: "class",
      key: "class",
      render: (text) => <span>{text?.sport?.name}</span>,
    },
    {
      title: "Kategori",
      dataIndex: "class",
      key: "class",
      render: (text) => <span>{text?.name}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={"/pendaftaran/" + record.id}>Ubah</Link>
          <a
            onClick={() =>
              onDelete(
                record.id,
                record.email,
                record.class?.name,
                record.class?.sport?.name
              )
            }
          >
            Hapus
          </a>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    getPendaftaran();
  }, []);

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["space"]}>
        <p className={Styles["title"]}>Pendaftaran</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/pendaftaran/create")}
        >
          Tambah
        </Button>
      </div>
      <Table columns={columns} dataSource={pendaftaran} loading={loading} />
    </div>
  );
}

export default Pendaftaran;
