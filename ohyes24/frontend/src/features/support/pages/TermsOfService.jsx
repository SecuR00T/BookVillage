import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

export default function TermsOfService() {
  return (
    <PageLayout title="BOOKCHON 서비스 이용약관" description="BOOKCHON 서비스 이용약관 전문입니다.">
      <article className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 leading-7">
        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">제1조 (목적)</h2>
          <p>
            본 약관은 BOOKCHON(이하 "회사")이 운영하는 온라인 서점 서비스의 이용과 관련하여 회사와 이용자의
            권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">제2조 (정의)</h2>
          <p>"이용자"란 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</p>
          <p>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자를 말합니다.</p>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">제3조 (약관의 효력 및 변경)</h2>
          <p>본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.</p>
          <p>회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.</p>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">제4조 (서비스 제공)</h2>
          <p>회사는 도서 검색, 주문, 결제, 배송 조회, 고객센터 등 전자상거래 관련 서비스를 제공합니다.</p>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">제5조 (회원의 의무)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.</li>
            <li>서비스 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            <li>관계 법령 및 본 약관을 준수해야 합니다.</li>
          </ul>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">제6조 (주문, 결제, 취소/환불)</h2>
          <p>주문 및 결제는 서비스에서 제공하는 절차에 따라 진행됩니다.</p>
          <p>취소, 환불, 반품 기준은 관계 법령 및 회사 정책에 따릅니다.</p>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">제7조 (면책)</h2>
          <p>회사는 천재지변 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>
        </section>

        <section className="space-y-2 text-sm sm:text-base">
          <h2 className="text-xl font-bold">제8조 (문의처)</h2>
          <div className="rounded-xl bg-secondary/30 border border-border p-4 space-y-1">
            <p>상호: BOOKCHON</p>
            <p>고객센터: 1544-0000</p>
            <p>이메일: help@bookchon.co.kr</p>
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
