import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  MagnifyingGlass,
  HandCoins,
  ChartLineUp,
  ShieldCheck,
  Bank,
  Robot,
  Receipt,
  Megaphone,
} from "@phosphor-icons/react";
import { merchants } from "../data/merchants";
import { HeroPreview } from "../components/HeroPreview";
import { FlowLoop } from "../components/FlowLoop";
import { MerchantCard } from "../components/MerchantCard";
import { buttonClasses } from "../components/Button";

const steps = [
  {
    icon: MagnifyingGlass,
    title: "瀏覽你信賴的商家",
    body: "查看真實數位營收數據與 AI 風險評估分數，挑選想支持的店家。",
  },
  {
    icon: HandCoins,
    title: "投資未來營收分潤權",
    body: "最低門檻小額投資，資金進入第三方信託帳戶，依用途撥付給商家。",
  },
  {
    icon: ChartLineUp,
    title: "按月獲得分潤回收",
    body: "商家依實際營收提撥分潤，營收成長時回收加快，並享會員專屬優惠。",
  },
];

const trustPoints = [
  { icon: Bank, label: "資金第三方信託保管" },
  { icon: Robot, label: "AI 持續監控營收異常" },
  { icon: Receipt, label: "電子發票交叉驗證營收" },
  { icon: ShieldCheck, label: "分潤結算全程可追蹤" },
];

export function Landing() {
  const featured = merchants.slice(0, 3);

  return (
    <div>
      {/* Hero — split, not centered */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pt-16 pb-20 lg:grid-cols-2 lg:items-center lg:pt-20 lg:pb-28">
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            把你愛的店，變成你的收益
          </h1>
          <p className="max-w-md text-base leading-relaxed text-ink-secondary">
            小額投資你信賴的商家，隨其營收成長按月獲得分潤，同時享有專屬會員優惠。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/marketplace" className={buttonClasses("primary", "lg")}>
              開始投資
            </Link>
            <a href="#how-it-works" className={buttonClasses("ghost", "lg")}>
              了解運作方式
            </a>
          </div>
        </div>
        <div className="lg:pl-8">
          <HeroPreview />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          {trustPoints.map((point) => (
            <div key={point.label} className="flex items-center gap-2.5">
              <point.icon size={18} weight="duotone" className="shrink-0 text-accent-600" />
              <span className="text-sm text-ink-secondary">{point.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — 3-cell bento */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 scroll-mt-16">
        <h2 className="max-w-lg text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          三個步驟，成為商家的營收夥伴
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                <step.icon size={22} weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-muted">STEP {i + 1}</p>
                <h3 className="mt-1 font-medium text-ink">{step.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-secondary">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Investment x consumption loop — distinct layout family */}
      <section className="border-y border-hairline bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-lg">
            <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              不只是投資，更是一種消費關係
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
              傳統投資是「投資後等待收益」；旺舖希望你同時是投資人，也是最忠實的消費者。
            </p>
          </div>
          <div className="mt-10">
            <FlowLoop />
          </div>
        </div>
      </section>

      {/* Featured merchants — real component preview */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            正在募資的商家
          </h2>
          <Link to="/marketplace" className="text-sm font-medium text-accent-700 hover:text-accent-800">
            瀏覽全部商家 →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      </section>

      {/* AI Agent — 2-cell card grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg">
            <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              背後有 AI Agent 持續運作
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
              不只是跑一次評分，而是持續監控、主動給建議。
            </p>
          </div>
          <Link to="/agents" className="text-sm font-medium text-accent-700 hover:text-accent-800">
            查看 AI Agent 詳情 →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
              <MagnifyingGlass size={22} weight="duotone" />
            </div>
            <h3 className="font-medium text-ink">風險監測管理 Agent</h3>
            <p className="text-sm leading-relaxed text-ink-secondary">
              持續掃描你持有的每一筆分潤權與商家風險狀態，主動給出建議，而不是等你自己發現異常。
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
              <Megaphone size={22} weight="duotone" />
            </div>
            <h3 className="font-medium text-ink">「投資人變消費者」促購 Agent</h3>
            <p className="text-sm leading-relaxed text-ink-secondary">
              偵測到投資商家營收不如預期時，主動生成邀請消費的訊息，把焦慮轉化成幫商家拉抬營收的具體行動。
            </p>
          </div>
        </div>
      </section>

      {/* Risk & transparency — vertical stack, not zigzag */}
      <section className="border-t border-hairline bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            投資有風險，我們選擇透明面對
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-secondary">
            分潤金額與商家實際營收連動，營收下降時分潤同步降低；平台以多重資料來源交叉驗證，降低造假與異常風險。
          </p>
          <div className="mx-auto mt-10 grid max-w-xl gap-4 text-left sm:grid-cols-2">
            {[
              "營收淡旺季波動，分潤金額隨之調整，降低短期還款壓力",
              "POS、電子支付、銀行金流與電子發票交叉比對，防止營收灌水",
              "投資人資金進入第三方信託帳戶，平台不直接經手動用",
              "異常下降觸發人工審查，必要時依契約展延或處理",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-hairline bg-plane p-4">
                <ShieldCheck size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent-600" />
                <p className="text-sm leading-relaxed text-ink-secondary">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA — centered, manifesto-style close */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="whitespace-nowrap text-sm font-medium tracking-tight text-ink sm:text-2xl md:text-3xl">
          讓每一家有潛力的好店，都有機會被投資。
        </h2>
        <div className="mt-8 flex justify-center">
          <Link to="/marketplace" className={buttonClasses("primary", "lg")}>
            開始投資
          </Link>
        </div>
      </section>
    </div>
  );
}
