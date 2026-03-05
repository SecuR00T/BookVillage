import { useState } from "react";
import { ShoppingCart, Star, StarHalf, BookImage } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const badgeClass = {
  new: "badge-new",
  hot: "badge-hot",
  sale: "badge-sale",
};

const badgeLabel = {
  new: "NEW",
  hot: "HOT",
  sale: "SALE",
};

export default function BookCard({ book, index = 0 }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const discount = book.discount ?? 0;
  const originalPrice = book.originalPrice ?? book.price;
  const showDiscount = discount > 0 && originalPrice > book.price;
  const hasCoverImage = Boolean(book.coverImageUrl) && !imageError;

  const rawRating = typeof book.rating === "number" ? book.rating : 4.4;
  const normalizedRating = rawRating > 5 ? rawRating / 2 : rawRating;
  const reviewCount = typeof book.reviewCount === "number" ? book.reviewCount : 0;

  const ratingState = (position) => {
    if (normalizedRating >= position) return "full";
    if (normalizedRating >= position - 0.5) return "half";
    return "empty";
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    addItem(
      {
        bookId: book.id,
        title: book.title,
        price: Number(book.price),
      },
      1,
    );
  };

  return (
    <Link
      to={`/book/${book.id}`}
      className="group block book-card-enter"
      style={{ animationDelay: `${Math.min(index * 65, 420)}ms` }}
    >
      <article className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary/40">
          {hasCoverImage ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              onError={() => setImageError(true)}
              className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary flex items-center justify-center">
              <div className="text-center p-4 text-muted-foreground">
                <BookImage size={24} className="mx-auto mb-2" />
                <p className="text-xs font-medium">NO COVER IMAGE</p>
              </div>
            </div>
          )}

          {book.badge && (
            <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${badgeClass[book.badge]}`}>
              {badgeLabel[book.badge]}
            </span>
          )}

          {showDiscount && (
            <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-accent text-accent-foreground">
              -{discount}%
            </span>
          )}

          <button
            onClick={handleQuickAdd}
            className="absolute left-1/2 bottom-3 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg"
          >
            <ShoppingCart size={13} />
            {"장바구니"}
          </button>
        </div>

        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">{book.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.author || "Unknown"} | {book.publisher || "-"}
          </p>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const state = ratingState(i + 1);
              return (
                <span key={i}>
                  {state === "full" && <Star size={12} className="fill-current text-star" />}
                  {state === "half" && <StarHalf size={12} className="fill-current text-star" />}
                  {state === "empty" && <Star size={12} className="text-muted" />}
                </span>
              );
            })}
            <span className="ml-1 text-xs font-medium text-foreground">{normalizedRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-price">{Number(book.price).toLocaleString()} KRW</span>
            {showDiscount && <span className="text-xs text-muted-foreground line-through">{originalPrice.toLocaleString()} KRW</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}
