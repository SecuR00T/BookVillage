import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PageLayout({ title, description, children, hideIntro = false }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {!hideIntro && (
          <section className="rounded-2xl border border-border bg-card p-5 mb-4">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </section>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
