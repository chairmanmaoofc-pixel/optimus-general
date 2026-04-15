import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import Layout from "./Layout";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import Services from "@/pages/Services";
import Reviews from "@/pages/Reviews";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout><PageTransition><Index /></PageTransition></Layout>} />
        <Route path="/products" element={<Layout><PageTransition><Products /></PageTransition></Layout>} />
        <Route path="/services" element={<Layout><PageTransition><Services /></PageTransition></Layout>} />
        <Route path="/reviews" element={<Layout><PageTransition><Reviews /></PageTransition></Layout>} />
        <Route path="/about" element={<Layout><PageTransition><About /></PageTransition></Layout>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/cart" element={<Layout><PageTransition><Cart /></PageTransition></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
