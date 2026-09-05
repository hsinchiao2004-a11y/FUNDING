# 旺舖投資人平台（前端原型）

商圈優質名店「營收分潤融資（RBF）」RWA 平台 — **投資人端**前端原型。

純前端展示用途，**沒有真實後端／API**，所有商家、營收數據、募資進度皆為 mock 資料
（見 [`src/data/merchants.ts`](src/data/merchants.ts)），投資行為僅寫入瀏覽器
`localStorage`，不會產生任何真實交易。

## 技術棧

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router
- Motion（framer-motion 後繼者）
- Recharts（營收趨勢圖）
- Phosphor Icons
- 字體：Geist（自架 woff2，`public/fonts/`）

## 開發

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # 產出 dist/
npm run preview    # 預覽 production build
```

## 頁面

| 路由 | 說明 |
|---|---|
| `/` | 行銷首頁：價值主張、運作流程、投資×消費循環、精選商家、風險揭露 |
| `/marketplace` | 瀏覽商家（可依分類篩選、排序） |
| `/merchants/:id` | 商家詳情：營收趨勢圖、RBF 融資條件、資金用途、投資面板 |
| `/portfolio` | 我的投資組合（讀寫 localStorage） |

## 接真實資料

把 [`src/data/merchants.ts`](src/data/merchants.ts) 換成打真實 API 的資料來源，
UI 元件不需大改；[`src/lib/PortfolioContext.tsx`](src/lib/PortfolioContext.tsx)
的 `invest()` 之後可以換成真的下單 API 呼叫。

## 免責

本專案為概念性產品原型，介面中的商家名稱、營收數字、報酬率、募資進度均為示範資料，
不對應真實商家或真實金融商品。
