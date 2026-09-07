export function Footer() {
  return (
    <footer className="border-t border-hairline bg-plane">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden>
              <rect width="32" height="32" rx="8" fill="#059669" />
              <rect x="7" y="17" width="4" height="9" rx="1.5" fill="#ecfdf5" />
              <rect x="14" y="12" width="4" height="14" rx="1.5" fill="#ecfdf5" />
              <rect x="21" y="6" width="4" height="20" rx="1.5" fill="#ecfdf5" />
            </svg>
            <span className="text-sm font-medium text-ink">旺舖商家後台</span>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-ink-muted">
            本頁為概念性產品原型（Prototype），所有帳戶、營收數據與融資條件均為示範用途。
            實際商品之法律性質、契約架構與撥款方式須以受監管金融機構公告之正式條款為準。
          </p>
        </div>
        <p className="mt-6 text-xs text-ink-muted">© {new Date().getFullYear()} 旺舖．本頁面僅供產品構想展示。</p>
      </div>
    </footer>
  );
}
