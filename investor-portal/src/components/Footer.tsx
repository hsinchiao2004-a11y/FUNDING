export function Footer() {
  return (
    <footer className="border-t border-hairline bg-plane">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden>
              <rect width="32" height="32" rx="8" fill="#059669" />
              <rect x="7" y="17" width="4" height="9" rx="1.5" fill="#ecfdf5" />
              <rect x="14" y="12" width="4" height="14" rx="1.5" fill="#ecfdf5" />
              <rect x="21" y="6" width="4" height="20" rx="1.5" fill="#ecfdf5" />
            </svg>
            <span className="text-sm font-medium text-ink">旺舖</span>
          </div>
          <div className="max-w-xl text-xs leading-relaxed text-ink-muted">
            <p className="mb-2 font-medium text-ink-secondary">風險與合規揭露</p>
            <p>
              本網站為概念性產品原型（Prototype），所有商家、營收數據與募資進度均為示範用途，非真實存在之商家或交易。「營收分潤權」並非存款、保證收益商品，投資人可能面臨本金虧損風險；歷史或預估報酬不代表未來實際表現。實際商品之法律性質、契約架構與募集方式須以受監管金融機構公告之正式條款為準。
            </p>
          </div>
        </div>
        <p className="mt-8 text-xs text-ink-muted">© {new Date().getFullYear()} 旺舖．本頁面僅供產品構想展示。</p>
      </div>
    </footer>
  );
}
