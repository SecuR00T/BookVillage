import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";
import { api } from "@/api/client";

const TEXT = {
  brand: "OHYES24",
  title: "\uB85C\uADF8\uC778",
  subtitle: "OHYES24 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD558\uC138\uC694.",
  heroLine1: "\uBC18\uAC00\uC6CC\uC694. \uB85C\uADF8\uC778\uD558\uACE0",
  heroLine2: "\uCC45 \uC1FC\uD551\uC744 \uC774\uC5B4\uAC00\uC138\uC694.",
  heroDesc: "\uD68C\uC6D0 \uC804\uC6A9 \uC7A5\uBC14\uAD6C\uB2C8, \uC8FC\uBB38\uB0B4\uC5ED, \uB9C8\uC774\uD398\uC774\uC9C0 \uAE30\uB2A5\uC744 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  benefit1: "\uC2E4\uC2DC\uAC04 \uC778\uAE30 \uB3C4\uC11C\uC640 \uC2E0\uAC04 \uD050\uB808\uC774\uC158",
  benefit2: "\uC8FC\uBB38/\uBC30\uC1A1 \uC0C1\uD0DC\uB97C \uD55C\uB208\uC5D0 \uD655\uC778",
  benefit3: "\uBCF4\uC548 \uD559\uC2B5 \uAE30\uB2A5\uAE4C\uC9C0 \uB3D9\uC77C \uACC4\uC815\uC73C\uB85C \uC811\uADFC",
  email: "\uC774\uBA54\uC77C",
  password: "\uBE44\uBC00\uBC88\uD638",
  submit: "\uB85C\uADF8\uC778",
  noAccount: "\uACC4\uC815\uC774 \uC5C6\uB098\uC694?",
  register: "\uD68C\uC6D0\uAC00\uC785",
  loginFail: "\uB85C\uADF8\uC778 \uC2E4\uD328",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [findIdName, setFindIdName] = useState("");
  const [findIdEmail, setFindIdEmail] = useState("");
  const [findIdResult, setFindIdResult] = useState("");
  const [findIdError, setFindIdError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetUserId, setResetUserId] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetResult, setResetResult] = useState("");
  const [resetError, setResetError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : TEXT.loginFail);
    }
  };

  const submitFindId = async (e) => {
    e.preventDefault();
    setFindIdError("");
    setFindIdResult("");
    try {
      const response = await api.auth.findId(findIdName, findIdEmail);
      const foundId = response?.foundId || response?.maskedId || "N/A";
      setFindIdResult(`Found ID: ${foundId}`);
    } catch (err) {
      setFindIdError(err instanceof Error ? err.message : "Find ID failed");
    }
  };

  const submitResetRequest = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetResult("");
    try {
      const response = await api.auth.requestPasswordReset(resetEmail);
      setResetResult(response?.message || "Password reset request sent.");
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Password reset request failed");
    }
  };

  const submitResetConfirm = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetResult("");
    try {
      await api.auth.confirmPasswordReset(resetEmail, resetToken, resetNewPassword, resetUserId);
      setResetResult("Password reset completed.");
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Password reset confirm failed");
    }
  };

  return (
    <PageLayout hideIntro>
      <section className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(220,72%,28%)] via-[hsl(220,68%,34%)] to-[hsl(220,60%,42%)] p-7 text-white">
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
              type="email"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder={TEXT.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            {TEXT.noAccount}{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              {TEXT.register}
            </Link>
          </p>

          <div className="mt-6 space-y-4 border-t border-border pt-5">
            <div className="rounded-xl border border-border/70 bg-secondary/20 p-4">
              <p className="text-sm font-semibold">ID Lookup Lab</p>
              <form onSubmit={submitFindId} className="mt-3 space-y-2">
                <input
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Name"
                  value={findIdName}
                  onChange={(e) => setFindIdName(e.target.value)}
                />
                <input
                  type="email"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Email"
                  value={findIdEmail}
                  onChange={(e) => setFindIdEmail(e.target.value)}
                />
                <button className="w-full rounded-lg bg-primary/90 py-2 text-sm font-semibold text-primary-foreground">Find ID</button>
              </form>
              {findIdResult && <p className="mt-2 text-xs text-emerald-700">{findIdResult}</p>}
              {findIdError && <p className="mt-2 text-xs text-red-600">{findIdError}</p>}
            </div>

            <div className="rounded-xl border border-border/70 bg-secondary/20 p-4">
              <p className="text-sm font-semibold">Password Reset Lab</p>
              <form onSubmit={submitResetRequest} className="mt-3 space-y-2">
                <input
                  type="email"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Victim Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <button className="w-full rounded-lg border border-input bg-background py-2 text-sm font-semibold">Request Reset Token</button>
              </form>

              <form onSubmit={submitResetConfirm} className="mt-3 space-y-2">
                <input
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="userId (exposed in request)"
                  value={resetUserId}
                  onChange={(e) => setResetUserId(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Token (0000-9999)"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                />
                <input
                  type="password"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="New Password (min 8)"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                />
                <button className="w-full rounded-lg bg-primary/90 py-2 text-sm font-semibold text-primary-foreground">Confirm Reset</button>
              </form>
              {resetResult && <p className="mt-2 text-xs text-emerald-700">{resetResult}</p>}
              {resetError && <p className="mt-2 text-xs text-red-600">{resetError}</p>}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
