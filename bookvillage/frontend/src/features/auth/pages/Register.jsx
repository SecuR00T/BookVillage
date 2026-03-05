import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  title: "회원가입",
  consentHeading: "BOOKCHON 이용 동의",
  agreeAll: "약관 전체 동의하기",
  over14: "만 14세 이상입니다.",
  required: "(필수)",
  terms: "이용약관",
  privacy: "개인정보 처리방침",
  collection: "개인정보 수집·이용·제공 동의",
  detail: "자세히",
  lastName: "성",
  firstName: "이름",
  loginId: "아이디",
  email: "이메일",
  password: "비밀번호",
  phone: "전화번호",
  address: "주소",
  submit: "가입하기",
  alreadyMember: "이미 BOOKCHON 회원인가요?",
  login: "로그인",
  errAgreeRequired: "필수 약관에 모두 동의해 주세요.",
  errNameRequired: "이름을 입력해 주세요.",
  errRegisterFailed: "회원가입 실패",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [agreements, setAgreements] = useState({
    over14: false,
    terms: false,
    privacy: false,
    collection: false,
  });
  const [error, setError] = useState("");

  const allRequiredAgreed = Object.values(agreements).every(Boolean);

  const toggleAllAgreements = () => {
    const nextValue = !allRequiredAgreed;
    setAgreements({
      over14: nextValue,
      terms: nextValue,
      privacy: nextValue,
      collection: nextValue,
    });
  };

  const toggleAgreement = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!allRequiredAgreed) {
      setError(TEXT.errAgreeRequired);
      return;
    }

    const fullName = `${form.lastName}${form.firstName}`.trim();
    if (!fullName) {
      setError(TEXT.errNameRequired);
      return;
    }

    try {
      await register({
        email: form.email,
        password: form.password,
        name: fullName,
        phone: form.phone,
        address: form.address,
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : TEXT.errRegisterFailed);
    }
  };

  return (
    <PageLayout hideIntro>
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h1 className="text-4xl sm:text-[2.6rem] font-extrabold tracking-tight text-center">{TEXT.title}</h1>
        <div className="mt-4 border-b-2 border-foreground/90" />

        <form onSubmit={submit} className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold">{TEXT.consentHeading}</h2>
            <div className="mt-3 rounded-xl border border-border overflow-hidden">
              <label className="flex items-center gap-3 px-4 py-4 bg-secondary/40 border-b border-border cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                  checked={allRequiredAgreed}
                  onChange={toggleAllAgreements}
                />
                <span className="text-sm font-semibold">{TEXT.agreeAll}</span>
              </label>

              <label className="flex items-center justify-between gap-3 px-4 py-4 border-b border-border cursor-pointer">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={agreements.over14}
                    onChange={() => toggleAgreement("over14")}
                  />
                  <span className="text-sm">
                    {TEXT.over14} <span className="text-cyan-700 font-semibold">{TEXT.required}</span>
                  </span>
                </span>
              </label>

              <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={agreements.terms}
                    onChange={() => toggleAgreement("terms")}
                  />
                  <span className="text-sm">
                    {TEXT.terms} <span className="text-cyan-700 font-semibold">{TEXT.required}</span>
                  </span>
                </label>
                <Link to="/terms/service" className="text-xs text-muted-foreground underline hover:text-primary">
                  {TEXT.detail}
                </Link>
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={agreements.privacy}
                    onChange={() => toggleAgreement("privacy")}
                  />
                  <span className="text-sm">
                    {TEXT.privacy} <span className="text-cyan-700 font-semibold">{TEXT.required}</span>
                  </span>
                </label>
                <Link to="/terms/privacy" className="text-xs text-muted-foreground underline hover:text-primary">
                  {TEXT.detail}
                </Link>
              </div>

              <label className="flex items-center justify-between gap-3 px-4 py-4 cursor-pointer">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={agreements.collection}
                    onChange={() => toggleAgreement("collection")}
                  />
                  <span className="text-sm">
                    {TEXT.collection} <span className="text-cyan-700 font-semibold">{TEXT.required}</span>
                  </span>
                </span>
                <span className="text-xs text-muted-foreground underline">{TEXT.detail}</span>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
                placeholder={TEXT.lastName}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              <input
                className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
                placeholder={TEXT.firstName}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>

            <input
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder={TEXT.email}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder={TEXT.password}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder={TEXT.phone}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder={TEXT.address}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <button className="rounded-md bg-cyan-400 px-8 py-3 font-semibold text-white transition-colors hover:bg-cyan-500">
              {TEXT.submit}
            </button>
            <p className="text-base text-foreground">
              {TEXT.alreadyMember}{" "}
              <Link to="/login" className="font-semibold text-primary underline underline-offset-2">
                {TEXT.login}
              </Link>
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </PageLayout>
  );
}
