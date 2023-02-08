import React from "react";
import Styles from "./Kabupaten.module.scss";
import { Space, Table, Button, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import { IKabupatenProps } from "./Kabupaten.d";
import { useKabupaten } from "Helpers/Hooks/Api/useKabupaten";
import { IKabupaten } from "Helpers/Interface/Kabupaten";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Kabupaten({}: IKabupatenProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { getKabupaten, loading, kabupaten, deleteKabupaten } = useKabupaten();
  const navigate = useNavigate();

  const onDelete = (id: number, city: string) => {
    confirm({
      title: `Anda yakin ingin menghapus kota ini?`,
      icon: <ExclamationCircleFilled />,
      content: `Kota ${city} akan dihapus, dan tidak dapat dikembalikan lagi.`,
      onOk() {
        deleteKabupaten(id)
          .then(() => {
            messageApi.open({
              type: "success",
              content: `Kota ${city} berhasil dihapus.`,
            });
            getKabupaten();
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: `Kota ${city} gagal dihapus.`,
            });
          });
      },
      onCancel() {},
    });
  };

  const columns: ColumnsType<IKabupaten> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Kabupaten / Kota",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={"/kabupaten/" + record.id}>Ubah</Link>
          <a onClick={() => onDelete(record.id, record.name)}>Hapus</a>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    getKabupaten();
  }, []);

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["space"]}>
        <p className={Styles["title"]}>Kabupaten</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/kabupaten/create")}
        >
          Tambah
        </Button>
      </div>
      <Table columns={columns} dataSource={kabupaten} loading={loading} />
    </div>
  );
}

export default Kabupaten;
