import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>TRASHERBOX</h4>
          <p>Empaqueta con confianza y sostenibilidad.</p>
          <p>
            Ofrecemos <strong>soluciones de embalaje de alta calidad</strong>,
            desde cajas y embalajes reciclados hasta productos personalizados.
          </p>
        </div>

        <div className="footer-section">
          <h4>CONTACTO</h4>
          <p>
            Correo:{" "}
            <a href="mailto:contacto@trasherbox.cl">
              contacto@trasherbox.cl
            </a>
          </p>
          <p>
            WhatsApp:{" "}
            <a href="https://wa.me/56946432010" target="_blank" rel="noreferrer">
              +56 9 4643 2010
            </a>
          </p>
          <p>
            Dirección: Av. Ejemplo 1234, Santiago <br />
            Lun-Vie: 9:00 a 18:00
          </p>
        </div>

        <div className="footer-section">
          <h4>INFORMACIÓN</h4>
          <ul>
            <li>Preguntas Frecuentes</li>
            <li>Política de Privacidad</li>
            <li>Términos del Servicio</li>
            <li>Política de Reembolsos</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>¡SUSCRÍBETE GRATIS!</h4>
          <p>Recibe ofertas exclusivas y consejos útiles</p>
          <input type="email" placeholder="Tu email" />
          <button>Suscribir</button>
          <div className="metodos-pago">
            <p>Aceptamos:</p>
            <img src="/visa.png" alt="Visa" />
            <img src="/webpay.png" alt="Webpay" />
            <img src="/mastercard.png" alt="Mastercard" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 TrasherBox. Todos los derechos reservados.</p>
        <div className="social-icons">
          <a href="#"><i className="fa-brands fa-instagram"></i></a>
          <a href="#"><i className="fa-brands fa-facebook"></i></a>
          <a href="#"><i className="fa-brands fa-youtube"></i></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
