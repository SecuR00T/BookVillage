import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  brand: "BOOKVILLAGE",
  title: "로그인",
  subtitle: "BOOKVILLAGE 계정으로 로그인하세요.",
  heroLine1: "반가워요. 로그인하고",
  heroLine2: "책 쇼핑을 이어가세요.",
  heroDesc: "회원 전용 장바구니, 주문내역, 마이페이지 기능을 이용할 수 있습니다.",
  benefit1: "실시간 인기 도서와 신간 큐레이션",
  benefit2: "주문/배송 상태를 한눈에 확인",
  benefit3: "보안 학습 기능까지 동일 계정으로 접근",
  email: "이메일",
  password: "비밀번호",
  submit: "로그인",
  findEmail: "이메일 찾기",
  resetPassword: "비밀번호 재설정",
  noAccount: "계정이 없나요?",
  register: "회원가입",
  loginFail: "로그인 실패",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toKoreanLoginError = (message) => {
    const raw = String(message || "").trim();
    const normalized = raw.toLowerCase();
    if (normalized.includes("invalid credentials") || normalized.includes("bad credentials")) {
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    }
    return raw || TEXT.loginFail;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(identifier, password);
      navigate("/");
    } catch (err) {
      setError(toKoreanLoginError(err instanceof Error ? err.message : ""));
    }
  };

  return (
    <PageLayout hideIntro>
      <section className="grid w-full gap-6 lg:grid-cols-[1.15fr_1fr] xl:gap-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(24,38%,27%)] via-[hsl(28,34%,32%)] to-[hsl(152,28%,36%)] p-7 text-white">
          <div className="absolute -top-14 -right-12 h-44 w-44 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-white/10" />
          <div className="relative">
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{TEXT.brand}</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight">
              {TEXT.heroLine1}
              <br />
              {TEXT.heroLine2}
            </h1>
            <p className="mt-3 text-sm text-white/85">{TEXT.heroDesc}</p>

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                <BookOpen size={16} />
                <span>{TEXT.benefit1}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                <Truck size={16} />
                <span>{TEXT.benefit2}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                <ShieldCheck size={16} />
                <span>{TEXT.benefit3}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight">{TEXT.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{TEXT.subtitle}</p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <input
              type="text"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="아이디 또는 이메일"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <input
              type="password"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder={TEXT.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <button className="w-full rounded-xl bg-primary py-3 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90">
              {TEXT.submit}
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/account-recovery?mode=email"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                {TEXT.findEmail}
              </Link>
              <Link
                to="/account-recovery?mode=reset"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                {TEXT.resetPassword}
              </Link>
            </div>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            {TEXT.noAccount}{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              {TEXT.register}
            </Link>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
