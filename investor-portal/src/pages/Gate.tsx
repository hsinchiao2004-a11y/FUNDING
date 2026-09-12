import { Link } from "react-router-dom";
import { TrendUp, Storefront, FileText, ArrowRight } from "@phosphor-icons/react";
import { Footer } from "../components/Footer";

const MERCHANT_PORTAL_URL = "https://funding-fefg.vercel.app/";
const MERCHANT_APPLY_URL = "https://funding-fefg.vercel.app/apply/new";

const options = [
  {
    to: "/investor",
    external: false,
    icon: TrendUp,
    title: "我是投資人",
    body: "瀏覽商家、投資分潤權",
  },
  {
    to: MERCHANT_APPLY_URL,
    external: true,
    icon: FileText,
    title: "我是商家，想申請融資",
    body: "尚未合作，前往填寫申請資料",
  },
  {
    to: MERCHANT_PORTAL_URL,
    external: true,
    icon: Storefront,
    title: "我是已合作商家",
    body: "查看營收、撥款與還款進度",
  },
];

export function Gate() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-7 text-center">
          <div className="flex items-center gap-2.5">
            <svg width="40" height="40" viewBox="0 0 32 32" aria-hidden>
              <rect width="32" height="32" rx="8" fill="#059669" />
              <rect x="7" y="17" width="4" height="9" rx="1.5" fill="#ecfdf5" />
              <rect x="14" y="12" width="4" height="14" rx="1.5" fill="#ecfdf5" />
              <rect x="21" y="6" width="4" height="20" rx="1.5" fill="#ecfdf5" />
            </svg>
            <span className="text-2xl font-medium tracking-tight text-ink">旺舖</span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              商圈優質名店營收分潤平台
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-ink-secondary sm:text-base">
              投資人以小額資金投資商家未來營收分潤權，商家則以未來營收換取資金與資源——不是借貸，也不是股權稀釋。
            </p>
          </div>

          <p className="text-sm font-medium text-ink-muted">你是？</p>

          <div className="grid w-full gap-3 sm:grid-cols-3">
            {options.map((option) => {
              const cardClasses =
                "group flex flex-col items-start gap-4 rounded-2xl border border-hairline bg-plane p-5 text-left transition-colors hover:border-accent-300";
              const content = (
                <>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                    <option.icon size={22} weight="duotone" />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-ink">{option.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{option.body}</p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600"
                    />
                  </div>
                </>
              );
              return option.external ? (
                <a key={option.title} href={option.to} className={cardClasses}>
                  {content}
                </a>
              ) : (
                <Link key={option.title} to={option.to} className={cardClasses}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
