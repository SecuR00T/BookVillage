import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  title: "\ud68c\uc6d0\uac00\uc785",
  consentHeading: "BOOKVILLAGE \uc774\uc6a9 \ub3d9\uc758",
  agreeAll: "\uc57d\uad00 \uc804\uccb4 \ub3d9\uc758\ud558\uae30",
  over14: "\ub9cc 14\uc138 \uc774\uc0c1\uc785\ub2c8\ub2e4.",
  required: "(\ud544\uc218)",
  terms: "\uc774\uc6a9\uc57d\uad00",
  privacy: "\uac1c\uc778\uc815\ubcf4 \ucc98\ub9ac\ubc29\uce68",
  collection: "\uac1c\uc778\uc815\ubcf4 \uc218\uc9d1\u00b7\uc774\uc6a9\u00b7\uc81c\uacf5 \ub3d9\uc758",
  detail: "\uc790\uc138\ud788",
  lastName: "\uc131",
  firstName: "\uc774\ub984",
  email: "\uc774\uba54\uc77c",
  password: "\ube44\ubc00\ubc88\ud638",
  phone: "\uc804\ud654\ubc88\ud638",
  address: "\uc8fc\uc18c",
  submit: "\uac00\uc785\ud558\uae30",
  alreadyMember: "\uc774\ubbf8 BOOKVILLAGE \ud68c\uc6d0\uc778\uac00\uc694?",
  login: "\ub85c\uadf8\uc778",
  errAgreeRequired: "\ud544\uc218 \uc57d\uad00\uc5d0 \ubaa8\ub450 \ub3d9\uc758\ud574 \uc8fc\uc138\uc694.",
  errNameRequired: "\uc774\ub984\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694.",
  errRegisterFailed: "\ud68c\uc6d0\uac00\uc785 \uc2e4\ud328",
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
                    {TEXT.over14} <span className="text-primary font-semibold">{TEXT.required}</span>
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
                    {TEXT.terms} <span className="text-primary font-semibold">{TEXT.required}</span>
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
                    {TEXT.privacy} <span className="text-primary font-semibold">{TEXT.required}</span>
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
                    {TEXT.collection} <span className="text-primary font-semibold">{TEXT.required}</span>
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

