import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, KeyRound, Search } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { api } from "@/api/client";

export default function AccountRecovery() {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const activeMode = modeParam === "reset" ? "reset" : "id";

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const submitFindId = async (e) => {
    e.preventDefault();
    setFindIdError("");
    setFindIdResult("");
    try {
      const response = await api.auth.findId(findIdName, findIdEmail);
      const foundId = response?.foundId || response?.maskedId || "N/A";
      setFindIdResult(`조회된 아이디: ${foundId}`);
    } catch (err) {
      setFindIdError(err instanceof Error ? err.message : "아이디 찾기에 실패했습니다.");
    }
  };

  const submitResetRequest = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetResult("");
    try {
      const response = await api.auth.requestPasswordReset(resetEmail);
      setResetResult(response?.message || "인증코드 요청이 완료되었습니다.");
      setShowResetConfirm(true);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "인증코드 요청에 실패했습니다.");
    }
  };

  const submitResetConfirm = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetResult("");
    try {
      await api.auth.confirmPasswordReset(resetEmail, resetToken, resetNewPassword, resetUserId);
      setResetResult("비밀번호가 변경되었습니다.");
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary/60 focus:bg-white focus:ring-2 focus:ring-primary/15";
  const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

  return (
    <PageLayout hideIntro>
      <section className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_38px_-28px_rgba(15,23,42,0.55)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {activeMode === "id" ? "아이디 찾기" : "비밀번호 재설정"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {activeMode === "id"
                  ? "가입 시 입력한 이름과 이메일로 아이디를 조회할 수 있습니다."
                  : "이메일 인증 후 새 비밀번호를 설정할 수 있습니다."}
              </p>
            </div>
            <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
              로그인으로 돌아가기
            </Link>
          </div>

          {activeMode === "id" ? (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Search size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">아이디 찾기</p>
                  <p className="text-xs text-slate-500">이름과 이메일로 아이디를 조회합니다.</p>
                </div>
              </div>

              <form onSubmit={submitFindId} className="mt-4 space-y-3">
                <div>
                  <label htmlFor="find-id-name" className={labelClass}>
                    이름
                  </label>
                  <input
                    id="find-id-name"
                    className={inputClass}
                    placeholder="가입한 이름을 입력하세요"
                    value={findIdName}
                    onChange={(e) => setFindIdName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="find-id-email" className={labelClass}>
                    이메일
                  </label>
                  <input
                    id="find-id-email"
                    type="email"
                    className={inputClass}
                    placeholder="가입한 이메일을 입력하세요"
                    value={findIdEmail}
                    onChange={(e) => setFindIdEmail(e.target.value)}
                  />
                </div>
                <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  아이디 찾기
                  <ArrowRight size={15} />
                </button>
              </form>

              {findIdResult && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={14} />
                  {findIdResult}
                </p>
              )}
              {findIdError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{findIdError}</p>}
            </section>
          ) : (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <KeyRound size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">비밀번호 재설정</p>
                  <p className="text-xs text-slate-500">인증코드 확인 후 새 비밀번호를 설정합니다.</p>
                </div>
              </div>

              <form onSubmit={submitResetRequest} className="mt-4 space-y-3">
                <div>
                  <label htmlFor="reset-email" className={labelClass}>
                    이메일
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    className={inputClass}
                    placeholder="가입한 이메일을 입력하세요"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                <button className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200">
                  인증코드 요청
                </button>
              </form>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm((prev) => !prev)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {showResetConfirm ? "2단계 접기" : "인증코드 입력 열기"}
                </button>
              </div>

              {showResetConfirm && (
                <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3">
                  <p className="text-xs font-semibold text-slate-500">인증코드 확인 후 비밀번호 변경</p>
                  <form onSubmit={submitResetConfirm} className="mt-3 space-y-3">
                    <div>
                      <label htmlFor="reset-user-id" className={labelClass}>
                        아이디
                      </label>
                      <input
                        id="reset-user-id"
                        className={inputClass}
                        placeholder="아이디를 입력하세요"
                        value={resetUserId}
                        onChange={(e) => setResetUserId(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="reset-token" className={labelClass}>
                        인증코드
                      </label>
                      <input
                        id="reset-token"
                        className={inputClass}
                        placeholder="이메일로 받은 인증코드"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="reset-new-password" className={labelClass}>
                        새 비밀번호
                      </label>
                      <input
                        id="reset-new-password"
                        type="password"
                        className={inputClass}
                        placeholder="8자 이상 입력하세요"
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                      />
                    </div>
                    <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                      비밀번호 변경
                      <ArrowRight size={15} />
                    </button>
                  </form>
                </div>
              )}

              {resetResult && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={14} />
                  {resetResult}
                </p>
              )}
              {resetError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{resetError}</p>}
            </section>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

