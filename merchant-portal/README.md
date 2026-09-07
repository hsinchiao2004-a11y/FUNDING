# 旺舖商家後台（前端原型）

商圈優質名店「營收分潤融資（RBF）」RWA 平台 — **商家端**前端原型。

純前端展示用途，**沒有真實後端／API**，所有帳戶、營收數據、融資條件皆為 mock
資料（見 [`src/data/account.ts`](src/data/account.ts)），申請融資與資料來源連接
僅寫入瀏覽器 `localStorage`，不會產生任何真實交易或串接。

## 技術棧

跟 [`investor-portal`](../investor-portal) 同一套：Vite + React 19 + TypeScript、
Tailwind CSS v4、React Router、Motion、Recharts、Phosphor Icons、Geist 字體。

## 開發

```bash
npm install
npm run dev       # http://localhost:5174
npm run build
npm run preview
```

## 頁面

| 路由 | 說明 |
|---|---|
| `/` | 總覽：本月營收、RRS 分數、分潤回收進度、資料來源連接狀態、AI 財務建議 |
| `/apply` | 申請融資：AI 建議額度、金額輸入、資金用途分配、送出申請 |
| `/repayment` | 還款與撥款：融資條件、每月分潤趨勢圖、分潤明細表、資金撥付里程碑 |
| `/connections` | 資料來源：POS／LINE Pay／街口支付／銀行金流／電子發票連接狀態 |

## 免責

本專案為概念性產品原型，介面中的帳戶名稱、營收數字、融資條件均為示範資料，
不對應真實商家或真實金融商品。
