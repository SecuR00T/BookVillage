import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { api } from "@/api/client";
import { normalizeBook } from "@/lib/bookNormalizer";
import { useAuth } from "@/context/AuthContext";

const BESTSELLER_CATEGORY = "베스트셀러";
const VIRTUAL_CATEGORIES = ["신간", "소설", "에세이", "인문", "경제/경영", "자기계발", "IT/과학"];
const NAV_CATEGORIES = [BESTSELLER_CATEGORY, ...VIRTUAL_CATEGORIES];
const CURATED_BESTSELLER_IDS = [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012];

const CATEGORY_KEYWORDS = {
  "소설": ["소설", "novel", "fiction", "문학", "장편", "단편"],
  "에세이": ["에세이", "essay", "수필"],
  "인문": ["인문", "철학", "역사", "심리", "사회", "사상"],
  "경제/경영": ["경제", "경영", "금융", "투자", "주식", "비즈니스", "마케팅", "재테크"],
  "자기계발": ["자기계발", "성장", "습관", "리더십", "동기부여", "자존감"],
  "IT/과학": ["it", "과학", "컴퓨터", "코딩", "프로그래밍", "python", "개발", "데이터", "ai", "머신러닝", "알고리즘", "네트워크", "보안"],
};

const parsePublishDate = (value) => {
  if (!value) return 0;
  const text = String(value).trim();
  const match = text.match(/(19\d{2}|20\d{2})\D{0,3}(\d{1,2})\D{0,3}(\d{1,2})/);
  if (!match) return 0;

  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return 0;
  return new Date(y, Math.max(0, m - 1), d).getTime();
};

