import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

function Carrusel() {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false}>
      <div>
        <img src="/assets/carrusel1.jpg" alt="Promo 1" />
        <p className="legend">Oferta exclusiva</p>
      </div>
      <div>
        <img src="/assets/carrusel2.jpg" alt="Promo 2" />
        <p className="legend">Nuevos productos</p>
      </div>
      <div>
        <img src="/images/carrusel3.jpg" alt="Promo 3" />
        <p className="legend">Los más vendidos</p>
      </div>
    </Carousel>
  );
}

export default Carrusel;
