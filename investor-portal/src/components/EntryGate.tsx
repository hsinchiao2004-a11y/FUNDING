import { Link } from "react-router-dom";
import { TrendUp, Storefront, FileText, ArrowRight } from "@phosphor-icons/react";

const MERCHANT_PORTAL_URL = "https://funding-fefg.vercel.app/";
const MERCHANT_APPLY_URL = "https://funding-fefg.vercel.app/apply";

export function EntryGate() {
  return (
    <section className="border-b border-hairline bg-surface">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-14 text-center sm:py-16">
        <div className="flex items-center gap-2.5">
          <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="8" fill="#059669" />
            <rect x="7" y="17" width="4" height="9" rx="1.5" fill="#ecfdf5" />
            <rect x="14" y="12" width="4" height="14" rx="1.5" fill="#ecfdf5" />
            <rect x="21" y="6" width="4" height="20" rx="1.5" fill="#ecfdf5" />
          </svg>
          <span className="text-xl font-medium tracking-tight text-ink">旺舖</span>
        </div>

        <p className="text-sm text-ink-secondary">商圈優質名店營收分潤平台——你是？</p>

        <div className="grid w-full gap-3 sm:grid-cols-3">
          <Link
            to="/marketplace"
            className="group flex flex-col items-start gap-4 rounded-2xl border border-hairline bg-plane p-5 text-left transition-colors hover:border-accent-300"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
              <TrendUp size={22} weight="duotone" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink">我是投資人</p>
                <p className="mt-0.5 text-xs text-ink-muted">瀏覽商家、投資分潤權</p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600"
              />
            </div>
          </Link>

          <a
            href={MERCHANT_APPLY_URL}
            className="group flex flex-col items-start gap-4 rounded-2xl border border-hairline bg-plane p-5 text-left transition-colors hover:border-accent-300"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
              <FileText size={22} weight="duotone" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink">我是商家，想申請融資</p>
                <p className="mt-0.5 text-xs text-ink-muted">尚未合作，前往填寫申請資料</p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600"
              />
            </div>
          </a>

          <a
            href={MERCHANT_PORTAL_URL}
            className="group flex flex-col items-start gap-4 rounded-2xl border border-hairline bg-plane p-5 text-left transition-colors hover:border-accent-300"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
              <Storefront size={22} weight="duotone" />
            </div>
            <div className="flex flex-1 items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink">我是已合作商家</p>
                <p className="mt-0.5 text-xs text-ink-muted">查看營收、撥款與還款進度</p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
