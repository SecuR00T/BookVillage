import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

export default function TermsOfService() {
  return (
    <PageLayout title="OHYES24 서비스 이용약관" description="OHYES24 서비스 이용약관 전문입니다.">
      <article className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 leading-7">
        <section className="space-y-2">
          <h2 className="text-xl font-bold">일반</h2>
        </section>

        <section className="space-y-3 text-sm sm:text-base text-foreground">
          <p>
            본 약관은 주식회사 OHYES24(사업자등록번호 ○○○-○○-○○○○○, 통신판매업신고번호 ○○○○-서울○○-○○○○)가 운영하는{" "}
            <a
              href="http://www.ohyes24.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-2"
            >
              www.ohyes24.com
            </a>{" "}
            및 그 하위 도메인(이하 “웹사이트”)을 통하여 제공하는 온라인 도서 판매 및 관련 서비스의 이용과 관련하여 회사와 이용자 간의
            권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
          <p>
            본 약관에서 “회사”는 OHYES24를 의미하며, “이용자”는 웹사이트에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및
            비회원을 말합니다. “회원”은 웹사이트에 개인정보를 제공하여 회원등록을 한 자를 말하며, “고객”은 웹사이트를 통해 상품을 구매하는 자를
            의미합니다.
          </p>
          <p>본 약관은 웹사이트에 게시함으로써 효력이 발생하며, 이용자가 웹사이트에 접속하거나 서비스를 이용하는 경우 본 약관에 동의한 것으로 간주됩니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">1. 약관의 효력 및 변경</h2>
          <p>① 이용자는 회원가입 또는 웹사이트 이용 전에 본 약관을 읽어야 하며, 웹사이트에 접속하거나 서비스를 이용함으로써 본 약관에 동의한 것으로 봅니다.</p>
          <p>② 회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있습니다. 개정된 약관은 웹사이트에 게시함으로써 효력이 발생합니다. 이용자가 개정 약관 시행 이후에도 계속 서비스를 이용하는 경우 개정 약관에 동의한 것으로 간주됩니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">2. 회원가입 및 계정 관리</h2>
          <p>① 웹사이트 회원가입은 무료입니다. 단, 상품을 구매하기 위해서는 회원가입이 필요할 수 있습니다.</p>
          <p>② 회원은 다음 사항을 보증합니다.</p>
          <ul className="list-none space-y-1 pl-1 text-sm sm:text-base">
            <li>가. 만 14세 이상이거나 법정대리인의 동의를 받은 자</li>
            <li>나. 실명 및 정확한 개인정보를 제공한 자</li>
            <li>다. 제출한 정보가 사실이고 최신 정보임</li>
          </ul>
          <p>③ 회원은 계정과 비밀번호의 관리 책임이 있으며, 계정을 통한 모든 활동에 대한 책임을 집니다.</p>
          <p>④ 회사는 회원이 약관을 위반한 경우 사전 통지 없이 회원 자격을 제한하거나 계정을 삭제할 수 있습니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">3. 지적재산권</h2>
          <p>웹사이트에 게시된 모든 콘텐츠(텍스트, 도서 이미지, 표지 이미지, 상품 설명, 로고, 디자인, 소프트웨어 등)에 대한 저작권 및 기타 지적재산권은 회사 또는 정당한 권리를 보유한 제3자에게 귀속됩니다.</p>
          <p>이용자는 회사의 사전 서면 동의 없이 이를 복제, 배포, 전송, 전시, 수정, 2차 저작물 작성 등의 행위를 할 수 없습니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">4. 개인정보 보호</h2>
          <p>회사는 이용자의 개인정보를 관련 법령 및 개인정보처리방침에 따라 보호합니다. 개인정보의 수집, 이용, 제공 등에 관한 사항은 별도의 개인정보처리방침에 따릅니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">5. 서비스 이용</h2>
          <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="list-none space-y-1 pl-1 text-sm sm:text-base">
            <li>가. 허위 정보 등록</li>
            <li>나. 타인의 정보 도용</li>
            <li>다. 회사 및 제3자의 지적재산권 침해</li>
            <li>라. 서비스 운영을 방해하는 행위</li>
            <li>마. 법령에 위반되는 행위</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">6. 상품 구매 및 결제</h2>
          <p>① 웹사이트에 게시된 상품 정보(도서 가격, 배송비, 재고 여부 등)는 변경될 수 있습니다.</p>
          <p>② 이용자의 주문에 대하여 회사가 상품 발송을 완료한 시점에 매매계약이 성립합니다.</p>
          <p>③ 회사는 재고 부족, 시스템 오류 등 부득이한 사유가 있는 경우 주문을 취소할 수 있으며, 이미 결제된 금액은 환불합니다.</p>
          <p>④ 결제는 웹사이트에 안내된 결제수단을 통해 이루어지며, 결제 관련 세부사항은 결제정책에 따릅니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">7. 배송</h2>
          <p>① 회사는 결제 완료 후 합리적인 기간 내에 상품을 배송합니다.</p>
          <p>② 배송 지연이 발생할 경우 회사는 지체 없이 이를 고지합니다.</p>
          <p>③ 이용자의 귀책 사유로 인한 배송 실패에 대하여 회사는 책임을 지지 않습니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">8. 취소, 반품 및 환불</h2>
          <p>① 이용자는 상품 수령일로부터 14일 이내에 청약철회를 할 수 있습니다.</p>
          <p>② 단, 다음의 경우에는 반품이 제한될 수 있습니다.</p>
          <ul className="list-none space-y-1 pl-1 text-sm sm:text-base">
            <li>가. 이용자의 책임 있는 사유로 상품이 훼손된 경우</li>
            <li>나. 포장이 훼손되어 재판매가 곤란한 경우</li>
            <li>다. 디지털 콘텐츠의 경우 다운로드 완료 후</li>
          </ul>
          <p>③ 반품 비용은 귀책 사유에 따라 부담 주체가 결정됩니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">9. 면책</h2>
          <p>회사는 천재지변, 전산 장애, 통신 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>
          <p>회사는 이용자의 귀책 사유로 인한 손해에 대해 책임을 지지 않습니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">10. 책임의 제한</h2>
          <p>회사는 법령이 허용하는 범위 내에서 간접손해, 특별손해, 결과적 손해 등에 대해 책임을 지지 않습니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">11. 준거법 및 관할</h2>
          <p>본 약관은 대한민국 법령에 따라 해석됩니다. 서비스 이용과 관련하여 발생한 분쟁은 회사의 본점 소재지를 관할하는 법원을 관할 법원으로 합니다.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">12. 고객센터</h2>
          <p>서비스 이용과 관련한 문의는 아래 연락처로 할 수 있습니다.</p>
          <div className="rounded-xl bg-secondary/30 border border-border p-4 text-sm sm:text-base space-y-1">
            <p>상호: 주식회사 OHYES24</p>
            <p>고객센터: 02-0000-0000</p>
            <p>
              이메일:{" "}
              <a href="mailto:help@ohyes24.com" className="text-primary underline underline-offset-2">
                help@ohyes24.com
              </a>
            </p>
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
