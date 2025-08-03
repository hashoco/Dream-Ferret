// src/layouts/MainLayout.jsx
import Header from '../component/Header';
import Footer from '../component/Footer';
import McpWidget from '../component/McpWidget';


export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
       <McpWidget />
      <Footer />
    </>
  );
}