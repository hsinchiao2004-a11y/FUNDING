import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
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
