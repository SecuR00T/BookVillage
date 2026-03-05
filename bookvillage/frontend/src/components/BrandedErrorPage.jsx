import { AlertTriangle, ChevronLeft, Home, RefreshCcw } from "lucide-react";

export default function BrandedErrorPage({
  code = "ERROR",
  title = "서비스 이용 중 오류가 발생했습니다.",
  description = "잠시 후 다시 시도해 주세요.",
  detail = "",
  primaryActionLabel = "새로고침",
  onPrimaryAction,
  showBackButton = true,
  homeHref = "/",
}) {
  const handlePrimary = () => {
    if (typeof onPrimaryAction === "function") {
      onPrimaryAction();
      return;
    }
    window.location.reload();
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.assign(homeHref);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-7 shadow-sm sm:px-10 sm:py-11">
          <div className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[hsl(var(--primary)/0.12)]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[hsl(var(--accent)/0.14)]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <AlertTriangle size={14} className="text-primary" />
              오류 안내
            </div>

            <p className="mt-5 text-sm font-semibold tracking-[0.2em] text-primary">{code}</p>
            <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">{title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>

            {detail && (
              <div className="mt-5 rounded-xl border border-border bg-secondary/45 px-4 py-3">
                <p className="text-sm text-foreground">{detail}</p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handlePrimary}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RefreshCcw size={15} />
                {primaryActionLabel}
              </button>

              {showBackButton && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <ChevronLeft size={15} />
                  이전 페이지
                </button>
              )}

              <a
                href={homeHref}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <Home size={15} />
                홈으로 이동
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
