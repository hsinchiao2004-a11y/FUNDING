import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Marketplace } from "./pages/Marketplace";
import { MerchantDetail } from "./pages/MerchantDetail";
import { Portfolio } from "./pages/Portfolio";
import { Transfers } from "./pages/Transfers";
import { Agents } from "./pages/Agents";
import { Coupons } from "./pages/Coupons";
import { PortfolioProvider } from "./lib/PortfolioContext";
import { TransferMarketProvider } from "./lib/TransferMarketContext";
import { NotificationProvider } from "./lib/NotificationContext";
import { CouponProvider } from "./lib/CouponContext";

export default function App() {
  return (
    <PortfolioProvider>
      <TransferMarketProvider>
        <NotificationProvider>
          <CouponProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/merchants/:id" element={<MerchantDetail />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/transfers" element={<Transfers />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/coupons" element={<Coupons />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CouponProvider>
        </NotificationProvider>
      </TransferMarketProvider>
    </PortfolioProvider>
  );
}
