import React, { useContext } from "react";
import Styles from "./Home.module.scss";

import { IHomeProps } from "./Home.d";
import { Outlet, useNavigate } from "react-router-dom";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined,
  StarOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  ReconciliationOutlined,
  SolutionOutlined,
  LogoutOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { TokenContext, TokenProvider } from "Helpers/Hooks/Context/token";
import { UserContext, UserProvider } from "Helpers/Hooks/Context/user";
import { useAuth } from "Helpers/Hooks/Api/useAuth";

const { Header, Sider, Content } = Layout;

function Home({}: IHomeProps) {
  const navigate = useNavigate();
  const tokenContext = useContext(TokenContext);
  const userContext = useContext(UserContext);
  const { logout } = useAuth();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token && !user) {
      navigate("/login");
      return;
    }
    // @ts-ignore
    tokenContext.setToken(token);
    // @ts-ignore
    userContext.setUser(JSON.parse(user));
    navigate("/kabupaten");
  }, []);

  const [collapsed, setCollapsed] = React.useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <TokenProvider>
      <UserProvider>
        <div className={Styles["wrapper"]}>
          <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
              <div className={Styles["logo"]} />
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["kabupaten"]}
                items={[
                  {
                    key: "kabupaten",
                    icon: <BankOutlined />,
                    label: "Kabupaten / Kota",
                  },
                  {
                    key: "cabor",
                    icon: <StarOutlined />,
                    label: "Cabang Olahraga",
                  },
                  {
                    key: "kategori",
                    icon: <ReadOutlined />,
                    label: "Kategori",
                  },
                  {
                    key: "gender",
                    icon: <UserOutlined />,
                    label: "Gender",
                  },
                  {
                    key: "user",
                    icon: <TeamOutlined />,
                    label: "User",
                  },
                  {
                    key: "pendaftaran",
                    icon: <ReconciliationOutlined />,
                    label: "Pendaftaran",
                  },
                  {
                    key: "kandidat",
                    icon: <SolutionOutlined />,
                    label: "Kandidat",
                  },
                  {
                    key: "cetak",
                    icon: <PrinterOutlined />,
                    label: "Cetak / Print Laporan",
                  },
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Keluar",
                  },
                ]}
                onSelect={({ key }) => {
                  if (key === "logout") {
                    logout().then(() => {
                      localStorage.clear();
                      navigate("/login");
                    });
                    return;
                  }
                  navigate(`/${key}`);
                }}
              />
            </Sider>
            <Layout className={Styles["site-layout"]}>
              <Header style={{ padding: 0, background: colorBgContainer }}>
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: Styles["trigger"],
                    onClick: () => setCollapsed(!collapsed),
                  }
                )}
              </Header>
              <Content
                className={Styles["site-layout-background"]}
                style={{
                  background: colorBgContainer,
                }}
              >
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </div>
      </UserProvider>
    </TokenProvider>
  );
}

export default Home;
