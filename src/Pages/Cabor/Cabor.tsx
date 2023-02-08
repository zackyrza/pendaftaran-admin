import React from "react";
import Styles from "./Cabor.module.scss";
import { Space, Table, Button, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import { ICaborProps } from "./Cabor.d";
import { useCabor } from "Helpers/Hooks/Api/useCabor";
import { ICabor } from "Helpers/Interface/Cabor";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Cabor({}: ICaborProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { getCabor, loading, cabor, deleteCabor } = useCabor();
  const navigate = useNavigate();

  const onDelete = (id: number, sport: string) => {
    confirm({
      title: `Anda yakin ingin menghapus cabang olahraga ini?`,
      icon: <ExclamationCircleFilled />,
      content: `Cabang olahraga ${sport} akan dihapus, dan tidak dapat dikembalikan lagi.`,
      onOk() {
        deleteCabor(id)
          .then(() => {
            messageApi.open({
              type: "success",
              content: `Cabang olahraga ${sport} berhasil dihapus.`,
            });
            getCabor();
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: `Cabang olahraga ${sport} gagal dihapus.`,
            });
          });
      },
      onCancel() {},
    });
  };

  const columns: ColumnsType<ICabor> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Cabor / Cabang olahraga",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={"/cabor/" + record.id}>Ubah</Link>
          <a onClick={() => onDelete(record.id, record.name)}>Hapus</a>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    getCabor();
  }, []);

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["space"]}>
        <p className={Styles["title"]}>Cabor</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/cabor/create")}
        >
          Tambah
        </Button>
      </div>
      <Table columns={columns} dataSource={cabor} loading={loading} />
    </div>
  );
}

export default Cabor;
