# FUNDING

商圈優質名店「營收分潤融資（RBF）」RWA 平台 — 投資人端前端原型。

專案內容都在 [`investor-portal/`](investor-portal/) 這個資料夾裡。純前端展示用途，
**沒有真實後端**，所有商家、營收數據皆為 mock 資料，投資操作只會寫入你瀏覽器的
`localStorage`，不會有任何真實交易或對外連線。

## 怎麼打開介面看畫面

這個 repo 是 **Private**，開始之前你要先被加為協作者（收到邀請信並在
GitHub 上按接受），而且電腦上要能用自己的 GitHub 帳號通過驗證（例如已經
`git` 登入過、或設定過 SSH key），不然第 1 步會抓不到東西。

還需要先裝 [Node.js](https://nodejs.org)（建議 v20 以上）。

共 4 個步驟：

1. **下載專案**（把整個 repo 複製一份到你電腦上）：
   ```bash
   git clone https://github.com/hsinchiao2004-a11y/FUNDING.git
   ```
2. **進到專案資料夾：**
   ```bash
   cd FUNDING/investor-portal
   ```
3. **安裝相依套件**（抓 React / Tailwind 這些公開函式庫，跟第 1 步下載的
   專案內容是兩回事）：
   ```bash
   npm install
   ```
4. **啟動本地伺服器：**
   ```bash
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
