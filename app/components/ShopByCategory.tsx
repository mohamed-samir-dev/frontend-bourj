import CategorySlider from "./CategorySlider";
import { slugConfigs } from "../lib/categoryConfig";

const BACKEND = process.env.BACKEND_URL || "https://tabaraktech.com/api/tabarak";

function resolveHref(catName: string): string {
  const name = catName?.trim();
  if (!name) return "/";

  // أقسام الصوت كلها توديها لـ /audio مباشرة
  if (
    name.toLowerCase().includes("سماعات") ||
    name.toLowerCase() === "speaker" ||
    name.toLowerCase() === "earbuds"
  ) return "/audio";

  // اكسسورات توديها لـ /games
  if (name === "اكسسورات") return "/games";

  // بطاريات متنقلة توديها لـ /accessories/anker-batteries
  if (name.includes("بطاريات")) return "/accessories/anker-batteries";

  for (const [slug, config] of Object.entries(slugConfigs)) {
    const parent = config.parentHref.replace(/^\//, "").split("/")[0];
    const path = `/${parent}/${slug}`;

    // مطابقة مباشرة بالـ category filter
    if (config.filters.category && config.filters.category === name) return path;

    // مطابقة بالـ nameIncludes
    if (config.filters.nameIncludes?.some((kw) => name.toLowerCase().includes(kw.toLowerCase()))) return path;
  }

  return `/search?q=${encodeURIComponent(name)}`;
}

type Category = { name: string; count: number; image: string };
type Setting = { category: string; subCategory: string; showInHome: boolean; order: number };

async function getCategories(): Promise<Category[]> {
  try {
    const [catRes, settingsRes] = await Promise.all([
      fetch(`${BACKEND}/api/admin/sub-categories/public`, { cache: "no-store" }),
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, { cache: "no-store" }),
    ]);
    const allCats: Category[] = catRes.ok ? await catRes.json() : [];
    const settings: Setting[] = settingsRes.ok ? await settingsRes.json() : [];

    const orderMap = new Map(
      settings.filter((s) => s.showInHome).map((s) => [s.category, s.order])
    );

    return allCats.sort((a, b) => {
      const aHome = orderMap.has(a.name);
      const bHome = orderMap.has(b.name);
      if (aHome && !bHome) return -1;
      if (!aHome && bHome) return 1;
      if (aHome && bHome) return (orderMap.get(a.name) ?? 0) - (orderMap.get(b.name) ?? 0);
      return 0;
    });
  } catch {
    return [];
  }
}

export default async function ShopByCategory() {
  const categories = await getCategories();
  if (!categories.length) return null;

  const categoriesWithHref = categories.map((cat) => ({
    ...cat,
    href: resolveHref(cat.name),
  }));

  return (
    <div className="w-full py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A842E4] to-[#611FA0] flex items-center justify-center shadow-lg shadow-purple-300/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#A842E4] to-[#611FA0] opacity-20 blur-md" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">تسوق حسب الأقسام</h2>
            <p className="text-[11px] text-gray-400 font-medium">اكتشف منتجاتنا المتنوعة</p>
          </div>
        </div>
      </div>
      <CategorySlider categories={categoriesWithHref} />
    </div>
  );
}
