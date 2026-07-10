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
    <div className="w-full py-8 sm:py-10" dir="rtl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 sm:h-8 rounded-full bg-gradient-to-b from-[#A842E4] to-[#611FA0]" />
          <h2 className="text-lg sm:text-xl font-black text-gray-900">تسوق حسب الأقسام</h2>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#8543C0]/15 to-transparent" />
        </div>
      </div>
      <CategorySlider categories={categoriesWithHref} />
    </div>
  );
}
