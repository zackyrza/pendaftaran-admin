import React from "react";
import Styles from "./User.module.scss";
import { Space, Table, Button, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import { IUserProps } from "./User.d";
import { useAuth } from "Helpers/Hooks/Api/useAuth";
import { IUser } from "Helpers/Interface/User";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

function User({}: IUserProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { getUser, loading, users, deleteUser } = useAuth();
  const navigate = useNavigate();

  const onDelete = (id: number, name: string) => {
    confirm({
      title: `Anda yakin ingin menghapus user ini?`,
      icon: <ExclamationCircleFilled />,
      content: `User ${name} akan dihapus, dan tidak dapat dikembalikan lagi.`,
      onOk() {
        deleteUser(id)
          .then(() => {
            messageApi.open({
              type: "success",
              content: `User ${name} berhasil dihapus.`,
            });
            getUser();
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: `User ${name} gagal dihapus.`,
            });
          });
      },
      onCancel() {},
    });
  };

  const columns: ColumnsType<IUser> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Nama",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={"/user/" + record.id}>Ubah</Link>
          <a onClick={() => onDelete(record.id, record.fullName)}>Hapus</a>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={Styles["wrapper"]}>
      {contextHolder}
      <div className={Styles["space"]}>
        <p className={Styles["title"]}>User</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/user/create")}
        >
          Tambah
        </Button>
      </div>
      <Table columns={columns} dataSource={users} loading={loading} />
    </div>
  );
}

export default User;
