import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Marketplace } from "./pages/Marketplace";
import { MerchantDetail } from "./pages/MerchantDetail";
import { Portfolio } from "./pages/Portfolio";
import { PortfolioProvider } from "./lib/PortfolioContext";

export default function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/merchants/:id" element={<MerchantDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  );
}
