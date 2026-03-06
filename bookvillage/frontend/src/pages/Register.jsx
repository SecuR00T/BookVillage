import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  title: "회원가입",
  consentHeading: "BOOKVILLAGE 이용 동의",
  agreeAll: "약관 전체 동의하기",
  over14: "만 14세 이상입니다.",
  required: "(필수)",
  terms: "이용약관",
  privacy: "개인정보 처리방침",
  collection: "개인정보 수집·이용·제공 동의",
  detail: "자세히",
  lastName: "성",
  firstName: "이름",
  email: "이메일",
  password: "비밀번호",
  passwordConfirm: "비밀번호 확인",
  phone: "전화번호",
  address: "주소",
  addressSearch: "주소 검색",
  addressSearchPlaceholder: "도로명/동/건물명을 입력하세요",
  addressDetail: "선택된 주소 (필요하면 상세 주소까지 입력)",
  addressSearching: "검색 중...",
  addressNoResult: "일치하는 주소가 없습니다.",
  submit: "가입하기",
  alreadyMember: "이미 BOOKVILLAGE 회원인가요?",
  login: "로그인",
  errAgreeRequired: "필수 약관에 모두 동의해 주세요.",
  errNameRequired: "이름을 입력해 주세요.",
  errPasswordConfirmRequired: "비밀번호 확인을 입력해 주세요.",
  errPasswordMismatch: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
  errAddressQueryRequired: "주소 검색어를 2자 이상 입력해 주세요.",
  errAddressSearchFailed: "주소 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  errRegisterFailed: "회원가입 실패",
};

const formatAddressOption = (item) => {
  const streetLine = [item?.street, item?.number].filter(Boolean).join(" ");
  return item?.zipcode ? `(${item.zipcode}) ${streetLine}`.trim() : streetLine;
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
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
  const [addressQuery, setAddressQuery] = useState("");
  const [addressResults, setAddressResults] = useState([]);
  const [addressSearchLoading, setAddressSearchLoading] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState("");
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

  const runAddressSearch = async () => {
    const keyword = addressQuery.trim();
    if (keyword.length < 2) {
      setAddressSearchError(TEXT.errAddressQueryRequired);
      setAddressResults([]);
      return;
    }

    setAddressSearchLoading(true);
    setAddressSearchError("");
    setAddressResults([]);
    try {
      const rows = await api.auth.searchAddress(keyword);
      const normalized = Array.isArray(rows) ? rows : [];
      setAddressResults(normalized);
      if (!normalized.length) {
        setAddressSearchError(TEXT.addressNoResult);
      }
    } catch (_err) {
      setAddressSearchError(TEXT.errAddressSearchFailed);
    } finally {
      setAddressSearchLoading(false);
    }
  };

  const selectAddress = (item) => {
    const selected = formatAddressOption(item);
    if (!selected) return;
    setForm((prev) => ({ ...prev, address: selected }));
    setAddressSearchError("");
    setAddressResults([]);
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

    if (!form.passwordConfirm) {
      setError(TEXT.errPasswordConfirmRequired);
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError(TEXT.errPasswordMismatch);
      return;
    }

    try {
      await register({
        username: form.username,
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
        <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-[2.6rem]">{TEXT.title}</h1>
        <div className="mt-4 border-b-2 border-foreground/90" />

        <form onSubmit={submit} className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold">{TEXT.consentHeading}</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <label className="flex cursor-pointer items-center gap-3 border-b border-border bg-secondary/40 px-4 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                  checked={allRequiredAgreed}
                  onChange={toggleAllAgreements}
                />
                <span className="text-sm font-semibold">{TEXT.agreeAll}</span>
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-3 border-b border-border px-4 py-4">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={agreements.over14}
                    onChange={() => toggleAgreement("over14")}
                  />
                  <span className="text-sm">
                    {TEXT.over14} <span className="font-semibold text-primary">{TEXT.required}</span>
                  </span>
                </span>
              </label>

              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={agreements.terms}
                    onChange={() => toggleAgreement("terms")}
                  />
                  <span className="text-sm">
                    {TEXT.terms} <span className="font-semibold text-primary">{TEXT.required}</span>
                  </span>
                </label>
                <Link to="/terms/service" className="text-xs text-muted-foreground underline hover:text-primary">
                  {TEXT.detail}
                </Link>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={agreements.privacy}
                    onChange={() => toggleAgreement("privacy")}
                  />
                  <span className="text-sm">
                    {TEXT.privacy} <span className="font-semibold text-primary">{TEXT.required}</span>
                  </span>
                </label>
                <Link to="/terms/privacy" className="text-xs text-muted-foreground underline hover:text-primary">
                  {TEXT.detail}
                </Link>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={agreements.collection}
                    onChange={() => toggleAgreement("collection")}
                  />
                  <span className="text-sm">
                    {TEXT.collection} <span className="font-semibold text-primary">{TEXT.required}</span>
                  </span>
                </span>
                <span className="text-xs text-muted-foreground underline">{TEXT.detail}</span>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
                placeholder={TEXT.lastName}
                value={form.lastName}
                onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
              />
              <input
                className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
                placeholder={TEXT.firstName}
                value={form.firstName}
                onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>

            <input
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder="아이디"
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            />
            <input
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder={TEXT.email}
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <input
              type="password"
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder={TEXT.password}
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
            <input
              type="password"
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder={TEXT.passwordConfirm}
              value={form.passwordConfirm}
              onChange={(e) => setForm((prev) => ({ ...prev, passwordConfirm: e.target.value }))}
            />
            <input
              className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
              placeholder={TEXT.phone}
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />

            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
                  placeholder={TEXT.addressSearchPlaceholder}
                  value={addressQuery}
                  onChange={(e) => {
                    setAddressQuery(e.target.value);
                    setAddressSearchError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void runAddressSearch();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => void runAddressSearch()}
                  className="rounded-md border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={addressSearchLoading}
                >
                  {addressSearchLoading ? TEXT.addressSearching : TEXT.addressSearch}
                </button>
              </div>

              {addressResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-background">
                  {addressResults.map((item, idx) => {
                    const label = formatAddressOption(item);
                    return (
                      <button
                        key={`${label}-${idx}`}
                        type="button"
                        className="block w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-secondary/40"
                        onClick={() => selectAddress(item)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              <input
                className="w-full rounded-md border border-transparent bg-secondary/35 px-4 py-3 text-base focus:border-primary focus:bg-card focus:outline-none"
                placeholder={TEXT.addressDetail}
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              />
              {addressSearchError && <p className="text-xs text-red-600">{addressSearchError}</p>}
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <button className="rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              {TEXT.submit}
            </button>
            <p className="text-base text-foreground">
              {TEXT.alreadyMember}{" "}
              <Link to="/login" className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80">
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
