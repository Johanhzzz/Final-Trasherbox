import ProductCard from "../components/ProductCard";
import "./Productos.css";

function Productos() {
  const productos = [
    {
      id: 1,
      title: "Caja Cartón Grande",
      description: "60x40x40 cm",
      price: 2990,
      image: "/assets/carrusel1.jpg",
    },
    {
      id: 2,
      title: "Caja Cartón Mediana",
      description: "40x30x30 cm",
      price: 1890,
      image: "/assets/carrusel2.jpg",
    },
    {
      id: 3,
      title: "Caja Cartón Pequeña",
      description: "20x20x20 cm",
      price: 990,
      image: "https://via.placeholder.com/300x200?text=Pequeña",
    },
  ];

  return (
    <>
      <div className="productos-container">
        <h1 className="productos-title">Nuestros Productos</h1>
        <div className="productos-grid">
          {productos.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Productos;
