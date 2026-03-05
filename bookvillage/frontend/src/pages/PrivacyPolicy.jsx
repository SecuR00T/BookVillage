import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

export default function PrivacyPolicy() {
  return (
    <PageLayout title="BOOKVILLAGE 개인정보 처리방침" description="BOOKVILLAGE 개인정보 처리방침 전문입니다.">
      <article className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 leading-7">
        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">1. 개인정보 수집 항목</h2>
          <p>회사는 회원가입, 주문, 고객문의 처리 과정에서 아래 정보를 수집할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>필수: 이름, 이메일, 비밀번호, 연락처, 배송지 정보</li>
            <li>선택: 마케팅 수신 동의 정보</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">2. 개인정보 이용 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 관리 및 본인 확인</li>
            <li>주문/결제/배송 서비스 제공</li>
            <li>고객 문의 대응 및 서비스 개선</li>
            <li>법령상 의무 이행</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">3. 보유 및 이용 기간</h2>
          <p>개인정보는 수집·이용 목적 달성 시 지체 없이 파기합니다.</p>
          <p>다만 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>계약/청약철회 관련 기록: 5년</li>
            <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
            <li>로그인/접속 기록: 3개월</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">4. 제3자 제공 및 처리위탁</h2>
          <p>회사는 법령에 근거가 있거나 이용자 동의가 있는 경우에만 개인정보를 제3자에게 제공합니다.</p>
          <p>배송, 결제 등 서비스 제공을 위해 필요한 범위 내에서 처리업무를 위탁할 수 있습니다.</p>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">5. 이용자 권리</h2>
          <p>이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.</p>
          <p>요청은 아래 문의처를 통해 접수할 수 있습니다.</p>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">6. 문의처</h2>
          <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-1">
            <p>개인정보 담당부서: BOOKVILLAGE 보안팀</p>
            <p>이메일: privacy@bookvillage.com</p>
            <p>고객센터: 1544-0000</p>
          </div>
        </section>

        <div className="pt-2">
          <Link
            to="/register"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95 transition-opacity"
          >
            회원가입으로 돌아가기
          </Link>
        </div>
      </article>
    </PageLayout>
  );
}
