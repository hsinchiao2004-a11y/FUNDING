import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";

// Minimal chrome for prospective merchants who have not yet partnered with
// the platform — no dashboard / repayment / data-source tabs, no merchant
// profile badge. Only the application flow itself is shown.
export function OnboardingLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-hairline bg-plane/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="8" fill="#059669" />
            <rect x="7" y="17" width="4" height="9" rx="1.5" fill="#ecfdf5" />
            <rect x="14" y="12" width="4" height="14" rx="1.5" fill="#ecfdf5" />
            <rect x="21" y="6" width="4" height="20" rx="1.5" fill="#ecfdf5" />
          </svg>
          <span className="text-[15px] font-medium tracking-tight text-ink">挺店商家融資申請</span>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
