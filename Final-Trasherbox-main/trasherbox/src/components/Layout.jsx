import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem', minHeight: '80vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
