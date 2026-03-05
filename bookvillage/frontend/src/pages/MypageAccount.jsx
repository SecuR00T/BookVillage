import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, KeyRound, Loader2, Mail, MapPin, PencilLine, Phone, Save, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

export default function MypageAccount() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [edit, setEdit] = useState({ name: "", phone: "", address: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const data = await api.users.getProfileByUserId(Number(user.id));
      setProfile(data || null);
      setEdit({
        name: data?.name || "",
        phone: data?.phone || "",
        address: data?.address || "",
      });
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err.message : "회원 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    loadProfile();
  }, [user?.id]);

  const saveProfile = async () => {
    if (!profile?.id) return;
    setProfileErr("");
    setProfileMsg("");
    setSavingProfile(true);
    try {
      const updated = await api.users.update(profile.id, edit);
      setProfile(updated);
      setProfileMsg("프로필이 저장되었습니다.");
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : "프로필 저장에 실패했습니다.");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    setPwError("");
    setPwSuccess("");
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError("비밀번호 항목을 모두 입력해 주세요.");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setChangingPw(true);
    try {
      await api.users.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwSuccess("비밀번호가 변경되었습니다.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.");
    } finally {
      setChangingPw(false);
    }
  };

  const removeAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteError("비밀번호를 입력해 주세요.");
      return;
    }
    if (!window.confirm("계정을 정말로 삭제할까요? 복구할 수 없습니다.")) {
      return;
    }

    setDeleteError("");
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "계정 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
      setDeletePassword("");
    }
  };

  if (loading) {
    return (
      <PageLayout hideIntro>
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
          계정 정보를 불러오는 중입니다.
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout hideIntro>
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-card p-8">
          <p className="text-sm font-semibold text-red-600">{error || "회원 정보를 불러오지 못했습니다."}</p>
          <button
            type="button"
            onClick={loadProfile}
            className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            다시 시도
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="계정 관리">
      <section className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/mypage" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
            마이페이지 홈
          </Link>
          <Link to="/mypage/activity" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
            활동 관리
          </Link>
          <Link to="/mypage/wallet" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
            포인트/쿠폰
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_1.1fr]">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserRound size={18} className="text-primary" />
              <h2 className="text-lg font-bold">프로필 정보</h2>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail size={12} />
                  이메일
                </span>
                <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={profile.email || ""} disabled />
              </label>
              <label className="block">
                <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <PencilLine size={12} />
                  이름
                </span>
                <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone size={12} />
                  연락처
                </span>
                <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  주소
                </span>
                <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={edit.address} onChange={(e) => setEdit({ ...edit, address: e.target.value })} />
              </label>
            </div>

            {profileErr && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{profileErr}</p>}
            {profileMsg && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{profileMsg}</p>}

            <button
              type="button"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              onClick={saveProfile}
              disabled={savingProfile}
            >
              <Save size={14} />
              {savingProfile ? "처리 중..." : "프로필 저장"}
            </button>
          </section>

          <div className="space-y-5">
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <h2 className="text-lg font-bold">보안 설정</h2>
              </div>
              <div className="space-y-3">
                <input
                  type="password"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  placeholder="현재 비밀번호"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                />
                <input
                  type="password"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  placeholder="새 비밀번호"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                />
                <input
                  type="password"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  placeholder="새 비밀번호 확인"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                />
              </div>

              {pwError && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{pwError}</p>}
              {pwSuccess && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{pwSuccess}</p>}

              <button
                type="button"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                onClick={changePassword}
                disabled={changingPw}
              >
                <KeyRound size={14} />
                {changingPw ? "처리 중..." : "비밀번호 변경"}
              </button>
            </section>

            <section className="rounded-2xl border border-red-200 bg-card p-5">
              <div className="mb-4 flex items-center gap-2 text-red-600">
                <AlertTriangle size={18} />
                <h2 className="text-lg font-bold">계정 탈퇴</h2>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">탈퇴 시 계정 및 활동 기록이 삭제됩니다.</p>
              <input
                type="password"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                placeholder="비밀번호 확인"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              {deleteError && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{deleteError}</p>}
              <button
                type="button"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                onClick={removeAccount}
                disabled={deleting}
              >
                <Trash2 size={14} />
                {deleting ? "처리 중..." : "계정 탈퇴"}
              </button>
            </section>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
