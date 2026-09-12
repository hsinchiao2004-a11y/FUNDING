import { useMemo, useState } from "react";
import clsx from "clsx";
import { merchants } from "../data/merchants";
import { MerchantCard } from "../components/MerchantCard";

const categories = ["全部", "特色餐飲", "選物店", "生活品牌"];

type SortKey = "popular" | "return" | "progress";

const sorters: Record<SortKey, string> = {
  popular: "熱門募資",
  return: "預估年化最高",
  progress: "募資進度最快",
};

export function Marketplace() {
  const [category, setCategory] = useState("全部");
  const [sort, setSort] = useState<SortKey>("popular");

  const list = useMemo(() => {
    let result = merchants.filter(
      (m) => category === "全部" || m.category === category,
    );
    if (sort === "return") {
      result = [...result].sort(
        (a, b) => b.financing.expectedAnnualReturn[1] - a.financing.expectedAnnualReturn[1],
      );
    } else if (sort === "progress") {
      result = [...result].sort(
        (a, b) =>
          b.financing.raised / b.financing.amount - a.financing.raised / a.financing.amount,
      );
    } else {
      result = [...result].sort((a, b) => b.financing.investors - a.financing.investors);
    }
    return result;
  }, [category, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-medium tracking-tight text-ink">瀏覽商家</h1>
        <p className="max-w-lg text-sm leading-relaxed text-ink-secondary">
          每一家商家都提供數位營收數據與 AI 風險評估分數，協助你判斷投資決策。
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                category === c
                  ? "bg-accent-600 text-white"
                  : "border border-hairline bg-surface text-ink-secondary hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-hairline bg-surface px-4 py-1.5 text-sm text-ink-secondary outline-none focus:border-accent-400"
        >
          {Object.entries(sorters).map(([key, label]) => (
            <option key={key} value={key}>
              排序：{label}
            </option>
          ))}
        </select>
      </div>

      {list.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-hairline py-16 text-center">
          <p className="font-medium text-ink">目前沒有符合條件的商家</p>
          <p className="text-sm text-ink-muted">試試切換其他分類</p>
        </div>
      )}
    </div>
  );
}
