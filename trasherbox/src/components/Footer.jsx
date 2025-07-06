import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>NOSOTROS</h4>
          <ul>
            <li>Sobre Nosotros</li>
            <li>Contáctanos</li>
            <li>+569 4643 2010</li>
            <li>contacto@trasherbox.cl</li>
            <li>Blog</li>
          </ul>
        </div>

        <div>
          <h4>SECCIONES</h4>
          <ul>
            <li>Categorías</li>
            <li>Todos los productos</li>
            <li>Ofertas</li>
            <li>FAQ</li>
            <li>Venta Mayorista</li>
          </ul>
        </div>

        <div>
          <h4>CATEGORÍAS</h4>
          <ul>
            <li>Cajas de cartón</li>
            <li>Embalajes</li>
            <li>Material reciclado</li>
          </ul>
        </div>

        <div>
          <h4>¿NECESITAS AYUDA?</h4>
          <ul>
            <li>Sigue tu pedido</li>
            <li>Preguntas frecuentes</li>
            <li>Devoluciones</li>
            <li>Política de Privacidad</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 TrasherBox | Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
