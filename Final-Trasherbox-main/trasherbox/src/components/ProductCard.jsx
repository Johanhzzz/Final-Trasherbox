import "./ProductCard.css";

function ProductCard({ id, title, description, price, image }) {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = { id, title, price, image, quantity: 1 };

    const existingProduct = cart.find((item) => item.id === id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Producto agregado al carrito");
  };

  return (
    <div className="product-card">
      <div className="discount-label">14% OFF</div>
      <img src={image} alt={title} className="product-image" />

      <div className="product-info">
        <p className="product-price">
          <span className="discounted-price">${price}</span>
          <span className="original-price">${(price * 1.16).toFixed(0)}</span>
        </p>

        <h3 className="product-title">{title}</h3>
        <p className="product-description">{description}</p>

        <div className="product-rating">
          <span className="stars">★★★★★</span>
          <span className="reviews">6 reseñas</span>
        </div>

        <p className="product-availability">🟢 Producto disponible</p>

        <button className="add-to-cart" onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
