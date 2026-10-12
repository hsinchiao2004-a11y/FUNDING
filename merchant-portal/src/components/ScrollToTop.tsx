import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router 換頁時預設不會重設捲動位置——瀏覽器會保留上一頁捲到的高度，
// 導致從頁面中段點連結換頁後，新頁面看起來像是直接從「中間」開始，而不是
// 從頂部開始。掛在 Router 內、依 pathname 變化重設捲動位置即可修正。
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
