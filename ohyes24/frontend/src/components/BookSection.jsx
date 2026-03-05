import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";

export default function BookSection({ title, books, emoji, moreTo = "/books", moreLabel = "전체보기" }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          {emoji && <span>{emoji}</span>}
          {title}
        </h2>
        <Link to={moreTo} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors">
          {moreLabel} <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {books.map((book, idx) => (
          <BookCard key={book.id} book={book} index={idx} />
        ))}
      </div>
    </section>
  );
}
