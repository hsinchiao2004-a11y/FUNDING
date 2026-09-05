# FUNDING

商圈優質名店「營收分潤融資（RBF）」RWA 平台 — 投資人端前端原型。

專案內容都在 [`investor-portal/`](investor-portal/) 這個資料夾裡。純前端展示用途，
**沒有真實後端**，所有商家、營收數據皆為 mock 資料，投資操作只會寫入你瀏覽器的
`localStorage`，不會有任何真實交易或對外連線。

## 怎麼打開介面看畫面

需要先裝 [Node.js](https://nodejs.org)（建議 v20 以上）。

```bash
git clone https://github.com/hsinchiao2004-a11y/FUNDING.git
cd FUNDING/investor-portal
npm install
npm run dev
```

終端機會印出一個網址，通常是：

```
http://localhost:5173
```

用瀏覽器打開這個網址就能看到完整介面了 — 可以瀏覽商家、點進商家頁試著投資、
看投資組合。停止的話在終端機按 `Ctrl + C`。

更多細節（頁面說明、技術棧、怎麼接真實資料）看
[`investor-portal/README.md`](investor-portal/README.md)。
