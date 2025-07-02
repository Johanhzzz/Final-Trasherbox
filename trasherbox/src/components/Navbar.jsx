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

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Inicio",
      onClick: () => navigate("/panel"),
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,
      label: "Productos",
      onClick: () => navigate("/productos"),
    },
    {
      key: "3",
      icon: <ShoppingCartOutlined />,
      label: "Carrito",
      onClick: () => navigate("/Carrito"),
    },
    {
      key: "4",
      icon: <ShoppingOutlined />,
      label: "Cotizaciones",
      onClick: () => alert("Cotizaciones próximamente"),
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
      {/* Menú Hamburguesa */}
      <Button
        type="text"
        icon={open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setOpen(!open)}
        className="menu-toggle"
      />

      {/* Logo */}
      <h1 className="logo" onClick={() => navigate("/")}>
        TrasherBox
      </h1>

      {/* Buscador */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="¿Qué estás buscando?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-icon">🔍</button>
      </form>

      {/* Usuario y Carrito */}
      <div className="navbar-actions">
        <Dropdown menu={userMenu} trigger={['click']}>
          <Space className="user-info">
            <UserOutlined style={{ fontSize: '20px' }} />
            <span>
              {user ? `Hola, ${user.email}` : "Mi cuenta"}
            </span>
          </Space>
        </Dropdown>

        <Badge count={0} showZero>
          <ShoppingCartOutlined
            style={{ fontSize: "24px", marginLeft: "20px", cursor: "pointer" }}
            onClick={() => navigate("/Carrito")}
          />
        </Badge>
      </div>

      {/* Menú Lateral */}
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
