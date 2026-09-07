# FUNDING

商圈優質名店「營收分潤融資（RBF）」RWA 平台 — 前端原型。

這個 repo 裡有**兩個各自獨立的前端專案**，對應平台的兩種使用者視角：

| 資料夾 | 是誰在用 | 內容 | 網址（本機啟動後） |
|---|---|---|---|
| [`investor-portal/`](investor-portal/) | 投資人 | 瀏覽商家、投資分潤權、看投資組合 | **http://localhost:5173** |
| [`merchant-portal/`](merchant-portal/) | 商家 | 申請融資、看營收數據、追蹤還款與撥款 | **http://localhost:5174** |

兩邊的 port 都寫死在各自的 `vite.config.ts` 裡（投資人端固定 5173、商家端固定
5174），只要照下面步驟啟動，網址一定是這兩個，不會因為先後啟動順序而變動。

兩個都是**純前端展示用途，沒有真實後端**，所有資料都是 mock 資料，操作只會寫入
瀏覽器的 `localStorage`，不會有任何真實交易或對外連線。

## 怎麼打開介面看畫面

這個 repo 是 **Private**，開始之前你要先被加為協作者（收到邀請信並在
GitHub 上按接受），而且電腦上要能用自己的 GitHub 帳號通過驗證（例如已經
`git` 登入過、或設定過 SSH key），不然第 1 步會抓不到東西。

還需要先裝 [Node.js](https://nodejs.org)（建議 v20 以上）。

**下面的指令都是在「終端機」（Terminal）裡打**，不是在瀏覽器操作
（Mac 用「終端機」App，Windows 用 PowerShell 或 Git Bash）。

> ⚠️ `http://localhost:xxxx` 這種網址**只有在跑著 `npm run dev` 的那台電腦上**
> 才打得開——`localhost` 指的是「這台機器自己」。用手機、平板或另一台電腦開這個
> 網址是打不開的，一定要在同一台跑伺服器的電腦上用瀏覽器開。

### 第一次設定（只需要做一次）

```bash
git clone https://github.com/hsinchiao2004-a11y/FUNDING.git
cd FUNDING
```

### 啟動投資人端

```bash
cd investor-portal
npm install
npm run dev
```

終端機會印出網址：**http://localhost:5173** — 這個終端機視窗要保持開著
（伺服器持續運作中），再切去瀏覽器開這個網址。

### 啟動商家端

```bash
cd merchant-portal
npm install
npm run dev
```

終端機會印出網址：**http://localhost:5174**

### 兩個一起跑

兩個是完全獨立的專案，可以**開兩個終端機視窗**，一個跑投資人端、一個跑商家端，
互不影響，同時開兩個瀏覽器分頁分別看。

### 停止

回到對應的終端機視窗，按 `Ctrl + C`。

## 更多細節

- [`investor-portal/README.md`](investor-portal/README.md) — 投資人端頁面說明、技術棧
- [`merchant-portal/README.md`](merchant-portal/README.md) — 商家端頁面說明、技術棧
