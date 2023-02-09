import React from "react";
import Styles from "./Gender.module.scss";
import { Space, Table, Button, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import { IGenderProps } from "./Gender.d";
import { useGender } from "Helpers/Hooks/Api/useGender";
import { IGender } from "Helpers/Interface/Gender";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function Gender({}: IGenderProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { getGender, loading, gender, deleteGender } = useGender();
  const navigate = useNavigate();

  const onDelete = (id: number, gender: string) => {
    confirm({
      title: `Anda yakin ingin menghapus gender ini?`,
      icon: <ExclamationCircleFilled />,
      content: `Gender ${gender} akan dihapus, dan tidak dapat dikembalikan lagi.`,
      onOk() {
        deleteGender(id)
          .then(() => {
            messageApi.open({
              type: "success",
              content: `Gender ${gender} berhasil dihapus.`,
            });
            getGender();
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: `Gender ${gender} gagal dihapus.`,
            });
          });
      },
      onCancel() {},
    });
  };

  const columns: ColumnsType<IGender> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Gender",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={"/gender/" + record.id}>Ubah</Link>
          <a onClick={() => onDelete(record.id, record.name)}>Hapus</a>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    getGender();
  }, []);

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["space"]}>
        <p className={Styles["title"]}>Gender</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/gender/create")}
        >
          Tambah
        </Button>
      </div>
      <Table columns={columns} dataSource={gender} loading={loading} />
    </div>
  );
}

export default Gender;
