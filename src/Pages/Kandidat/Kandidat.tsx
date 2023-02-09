import React from "react";
import Styles from "./Kandidat.module.scss";
import { Space, Table, Button, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import { IKandidatProps } from "./Kandidat.d";
import { useKandidat } from "Helpers/Hooks/Api/useKandidat";
import { IKandidat } from "Helpers/Interface/Kandidat";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Kandidat({}: IKandidatProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { getKandidat, loading, kandidat, deleteKandidat } = useKandidat();
  const navigate = useNavigate();

  const onDelete = (id: number, name: string) => {
    confirm({
      title: `Anda yakin ingin menghapus kandidat ini?`,
      icon: <ExclamationCircleFilled />,
      content: `Kandidat atas nama ${name} akan dihapus, dan tidak dapat dikembalikan lagi.`,
      onOk() {
        deleteKandidat(id)
          .then(() => {
            messageApi.open({
              type: "success",
              content: `Kandidat atas nama ${name} berhasil dihapus.`,
            });
            getKandidat();
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: `Kandidat atas nama ${name} gagal dihapus.`,
            });
          });
      },
      onCancel() {},
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
      title: "Kabupaten / Kota",
      dataIndex: "registration",
      key: "registration",
      render: (text) => <span>{text?.city?.name}</span>,
    },
    {
      title: "Kategori",
      dataIndex: "registration",
      key: "registration",
      render: (text) => <span>{text?.class?.name}</span>,
    },
    {
      title: "Cabang Olahraga",
      dataIndex: "registration",
      key: "registration",
      render: (text) => <span>{text?.class?.sport?.name}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={"/kandidat/" + record.id}>Ubah</Link>
          <a onClick={() => onDelete(record.id, record.name)}>Hapus</a>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    getKandidat();
  }, []);

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
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
      <Table columns={columns} dataSource={kandidat} loading={loading} />
    </div>
  );
}

export default Kandidat;
