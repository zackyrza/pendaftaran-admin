import React from "react";
import Styles from "./Kategori.module.scss";
import { Space, Table, Button, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import { IKategoriProps } from "./Kategori.d";
import { useKategori } from "Helpers/Hooks/Api/useKategori";
import { IKategori } from "Helpers/Interface/Kategori";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Kategori({}: IKategoriProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { getKategori, loading, kategori, deleteKategori } = useKategori();
  const navigate = useNavigate();

  const onDelete = (id: number, city: string) => {
    confirm({
      title: `Anda yakin ingin menghapus kategori ini?`,
      icon: <ExclamationCircleFilled />,
      content: `Kategori ${city} akan dihapus, dan tidak dapat dikembalikan lagi.`,
      onOk() {
        deleteKategori(id)
          .then(() => {
            messageApi.open({
              type: "success",
              content: `Kategori ${city} berhasil dihapus.`,
            });
            getKategori();
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: `Kategori ${city} gagal dihapus.`,
            });
          });
      },
      onCancel() {},
    });
  };

  const columns: ColumnsType<IKategori> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Kategori",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={"/kategori/" + record.id}>Ubah</Link>
          <a onClick={() => onDelete(record.id, record.name)}>Hapus</a>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    getKategori();
  }, []);

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["space"]}>
        <p className={Styles["title"]}>Kategori</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/kategori/create")}
        >
          Tambah
        </Button>
      </div>
      <Table columns={columns} dataSource={kategori} loading={loading} />
    </div>
  );
}

export default Kategori;