const getSearchableText = (book) =>
  [
    book?.title,
    book?.author,
    book?.publisher,
    book?.category,
    book?.keyword,
    book?.description,
    book?.descriptionRaw,
    book?.publishDate,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const matchesQuery = (book, query) => {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  return getSearchableText(book).includes(q);
};

const sortByRecent = (books) =>
  [...(books || [])].sort((a, b) => {
    const aDate = parsePublishDate(a?.publishDate || a?.descriptionMeta?.publishdate || a?.descriptionRaw);
    const bDate = parsePublishDate(b?.publishDate || b?.descriptionMeta?.publishdate || b?.descriptionRaw);
    if (aDate !== bDate) return bDate - aDate;
    return Number(b?.id || 0) - Number(a?.id || 0);
  });

const pickCuratedBestsellers = (books) => {
  const byId = new Map((books || []).map((book) => [book.id, book]));
  const curated = CURATED_BESTSELLER_IDS.map((id) => byId.get(id)).filter(Boolean);
  if (curated.length >= 8) return curated;

  const existingIds = new Set(curated.map((book) => book.id));
  const fallback = (books || [])
    .filter((book) => !existingIds.has(book.id))
    .slice(0, Math.max(0, 12 - curated.length));

  return [...curated, ...fallback];
};

const applyVirtualCategory = (books, virtualCategory) => {
  if (!VIRTUAL_CATEGORIES.includes(virtualCategory)) {
    return { list: books, fallbackUsed: false };
  }

  if (virtualCategory === "신간") {
    return { list: sortByRecent(books), fallbackUsed: false };
  }

  const keywords = CATEGORY_KEYWORDS[virtualCategory] || [];
  const filtered = (books || []).filter((book) => {
    const text = getSearchableText(book);
    return keywords.some((kw) => text.includes(String(kw).toLowerCase()));
  });

  if (filtered.length > 0) {
    return { list: sortByRecent(filtered), fallbackUsed: false };
  }

  const sorted = sortByRecent(books);
  const slotMap = {
    "소설": 0,
    "에세이": 1,
    "인문": 2,
    "경제/경영": 3,
    "자기계발": 4,
    "IT/과학": 5,
  };
  const slot = slotMap[virtualCategory] ?? 0;
  const fallback = sorted.filter((_, idx) => idx % 6 === slot).slice(0, 80);

  return { list: fallback.length ? fallback : sorted.slice(0, 80), fallbackUsed: true };
};

export default function BookSearch() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [categories, setCategories] = useState(NAV_CATEGORIES);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [wishlistBusyId, setWishlistBusyId] = useState(null);
  const [wishlistMessage, setWishlistMessage] = useState("");

  const search = async (query, selectedCategory) => {
    setLoading(true);
    setError("");
    setHint("");

    try {
      const queryText = (query || "").trim();
      const normalizedCategory = (selectedCategory || "").trim();
      const isBestsellerCategory = normalizedCategory === BESTSELLER_CATEGORY;
      const isVirtualCategory = VIRTUAL_CATEGORIES.includes(normalizedCategory);

      const list = await api.books.search(
        isVirtualCategory || isBestsellerCategory ? undefined : queryText || undefined,
        isVirtualCategory || isBestsellerCategory ? undefined : normalizedCategory || undefined,
      );
      let mapped = (list || []).map((book) => normalizeBook(book)).filter(Boolean);

      if (isBestsellerCategory) {
        mapped = pickCuratedBestsellers(mapped);
      } else if (isVirtualCategory) {
        const { list: categorized, fallbackUsed } = applyVirtualCategory(mapped, normalizedCategory);
        mapped = queryText ? categorized.filter((book) => matchesQuery(book, queryText)) : categorized;

        if (fallbackUsed) {
          setHint("해당 분류 키워드와 정확히 일치하는 도서가 적어 유사 도서를 표시합니다.");
        }
      }

      setBooks(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.books
      .getCategories()
      .then((v) => {
        const merged = [...NAV_CATEGORIES, ...((v || []).filter(Boolean) || [])];
        const deduped = Array.from(new Set(merged.map((x) => String(x).trim()).filter(Boolean)));
        setCategories(deduped);
      })
      .catch(() => setCategories(NAV_CATEGORIES));
  }, []);

  useEffect(() => {
    const nextQ = params.get("q") ?? "";
    const nextCategory = params.get("category") ?? "";

    setQ(nextQ);
    setCategory(nextCategory);
    search(nextQ, nextCategory);
  }, [params.toString()]);

  const submit = (e) => {
    e.preventDefault();
    setParams({ ...(q ? { q } : {}), ...(category ? { category } : {}) });
  };

  const handleWishlistAdd = async (event, bookId) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }
    if (wishlistBusyId === bookId) {
      return;
    }

    setWishlistBusyId(bookId);
    setWishlistMessage("");
    try {
      await api.mypage.addWishlist(bookId);
      setWishlistMessage("찜 목록에 추가되었습니다.");
    } catch (err) {
      setWishlistMessage(err instanceof Error ? err.message : "찜 추가에 실패했습니다.");
    } finally {
      setWishlistBusyId(null);
    }
  };

  const isBestsellerView = category === BESTSELLER_CATEGORY;
  const isVirtualView = VIRTUAL_CATEGORIES.includes(category);
  const pageTitle = isBestsellerView ? BESTSELLER_CATEGORY : isVirtualView ? category : "Book Search";
  const pageDescription = isBestsellerView
    ? "운영자가 임의 지정한 베스트셀러 도서 목록입니다."
    : isVirtualView
      ? `데이터베이스 도서 중 '${category}' 분류로 표시합니다.`
      : "Find books by keyword and category.";

  return (
    <PageLayout title={pageTitle} description={pageDescription} hideIntro>
      {isBestsellerView ? (
        <div className="mb-4 flex justify-end">
          <Link to="/books" className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary">
            {"전체 도서 보기"}
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mb-4 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 rounded-lg border px-3 py-2"
            placeholder="Title, author, publisher, ISBN"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border px-3 py-2">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button className="rounded-lg bg-primary px-4 text-white">Search</button>
        </form>
      )}

      {wishlistMessage && <p className="mb-3 text-sm text-primary">{wishlistMessage}</p>}
      {hint && <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{hint}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading books...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && books.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {"조건에 맞는 도서가 없습니다."}
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {books.map((b) => (
            <Link key={b.id} to={`/book/${b.id}`} className="group rounded-xl border bg-card p-3 transition-shadow hover:shadow-md">
              <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-lg bg-secondary/40">
                {b.coverImageUrl ? (
                  <img src={b.coverImageUrl} alt={b.title} className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-muted-foreground">No image</div>
                )}
                <button
                  type="button"
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm hover:bg-white disabled:opacity-60"
                  onClick={(event) => handleWishlistAdd(event, b.id)}
                  disabled={wishlistBusyId === b.id}
                >
                  <Heart size={14} />
                </button>
              </div>
              <p className="line-clamp-2 text-sm font-semibold">{b.title}</p>
              <p className="line-clamp-1 text-xs text-muted-foreground">{b.author || "Unknown"}</p>
              <p className="text-sm font-bold text-price">{Number(b.price).toLocaleString()} KRW</p>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
