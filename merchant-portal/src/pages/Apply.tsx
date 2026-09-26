import { useRef, useState } from "react";
import clsx from "clsx";
import {
  Sparkle,
  Info,
  Plus,
  Trash,
  Buildings,
  IdentificationCard,
  Receipt,
  Bank,
  FileArrowUp,
  X,
  ShieldCheck,
  CircleNotch,
  Check,
  Gift,
} from "@phosphor-icons/react";
import { useApplications } from "../lib/ApplicationContext";
import {
  emptyCreditProfile,
  fetchExternalCreditScore,
  tierFromScore,
  assessCredit,
  isValidTaxId,
  type CreditProfile,
  type CreditAssessment,
} from "../lib/underwriting";
import { Button } from "../components/Button";
import { formatTWD, clamp } from "../lib/format";

interface AllocationItem {
  id: number;
  label: string;
  pct: number;
}

const initialItems: AllocationItem[] = [
  { id: 1, label: "租金保證金", pct: 40 },
  { id: 2, label: "店面裝修", pct: 40 },
  { id: 3, label: "設備採購", pct: 20 },
];

const REWARD_PRESETS = ["優惠券", "店內特色紀念小物", "會員專屬活動", "到店消費折抵"];

type Stage = "verify" | "result" | "terms" | "amount" | "success";

