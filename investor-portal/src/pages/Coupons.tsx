import { useState } from "react";
import { X, Ticket, Storefront, CheckCircle, LockSimple } from "@phosphor-icons/react";
import { useCoupons, type Coupon } from "../lib/CouponContext";
import { usePortfolio } from "../lib/PortfolioContext";
import { getMerchant } from "../data/merchants";
import { Button } from "../components/Button";

function CouponDetail({ coupon, onClose }: { coupon: Coupon; onClose: () => void }) {
  const { markUsed } = useCoupons();
  const merchant = getMerchant(coupon.merchantId);
  const qrData = encodeURIComponent(`WANGPU-COUPON:${coupon.id}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${qrData}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-hairline bg-surface p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="關閉" className="text-ink-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-ink-muted">{merchant?.name}</p>
        <p className="mt-1 font-medium text-ink">{coupon.offer}</p>
        <div className="mx-auto mt-5 flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-xl border border-hairline bg-plane">
          <img src={qrUrl} alt="優惠券兌換 QR Code" width={220} height={220} />
        </div>
        <p className="mt-3 text-xs text-ink-muted">出示此 QR Code 給店家掃描兌換</p>
        {coupon.status === "unused" ? (
          <Button
            className="mt-5 w-full"
            onClick={() => {
              markUsed(coupon.id);
              onClose();
            }}
          >
            標示為已使用
          </Button>
        ) : (
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <CheckCircle size={15} weight="fill" /> 已使用
          </span>
        )}
      </div>
    </div>
  );
}

export function Coupons() {
  const { coupons, claim } = useCoupons();
  const { holdings } = usePortfolio();
  const [selected, setSelected] = useState<Coupon | null>(null);

  const investedMerchantIds = new Set(holdings.map((h) => h.merchantId));
  const isInvested = (merchantId: string) => investedMerchantIds.has(merchantId);

  const available = coupons.filter((c) => !c.claimed && isInvested(c.merchantId));
  const locked = coupons.filter((c) => !c.claimed && !isInvested(c.merchantId));
  const myUnused = coupons.filter((c) => c.claimed && c.status === "unused");
  const myUsed = coupons.filter((c) => c.claimed && c.status === "used");

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-medium tracking-tight text-ink">優惠券</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
        商家提供給投資人的到店優惠，投資該商家後即可領取，領取後可到店出示 QR Code 兌換。
      </p>

      {available.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-ink-secondary">可領取</h2>
          <div className="mt-3 flex flex-col gap-3">
            {available.map((coupon) => {
              const merchant = getMerchant(coupon.merchantId);
              if (!merchant) return null;
              return (
                <div
                  key={coupon.id}
                  className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                      <Ticket size={18} weight="duotone" />
                    </div>
                    <div>
                      <p className="font-medium text-ink">{coupon.offer}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                        <Storefront size={13} /> {merchant.name}
                      </p>
                    </div>
                  </div>
                  <Button size="md" onClick={() => claim(coupon.id)}>
                    領取
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {locked.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium text-ink-secondary">尚未解鎖</h2>
          <div className="mt-3 flex flex-col gap-3">
            {locked.map((coupon) => {
              const merchant = getMerchant(coupon.merchantId);
              if (!merchant) return null;
              return (
                <div
                  key={coupon.id}
                  className="flex flex-col gap-3 rounded-2xl border border-hairline bg-plane p-5 opacity-60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-ink-muted">
                      <Ticket size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-ink-secondary">{coupon.offer}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                        <Storefront size={13} /> {merchant.name}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                    <LockSimple size={13} /> 投資後解鎖
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {myUnused.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium text-ink-secondary">我的票券（可使用）</h2>
          <div className="mt-3 flex flex-col gap-3">
            {myUnused.map((coupon) => {
              const merchant = getMerchant(coupon.merchantId);
              if (!merchant) return null;
              return (
                <button
                  key={coupon.id}
                  onClick={() => setSelected(coupon)}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-5 text-left transition-colors hover:border-accent-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent-700">
                      <Ticket size={18} weight="duotone" />
                    </div>
                    <div>
                      <p className="font-medium text-ink">{coupon.offer}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-muted">
                        <Storefront size={13} /> {merchant.name}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-accent-700">點擊查看 QR Code →</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {myUsed.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium text-ink-secondary">已使用</h2>
          <div className="mt-3 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
            {myUsed.map((coupon) => {
              const merchant = getMerchant(coupon.merchantId);
              if (!merchant) return null;
              return (
                <div key={coupon.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-plane text-ink-muted">
                      <Ticket size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-secondary line-through">{coupon.offer}</p>
                      <p className="text-xs text-ink-muted">{merchant.name}</p>
                    </div>
                  </div>
                  <CheckCircle size={16} weight="fill" className="text-ink-muted" />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {selected && <CouponDetail coupon={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
