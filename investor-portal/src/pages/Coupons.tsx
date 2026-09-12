import { Link } from "react-router-dom";
import { Ticket, Storefront, CheckCircle, Compass } from "@phosphor-icons/react";
import { useCoupons } from "../lib/CouponContext";
import { getMerchant } from "../data/merchants";
import { Button, buttonClasses } from "../components/Button";

export function Coupons() {
  const { coupons, markUsed } = useCoupons();

  const unused = coupons.filter((c) => c.status === "unused");
  const used = coupons.filter((c) => c.status === "used");

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-medium tracking-tight text-ink">我的優惠票券</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
        投資商家的促購 Agent 主動發送給你的到店優惠，都會收在這裡。
      </p>

      {coupons.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-hairline py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
            <Compass size={26} weight="duotone" />
          </div>
          <div>
            <p className="font-medium text-ink">還沒有任何優惠票券</p>
            <p className="mt-1 text-sm text-ink-muted">收到促購 Agent 的通知後，記得加入票券</p>
          </div>
          <Link to="/marketplace" className={buttonClasses("primary", "md")}>
            瀏覽商家
          </Link>
        </div>
      ) : (
        <>
          {unused.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-medium text-ink-secondary">可使用</h2>
              <div className="mt-3 flex flex-col gap-3">
                {unused.map((coupon) => {
                  const merchant = getMerchant(coupon.merchantId);
                  if (!merchant) return null;
                  return (
                    <div
                      key={coupon.id}
                      className="flex flex-col gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
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
                      <Button size="md" onClick={() => markUsed(coupon.id)}>
                        標示為已使用
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {used.length > 0 && (
            <section className="mt-10">
              <h2 className="text-sm font-medium text-ink-secondary">已使用</h2>
              <div className="mt-3 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
                {used.map((coupon) => {
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
        </>
      )}
    </div>
  );
}