export function Apply() {
  const { applications, submit } = useApplications();
  const [stage, setStage] = useState<Stage>("verify");

  const [profile, setProfile] = useState<CreditProfile>(emptyCreditProfile);
  const [queryingScore, setQueryingScore] = useState(false);
  const [assessment, setAssessment] = useState<CreditAssessment | null>(null);

  const [amount, setAmount] = useState(0);
  const [items, setItems] = useState<AllocationItem[]>(initialItems);
  const nextId = useRef(initialItems.length + 1);

  // 核准後才可設定的細項：分潤比例與回饋方式，皆由商家自行決定。
  const [shareRatePct, setShareRatePct] = useState(0);
  const [rewardOffers, setRewardOffers] = useState<string[]>([]);
  const [customReward, setCustomReward] = useState("");

  const companyNameValid = profile.companyName.trim() !== "";
  const taxIdValid = isValidTaxId(profile.taxId);
  const bankAccountsValid =
    profile.bankAccounts.length > 0 && profile.bankAccounts.every((a) => a.trim() !== "");
  const canProceedToResult =
    companyNameValid && taxIdValid && profile.incomeTaxDocsUploaded && profile.businessTaxDocsUploaded &&
    bankAccountsValid &&
    profile.bankStatementUploaded && profile.creditScore !== null;

  const updateBankAccount = (index: number, value: string) => {
    setProfile((p) => ({
      ...p,
      bankAccounts: p.bankAccounts.map((a, i) => (i === index ? value : a)),
    }));
  };
  const addBankAccount = () =>
    setProfile((p) => ({ ...p, bankAccounts: [...p.bankAccounts, ""] }));
  const removeBankAccount = (index: number) =>
    setProfile((p) => ({
      ...p,
      bankAccounts: p.bankAccounts.length > 1 ? p.bankAccounts.filter((_, i) => i !== index) : p.bankAccounts,
    }));

  const queryCreditScore = () => {
    if (profile.creditScore !== null) return;
    setQueryingScore(true);
    window.setTimeout(() => {
      setProfile((p) => ({ ...p, creditScore: fetchExternalCreditScore() }));
      setQueryingScore(false);
    }, 800);
  };

  const goToResult = () => {
    const result = assessCredit(profile);
    if (!result) return;
    setAssessment(result);
    setStage("result");
  };

  const goToTerms = () => {
    if (!assessment) return;
    const [minRate, maxRate] = assessment.suggestedShareRateRange;
    setShareRatePct(Math.round((minRate + maxRate) / 2 * 10) / 10);
    setStage("terms");
  };

  const toggleReward = (r: string) => {
    setRewardOffers((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  const startApplication = () => {
    if (!assessment) return;
    const [min, max] = assessment.suggestedRange;
    setAmount(Math.round((min + max) / 2 / 10_000) * 10_000);
    setStage("amount");
  };

  const total = items.reduce((sum, item) => sum + item.pct, 0);
  const hasEmptyLabel = items.some((item) => item.label.trim() === "");
  const isValidAllocation = total === 100 && !hasEmptyLabel && items.length > 0;

  const updateLabel = (id: number, label: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, label } : item)));
  };
  const updatePct = (id: number, pct: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, pct: clamp(pct, 0, 100) } : item)));
  };
  const addItem = () => setItems((prev) => [...prev, { id: nextId.current++, label: "", pct: 0 }]);
  const removeItem = (id: number) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));

  const allRewards = [...rewardOffers, ...(customReward.trim() ? [customReward.trim()] : [])];

  const handleSubmit = () => {
    if (!isValidAllocation) return;
    submit({
      amount,
      allocation: items.map(({ label, pct }) => ({ label: label.trim(), pct })),
      shareRatePct,
      rewardOffers: allRewards,
    });
    setStage("success");
  };

  // ---------- Stage: success ----------
  if (stage === "success") {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
          <Sparkle size={26} weight="fill" />
        </div>
        <h1 className="mt-4 text-2xl font-medium tracking-tight text-ink">申請已送出（示範）</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          {profile.companyName || "貴公司"}申請金額 {formatTWD(amount)}，每月營收分潤比例 {shareRatePct}%，
          平台將於 1–2 個工作天內完成 AI 風險評估與人工審查。
        </p>
        {allRewards.length > 0 && (
          <p className="mt-2 text-xs text-ink-muted">投資人回饋方案：{allRewards.join("、")}</p>
        )}
        <Button className="mt-6" onClick={() => setStage("amount")}>
          再送一筆申請
        </Button>
      </div>
    );
  }

  // ---------- Stage: verify (KYC / underwriting data) ----------
  if (stage === "verify") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">申請融資</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
          第一步：核實商家資料，平台將依此判斷有／無擔保核貸額度、每月額度與最低還款條件。
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-ink-muted">
          <span className="text-accent-700">① 核實資料</span>
          <span>—</span>
          <span>② 核貸結果</span>
          <span>—</span>
          <span>③ 分潤與回饋設定</span>
          <span>—</span>
          <span>④ 申請金額</span>
        </div>

        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-hairline bg-surface p-6">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <Buildings size={16} className="text-ink-muted" /> 公司名稱
            </label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile((p) => ({ ...p, companyName: e.target.value }))}
              placeholder="例如：花見咖啡有限公司"
              className="rounded-xl border border-hairline bg-plane px-3 py-2 text-sm text-ink outline-none focus:border-accent-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <IdentificationCard size={16} className="text-ink-muted" /> 統一編號
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={profile.taxId}
              onChange={(e) => setProfile((p) => ({ ...p, taxId: e.target.value.replace(/\D/g, "") }))}
              placeholder="8 碼統一編號"
              className="rounded-xl border border-hairline bg-plane px-3 py-2 text-sm text-ink outline-none focus:border-accent-400"
            />
            {profile.taxId.length > 0 && !taxIdValid && (
              <p className="text-xs text-status-critical">統一編號需為 8 碼數字</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <Receipt size={16} className="text-ink-muted" /> 歷年營利事業所得稅申報資料
            </span>
            <p className="text-xs text-ink-muted">請上傳自開始繳納營利事業所得稅以來的歷年申報資料。</p>
            {profile.incomeTaxDocsUploaded ? (
              <div className="flex items-center justify-between rounded-xl border border-hairline bg-plane px-3 py-2">
                <span className="text-sm text-ink-secondary">歷年營利事業所得稅申報資料.pdf 已上傳</span>
                <button
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, incomeTaxDocsUploaded: false }))}
                  className="text-ink-muted hover:text-status-critical"
                  aria-label="移除已上傳檔案"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setProfile((p) => ({ ...p, incomeTaxDocsUploaded: true }))}
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-dashed border-hairline px-3 py-2 text-sm text-ink-secondary hover:border-accent-400 hover:text-accent-700"
              >
                <FileArrowUp size={16} /> 上傳歷年營利事業所得稅申報資料（示範：點擊即模擬上傳）
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <Receipt size={16} className="text-ink-muted" /> 歷年營業稅籍資料
            </span>
            <p className="text-xs text-ink-muted">請上傳自開始繳納營業稅以來的歷年申報資料。</p>
            {profile.businessTaxDocsUploaded ? (
              <div className="flex items-center justify-between rounded-xl border border-hairline bg-plane px-3 py-2">
                <span className="text-sm text-ink-secondary">歷年營業稅籍資料.pdf 已上傳</span>
                <button
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, businessTaxDocsUploaded: false }))}
                  className="text-ink-muted hover:text-status-critical"
                  aria-label="移除已上傳檔案"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setProfile((p) => ({ ...p, businessTaxDocsUploaded: true }))}
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-dashed border-hairline px-3 py-2 text-sm text-ink-secondary hover:border-accent-400 hover:text-accent-700"
              >
                <FileArrowUp size={16} /> 上傳歷年營業稅籍資料（示範：點擊即模擬上傳）
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <Bank size={16} className="text-ink-muted" /> 商家銀行帳戶（戶名／帳號）
            </label>
            <p className="text-xs text-ink-muted">可提供多筆帳戶。</p>
            <div className="flex flex-col gap-2">
              {profile.bankAccounts.map((account, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => updateBankAccount(index, e.target.value)}
                    placeholder="例如：花見咖啡有限公司 / 012-3456789012"
                    className="min-w-0 flex-1 rounded-xl border border-hairline bg-plane px-3 py-2 text-sm text-ink outline-none focus:border-accent-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeBankAccount(index)}
                    disabled={profile.bankAccounts.length === 1}
                    aria-label="刪除這筆帳戶"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-plane hover:text-status-critical disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addBankAccount}
              className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent-700 hover:text-accent-800"
            >
              <Plus size={15} weight="bold" /> 新增帳戶
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">銀行對帳單／存摺封面</span>
            {profile.bankStatementUploaded ? (
              <div className="flex items-center justify-between rounded-xl border border-hairline bg-plane px-3 py-2">
                <span className="text-sm text-ink-secondary">對帳單.pdf 已上傳</span>
                <button
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, bankStatementUploaded: false }))}
                  className="text-ink-muted hover:text-status-critical"
                  aria-label="移除已上傳檔案"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setProfile((p) => ({ ...p, bankStatementUploaded: true }))}
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-dashed border-hairline px-3 py-2 text-sm text-ink-secondary hover:border-accent-400 hover:text-accent-700"
              >
                <FileArrowUp size={16} /> 上傳銀行對帳單／存摺（示範：點擊即模擬上傳）
              </button>
            )}
          </div>

          <label className="flex items-start gap-2.5 rounded-xl border border-hairline bg-plane px-3 py-2.5">
            <input
              type="checkbox"
              checked={profile.posConnected}
              onChange={(e) => setProfile((p) => ({ ...p, posConnected: e.target.checked }))}
              className="mt-0.5 accent-accent-600"
            />
            <span className="text-sm text-ink-secondary">
              提供 POS 交易數據（選填）——有助於提高核准額度、降低最低還款比例
            </span>
          </label>

          <div className="flex flex-col gap-2 border-t border-hairline pt-5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <ShieldCheck size={16} className="text-ink-muted" /> 信用紀錄與評分
            </span>
            <p className="text-xs text-ink-muted">
              資料來源：聯合徵信中心與往來銀行信用評等，非本平台自行評分。
            </p>
            {profile.creditScore === null ? (
              <Button
                variant="ghost"
                size="md"
                className="w-fit"
                onClick={queryCreditScore}
                disabled={queryingScore}
              >
                {queryingScore ? <CircleNotch size={15} className="animate-spin" /> : null}
                {queryingScore ? "查詢中…" : "查詢往來銀行信用評等"}
              </Button>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-hairline bg-plane px-3 py-2.5">
                <span className="tabular font-mono text-lg font-medium text-accent-700">{profile.creditScore}</span>
                <span className="text-sm text-ink-secondary">{tierFromScore(profile.creditScore)}</span>
              </div>
            )}
          </div>
        </div>

        <Button className="mt-6 w-full" size="lg" disabled={!canProceedToResult} onClick={goToResult}>
          查看核貸額度
        </Button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-muted">
          本頁為產品原型示範，所有資料僅儲存於本機瀏覽器，不會實際上傳或查詢真實聯徵資料。
        </p>
      </div>
    );
  }

  // ---------- Stage: result (underwriting outcome) ----------
  if (stage === "result" && assessment) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">核貸結果</h1>
        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-ink-muted">
          <button onClick={() => setStage("verify")} className="hover:text-ink">① 核實資料</button>
          <span>—</span>
          <span className="text-accent-700">② 核貸結果</span>
          <span>—</span>
          <span>③ 分潤與回饋設定</span>
          <span>—</span>
          <span>④ 申請金額</span>
        </div>

        <div className="mt-6 rounded-2xl border border-hairline bg-surface p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-accent-50 px-3 py-1 text-sm font-medium text-accent-700">
              {assessment.securedType}核貸
            </span>
            <span className="text-sm text-ink-muted">
              信用評分 {assessment.score}（{assessment.tier}）
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-ink-muted">建議額度區間</p>
              <p className="tabular font-mono text-lg font-medium text-ink">
                {formatTWD(assessment.suggestedRange[0])} – {formatTWD(assessment.suggestedRange[1])}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">每月額度上限</p>
              <p className="tabular font-mono text-lg font-medium text-ink">{formatTWD(assessment.monthlyQuota)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">最低月還款比例</p>
              <p className="tabular font-mono text-lg font-medium text-ink">{assessment.minRepayPct}%</p>
            </div>
          </div>

          {!profile.posConnected && (
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-hairline bg-plane p-3.5">
              <Info size={16} weight="duotone" className="mt-0.5 shrink-0 text-accent-600" />
              <p className="text-xs leading-relaxed text-ink-muted">
                提供 POS 交易數據可再提高額度、並降低最低還款比例 0.5 個百分點。
              </p>
            </div>
          )}
        </div>

        <Button className="mt-6 w-full" size="lg" onClick={goToTerms}>
          繼續申請融資
        </Button>
      </div>
    );
  }

  // ---------- Stage: terms (share rate + reward, only selectable after approval) ----------
  if (stage === "terms" && assessment) {
    const [minRate, maxRate] = assessment.suggestedShareRateRange;
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">分潤與回饋設定</h1>
        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-ink-muted">
          <button onClick={() => setStage("verify")} className="hover:text-ink">① 核實資料</button>
          <span>—</span>
          <button onClick={() => setStage("result")} className="hover:text-ink">② 核貸結果</button>
          <span>—</span>
          <span className="text-accent-700">③ 分潤與回饋設定</span>
          <span>—</span>
          <span>④ 申請金額</span>
        </div>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-secondary">
          核貸審核通過後，才可自行設定每月營收分潤比例與投資人回饋方式，做為募資頁面上的招募條件。
        </p>

        <div className="mt-6 rounded-2xl border border-hairline bg-surface p-6">
          <label htmlFor="share-rate" className="text-sm font-medium text-ink">
            每月營收分潤比例
          </label>
          <p className="mt-1 text-xs text-ink-muted">
            AI 依信用評級建議區間 {minRate}%–{maxRate}%，比例愈高愈能吸引投資人，但每月分潤成本也愈高。
          </p>
          <div className="mt-3 flex items-center gap-3">
            <input
              id="share-rate"
              type="range"
              min={minRate}
              max={maxRate}
              step={0.1}
              value={shareRatePct}
              onChange={(e) => setShareRatePct(Number(e.target.value))}
              className="w-full accent-accent-600"
            />
            <span className="tabular w-16 shrink-0 text-right font-mono text-lg font-medium text-ink">
              {shareRatePct.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-hairline bg-surface p-6">
          <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
            <Gift size={16} className="text-ink-muted" /> 投資人回饋方式
          </span>
          <p className="mt-1 text-xs text-ink-muted">可複選，或自行填寫其他回饋內容。</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {REWARD_PRESETS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => toggleReward(r)}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  rewardOffers.includes(r)
                    ? "bg-accent-600 text-white"
                    : "border border-hairline bg-plane text-ink-secondary hover:text-ink",
                )}
              >
                {rewardOffers.includes(r) && <Check size={13} weight="bold" />}
                {r}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={customReward}
            onChange={(e) => setCustomReward(e.target.value)}
            placeholder="其他回饋方式（選填）"
            className="mt-3 w-full rounded-xl border border-hairline bg-plane px-3 py-2 text-sm text-ink outline-none focus:border-accent-400"
          />
        </div>

        <Button className="mt-6 w-full" size="lg" onClick={startApplication}>
          繼續申請金額
        </Button>
      </div>
    );
  }

  // ---------- Stage: amount (existing amount + allocation flow) ----------
  const [min, max] = assessment?.suggestedRange ?? [200_000, 2_000_000];
  const withinSuggested = amount >= min && amount <= max;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">申請金額</h1>
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-ink-muted">
        <button onClick={() => setStage("verify")} className="hover:text-ink">① 核實資料</button>
        <span>—</span>
        <button onClick={() => setStage("result")} className="hover:text-ink">② 核貸結果</button>
        <span>—</span>
        <button onClick={() => setStage("terms")} className="hover:text-ink">③ 分潤與回饋設定</button>
        <span>—</span>
        <span className="text-accent-700">④ 申請金額</span>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4">
        <Info size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent-700" />
        <p className="text-sm text-accent-800">
          依核貸結果，建議申請額度：{formatTWD(min)} – {formatTWD(max)}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-surface p-6">
        <label htmlFor="apply-amount" className="text-sm font-medium text-ink">
          申請金額
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-hairline bg-plane px-3 py-2 focus-within:border-accent-400">
          <span className="text-sm text-ink-muted">NT$</span>
          <input
            id="apply-amount"
            type="number"
            min={min}
            max={max}
            step={10_000}
            value={amount}
            onChange={(e) => setAmount(clamp(Number(e.target.value) || 0, min, max))}
            className="tabular w-full bg-transparent font-mono text-sm text-ink outline-none"
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={10_000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-3 w-full accent-accent-600"
        />
        {!withinSuggested && (
          <p className="mt-2 text-xs text-ink-muted">
            超出建議額度範圍不代表無法申請，但可能需要較長的人工審查時間。
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-surface p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink">資金用途分配</span>
          <span className={`tabular text-sm font-medium ${total === 100 ? "text-accent-700" : "text-status-critical"}`}>
            {total}%
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">自行填寫用途名稱與比例，例如「租金保證金」「設備採購」。</p>

        <div className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateLabel(item.id, e.target.value)}
                  placeholder="填寫用途名稱"
                  className="min-w-0 flex-1 rounded-lg border border-hairline bg-plane px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent-400"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.pct}
                    onChange={(e) => updatePct(item.id, Number(e.target.value) || 0)}
                    className="tabular w-16 rounded-lg border border-hairline bg-plane px-2 py-1.5 text-right font-mono text-sm text-ink outline-none focus:border-accent-400"
                  />
                  <span className="text-sm text-ink-muted">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  aria-label="刪除這個用途項目"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-plane hover:text-status-critical disabled:pointer-events-none disabled:opacity-30"
                >
                  <Trash size={15} />
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={item.pct}
                onChange={(e) => updatePct(item.id, Number(e.target.value))}
                className="w-full accent-accent-600"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:text-accent-800"
        >
          <Plus size={15} weight="bold" /> 新增用途項目
        </button>

        {hasEmptyLabel && <p className="mt-3 text-xs text-status-critical">每個用途項目都要填寫名稱</p>}
        {total !== 100 && (
          <p className="mt-3 text-xs text-status-critical">分配總和需為 100% 才能送出申請（目前 {total}%）</p>
        )}
      </div>

      <Button className="mt-8 w-full" size="lg" disabled={!isValidAllocation} onClick={handleSubmit}>
        送出申請
      </Button>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-muted">
        本頁為產品原型示範，送出後不會產生真實融資申請。
      </p>

      {applications.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium text-ink-secondary">歷史申請紀錄（本機示範）</h2>
          <div className="mt-3 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
            {applications
              .slice()
              .reverse()
              .map((a, i) => (
                <div key={i} className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <span className="tabular font-mono text-ink">{formatTWD(a.amount)}</span>
                    <span className="tabular ml-2 text-xs text-ink-muted">分潤 {a.shareRatePct}%</span>
                  </div>
                  <span className="text-xs text-ink-muted">
                    {new Date(a.submittedAt).toLocaleString("zh-Hant-TW")}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
