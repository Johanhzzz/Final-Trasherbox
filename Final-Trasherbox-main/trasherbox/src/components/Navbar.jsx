import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserOutlined,
  DashboardOutlined,
  BarChartOutlined,
  FileTextOutlined,
  MailOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Menu, Badge, Dropdown, Space } from "antd";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/productos?busqueda=${search}`);
      setSearch("");
    }
  };

  const menuItems =
    user?.rol === "admin"
      ? [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
            onClick: () => navigate("/admin/dashboard"),
          },
          {
            key: "usuarios",
            icon: <UserOutlined />,
            label: "Usuarios",
            onClick: () => navigate("/admin/users"),
          },
          {
            key: "pedidos",
            icon: <FileTextOutlined />,
            label: "Pedidos",
            onClick: () => navigate("/admin/orders"),
          },
          {
            key: "productos",
            icon: <AppstoreAddOutlined />,
            label: "Productos",
            onClick: () => navigate("/admin/products"),
          },
          {
            key: "contacto",
            icon: <MailOutlined />,
            label: "Solicitudes de contacto",
            onClick: () => navigate("/admin/contact"),
          },
          {
            key: "graficos",
            icon: <BarChartOutlined />,
            label: "Gráficos",
            onClick: () => navigate("/admin/dashboard-grafico"),
          },
        ]
      : [
          {
            key: "panel",
            icon: <HomeOutlined />,
            label: "Inicio",
            onClick: () => navigate("/panel"),
          },
          {
            key: "productos",
            icon: <ShoppingOutlined />,
            label: "Productos",
            onClick: () => navigate("/productos"),
          },
          {
            key: "carrito",
            icon: <ShoppingCartOutlined />,
            label: "Carrito",
            onClick: () => navigate("/carrito"),
          },
        ];

  const userMenu = {
    items: [
      user
        ? {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Cerrar sesión",
            onClick: handleLogout,
          }
        : {
            key: "login",
            icon: <LoginOutlined />,
            label: "Iniciar sesión",
            onClick: () => navigate("/login"),
          },
    ],
  };

  return (
    <header className="navbar">
      <Button
        type="text"
        icon={open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setOpen(!open)}
        className="menu-toggle"
      />

      <h1 className="logo" onClick={() => navigate("/")}>
        TrasherBox
      </h1>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="¿Qué estás buscando?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-icon">🔍</button>
      </form>

      <div className="navbar-actions">
        <Dropdown menu={userMenu} trigger={["click"]}>
          <Space className="user-info">
            <UserOutlined style={{ fontSize: "20px" }} />
            <span>{user ? `Hola, ${user.email}` : "Mi cuenta"}</span>
          </Space>
        </Dropdown>

        {/* Solo clientes ven el carrito */}
        {user?.rol !== "admin" && (
          <Badge count={0} showZero>
            <ShoppingCartOutlined
              style={{ fontSize: "24px", marginLeft: "20px", cursor: "pointer" }}
              onClick={() => alert("Carrito próximamente")}
            />
          </Badge>
        )}
      </div>

      <Drawer
        title="Menú"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
      >
        <Menu mode="vertical" items={menuItems} />
      </Drawer>
    </header>
  );
}

export default Navbar;
