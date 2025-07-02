import "../App.css";
import "./Panel.css";
import Carrusel from "../components/Carousel";
import ProductCard from "../components/ProductCard";

// ⚠️ Simulación de productos, reemplaza por fetch desde backend si ya tienes Express conectado
const productos = [
  {
    id: 1,
    title: "Caja grande",
    description: "Caja resistente ideal para mudanzas.",
    price: 4500,
    image: "/images/caja1.jpg",
  },
  {
    id: 2,
    title: "Caja mediana",
    description: "Perfecta para almacenamiento de ropa.",
    price: 3200,
    image: "/images/caja2.jpg",
  },
  {
    id: 3,
    title: "Caja pequeña",
    description: "Ideal para artículos pequeños o frágiles.",
    price: 2000,
    image: "/images/caja3.jpg",
  },
  {
    id: 4,
    title: "Pack 10 cajas",
    description: "Ahorra comprando por mayor.",
    price: 25000,
    image: "/images/pack.jpg",
  },
];

function Panel() {
  const user = JSON.parse(localStorage.getItem("user"));
  const topProductos = productos.slice(0, 4); // Simula "más vendidos"

  return (
    <div className="container">
      <main className="main">
        <h2>
          Bienvenido, <span className="username">{user?.email}</span> 👋
        </h2>
        <p>Aquí puedes revisar productos, cotizar y comprar.</p>

        <Carrusel />

        <h3 className="section-title">Más vendidos</h3>
        <div className="productos-grid">
          {topProductos.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              title={prod.title}
              description={prod.description}
              price={prod.price}
              image={prod.image}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Panel;

