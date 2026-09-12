import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { OnboardingLayout } from "./components/OnboardingLayout";
import { Dashboard } from "./pages/Dashboard";
import { Apply } from "./pages/Apply";
import { Repayment } from "./pages/Repayment";
import { Connections } from "./pages/Connections";
import { ApplicationProvider } from "./lib/ApplicationContext";

export default function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <Routes>
          {/* Prospective merchant, not yet partnered — application flow only, no dashboard chrome */}
          <Route element={<OnboardingLayout />}>
            <Route path="/apply/new" element={<Apply />} />
          </Route>

          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/repayment" element={<Repayment />} />
            <Route path="/connections" element={<Connections />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApplicationProvider>
  );
}
