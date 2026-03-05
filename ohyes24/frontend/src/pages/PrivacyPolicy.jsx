import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const retentionRows = [
  {
    item: "계약 또는 청약철회에 관한 기록, 대금결제 및 재화 등의 공급에 관한 기록",
    period: "5년",
  },
  {
    item: "소비자 불만 또는 분쟁처리에 관한 기록",
    period: "3년",
  },
  {
    item: "로그기록자료, 접속지의 추적자료 등 통신사실확인자료",
    period: "3개월",
  },
  {
    item: "전기통신일시, 전기통신개시·종료시간, 사용도수 등 통신사실확인자료",
    period: "12개월",
  },
];

const destructionRows = [
  {
    type: "파기절차",
    desc: "파기 사유가 발생한 개인정보를 선정하고 개인정보 보호책임자의 승인을 받아 파기",
  },
  {
    type: "파기방법",
    desc: "전자적 파일은 복구 불가능한 방법으로 삭제, 종이 문서는 분쇄 또는 소각",
  },
];

export default function PrivacyPolicy() {
  return (
    <PageLayout title="오예스24 개인정보 처리방침" description="오예스24 개인정보 처리방침 전문입니다.">
      <article className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-8 leading-7">
        <section className="space-y-3 text-sm sm:text-base">
          <p>
            주식회사 오예스24(이하 “당사”)는 이용자의 개인정보를 적정하고 엄격하게 취급하는 것이 당사의 사회적 책무임을 인식하고, 본 “개인정보 처리방침”에 규정한
            사항을 준수합니다. 또한 개인정보 처리의 투명성을 높이고, 개인정보 보호 수준을 지속적으로 개선하기 위해 노력합니다.
          </p>
          <p className="font-semibold">
            주식회사 오예스24
            <br />
            대표이사 ○○○
          </p>
        </section>

        <section className="rounded-xl border border-border bg-secondary/20 p-4 sm:p-5">
          <h2 className="text-lg font-bold mb-3">개인정보 처리 목차</h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm sm:text-base">
            <li>개인정보 처리방침</li>
            <li>개인정보 이용 목적</li>
            <li>개인정보에 관한 상담 창구</li>
            <li>쿠키 정책</li>
          </ol>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-extrabold">A. 개인정보 처리방침</h2>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">1. 관련 법령 및 가이드라인 등의 준수</h3>
            <p>당사는 개인정보의 수집, 이용, 제공, 파기 등 개인정보 처리와 관련하여 「개인정보 보호법」 및 관련 법령, 고시, 지침을 준수합니다.</p>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">2. 이용 목적</h3>
            <p>당사는 제공받은 개인정보에 대하여 이용 목적을 특정하고, 그 목적 달성에 필요한 범위에서만 처리합니다. 개인정보 이용 목적은 「개인정보 이용 목적」을 참조해 주십시오.</p>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">3. 이용 목적의 변경</h3>
            <p>당사가 처리하는 개인정보는 「개인정보 이용 목적」 외의 용도로 이용되지 않으며, 이용 목적이 변경되는 경우 관련 법령에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">4. 이용 목적의 범위 외 이용</h3>
            <p>당사는 이용 목적 달성에 필요한 범위에서만 개인정보를 처리하며, 다음의 어느 하나에 해당하는 경우를 제외하고는 목적 외 이용 또는 제3자 제공을 하지 않습니다. 다만, 이용자 또는 제3자의 이익을 부당하게 침해할 우려가 있는 경우에는 제공하지 않습니다.</p>
            <ul className="space-y-1">
              <li>① 이용자의 별도 동의를 받은 경우</li>
              <li>② 다른 법률에 특별한 규정이 있는 경우</li>
              <li>③ 이용자 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li>
              <li>④ 공중위생 등 공공의 안전과 안녕을 위하여 긴급히 필요한 경우</li>
            </ul>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">5. 처리하는 개인정보 항목</h3>
            <p>당사는 다음의 개인정보 항목을 처리합니다.</p>
            <p className="font-semibold">고객 관련 정보</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40">
                  <tr>
                    <th className="p-3 font-semibold">항목 구분</th>
                    <th className="p-3 font-semibold">항목 목록</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">필수항목</td>
                    <td className="p-3">이름, 생년월일, 이메일, 비밀번호, 전화번호, 주소, 국가 정보, 주문 정보, 회원번호</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">선택항목</td>
                    <td className="p-3">회사명</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">6. 개인정보의 보유 및 이용기간</h3>
            <p>① 당사는 이용자의 개인정보를 고지 및 동의 받은 기간 동안 보유 및 이용합니다. 원칙적으로 회원 탈퇴 또는 개인정보 수집 및 이용 목적 달성 시 지체 없이 파기합니다.</p>
            <p>② 다만 관련 법령(예: 「전자상거래 등에서의 소비자 보호에 관한 법률」, 「전자금융거래법」 등)에 따라 보존할 필요가 있는 경우 그 기간 동안 보존합니다. 이 경우 보관 정보는 보관 목적에 한하여 이용합니다.</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40">
                  <tr>
                    <th className="p-3 font-semibold">보존 항목</th>
                    <th className="p-3 font-semibold">보존 기간</th>
                  </tr>
                </thead>
                <tbody>
                  {retentionRows.map((row) => (
                    <tr key={row.item} className="border-t border-border">
                      <td className="p-3">{row.item}</td>
                      <td className="p-3 font-medium">{row.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">7. 개인정보 파기 절차 및 방법</h3>
            <p>① 보유기간 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 파기합니다.</p>
            <p>② 법령에 따라 계속 보존해야 하는 경우, 해당 개인정보를 별도의 DB로 옮기거나 보관장소를 달리하여 보존합니다.</p>
            <p>③ 파기 절차 및 방법은 다음과 같습니다.</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40">
                  <tr>
                    <th className="p-3 font-semibold">구분</th>
                    <th className="p-3 font-semibold">내용</th>
                  </tr>
                </thead>
                <tbody>
                  {destructionRows.map((row) => (
                    <tr key={row.type} className="border-t border-border">
                      <td className="p-3 font-medium">{row.type}</td>
                      <td className="p-3">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">8. 이용자와 법정대리인의 권리·의무 및 행사방법</h3>
            <p>① 이용자 및 법정대리인은 다음 권리를 행사할 수 있습니다.</p>
            <ul className="space-y-1">
              <li>• 개인정보 열람 요구</li>
              <li>• 오류 정정 요구</li>
              <li>• 삭제 요구</li>
              <li>• 처리정지 요구</li>
            </ul>
            <p>② 권리 행사는 「개인정보에 관한 상담창구」를 통해 진행합니다.</p>
            <p>③ 정정 또는 삭제를 요구한 경우 완료 시까지 해당 개인정보를 이용하거나 제공하지 않습니다.</p>
            <p>④ 대리인을 통한 행사 시 위임장 등 확인서류가 필요합니다.</p>
            <p>⑤ 법령에 따라 열람 및 처리정지 요구가 제한될 수 있습니다.</p>
            <p>⑥ 다른 법령에서 수집 대상으로 명시된 경우 정정·삭제 요구가 제한될 수 있습니다.</p>
            <p>⑦ 당사는 권리 행사 요청자가 본인 또는 정당한 대리인인지 확인합니다.</p>
            <p>⑧ 이용자는 관계 법령을 위반하여 타인의 개인정보 및 사생활을 침해해서는 안 됩니다.</p>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">9. 개인정보의 제3자 제공</h3>
            <p>① 당사는 본 처리방침에서 명시한 범위 내에서만 개인정보를 처리하며, 이용자의 동의 또는 법령 근거가 있는 경우에만 제3자에게 제공합니다.</p>
            <p>② 당사는 다음과 같이 개인정보를 제3자에게 제공할 수 있습니다. (예시)</p>
            <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2">
              <p>제공받는 자: 주식회사 ○○○(예: 그룹사/제휴사 명칭)</p>
              <p>이용목적: 고객 서비스 지원 등</p>
              <p>제공 항목: 이름, 생년월일, 이메일, 전화번호, 주소, 국가 정보, 주문 정보, 회원번호, 회사명(해당 시)</p>
              <p>보유 및 이용기간: 개인정보 이용 목적 달성 시까지</p>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">10. 개인정보 처리의 위탁</h3>
            <p>① 당사는 원활한 서비스 제공을 위해 개인정보 처리업무를 위탁할 수 있습니다. (예시)</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40">
                  <tr>
                    <th className="p-3 font-semibold">수탁자</th>
                    <th className="p-3 font-semibold">위탁업무 내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3">○○택배/물류사</td>
                    <td className="p-3">상품 발송 및 배송</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">○○PG사</td>
                    <td className="p-3">신용카드 결제 대행</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">○○설치/시공업체</td>
                    <td className="p-3">설치, 치수 측정(해당 시)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>② 위탁업무 내용 또는 수탁자가 변경될 경우 본 처리방침을 통해 지체 없이 공개합니다.</p>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">11. 개인정보 처리의 국외이전</h3>
            <p>당사는 서비스 운영을 위해 개인정보를 국외로 이전할 수 있습니다. (예시)</p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40">
                  <tr>
                    <th className="p-3 font-semibold">항목</th>
                    <th className="p-3 font-semibold">내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">수탁/제공받는 자</td>
                    <td className="p-3">클라우드 서비스 제공사</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">이전국가</td>
                    <td className="p-3">○○</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">이전시기 및 방법</td>
                    <td className="p-3">24시간 365일 클라우드 인프라를 통해 저장·관리</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">이용목적</td>
                    <td className="p-3">e커머스 플랫폼/호스팅 제공</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">이전 항목</td>
                    <td className="p-3">이름, 이메일, 전화번호, 주소, 주문정보 등</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3 font-medium">보유기간</td>
                    <td className="p-3">목적 달성 시까지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">12. 개인정보의 안전성 확보조치</h3>
            <p>당사는 개인정보를 안전하게 관리하기 위해 다음과 같은 조치를 시행합니다.</p>
            <ul className="space-y-1">
              <li>① 조직적 조치: 내부관리계획 수립, 사고 대응 체계 구축</li>
              <li>② 물리적 조치: 개인정보 취급구역 접근 통제, 매체 반출 관리</li>
              <li>③ 인적 조치: 임직원 교육 및 보안서약</li>
              <li>④ 기술적 조치: 접근권한 관리, 인증/접근통제, 암호화, 보안시스템 운영</li>
              <li>⑤ 외부환경 파악: 관련 제도 및 위협 동향 점검</li>
            </ul>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">13. 개인정보 자동수집장치의 설치·운영 및 거부</h3>
            <p>① 당사는 맞춤서비스 제공 및 서비스 개선을 위해 쿠키(cookie)를 사용합니다.</p>
            <p>② 이용자는 쿠키 설치에 대한 선택권이 있으며, 상세 내용은 「쿠키 정책」을 참조해 주십시오.</p>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">14. 개인정보 보호책임자</h3>
            <p>당사는 개인정보 처리에 관한 업무를 총괄하고, 문의 및 피해구제를 위해 아래와 같이 개인정보 보호책임자를 지정합니다.</p>
            <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-4">
              <div>
                <p className="font-semibold">개인정보 보호책임자</p>
                <p>소속/직급: ○○○ / ○○</p>
                <p>성명: ○○○</p>
                <p>이메일: <a href="mailto:privacy@ohyes24.com" className="text-primary underline">privacy@ohyes24.com</a></p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="font-semibold">정보보호 최고책임자(CISO)</p>
                <p>소속/직급: ○○○ / ○○</p>
                <p>성명: ○○○</p>
                <p>이메일: <a href="mailto:security@ohyes24.com" className="text-primary underline">security@ohyes24.com</a></p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base">
            <h3 className="text-lg font-bold">15. 권익침해 구제방법</h3>
            <p>이용자는 아래 기관을 통해 개인정보 침해에 대한 상담 및 피해구제를 받을 수 있습니다.</p>
            <ul className="space-y-1">
              <li>개인정보 분쟁조정위원회 1833-6972 www.kopico.go.kr</li>
              <li>개인정보 침해신고센터 118 privacy.kisa.or.kr</li>
              <li>대검찰청 사이버수사과 1301 spo.go.kr</li>
              <li>경찰청 사이버안전국 182 cyberbureau.police.go.kr</li>
            </ul>
            <p className="font-medium">변경: 본 개인정보 처리방침은 20XX년 XX월 XX일부터 적용됩니다.</p>
          </div>
        </section>

        <section className="space-y-4 text-sm sm:text-base">
          <h2 className="text-2xl font-extrabold">B. 개인정보 이용 목적</h2>
          <p className="font-semibold">고객 관련 정보</p>
          <ul className="space-y-1">
            <li>① 상품 계약 이행, 계약 후 관리, AS(해당 시)</li>
            <li>② 주문 상품 발송 및 배송</li>
            <li>③ OHYES24 회원 등록 및 탈퇴 처리</li>
            <li>④ 문의 및 상담 대응</li>
            <li>⑤ 리콜 및 결함 정보 안내(해당 시)</li>
            <li>⑥ 상품, 서비스, 이벤트 관련 안내</li>
            <li>⑦ 설문조사 및 모니터링 조사</li>
            <li>⑧ 구매 이력, 웹사이트 이용 이력 등을 분석하여 이용자 관심사 파악 및 서비스 개선</li>
            <li>⑨ 분석 결과 기반 광고성 정보 발송, 연구개발, 마케팅, 판촉, 서비스 개선</li>
            <li>⑩ 거래협의 및 회의 관련 연락(사업자/기업회원 등 해당 시)</li>
            <li>⑪ 시설 내 CCTV 등을 통한 방범 및 안전관리(오프라인 매장 운영 시 해당)</li>
          </ul>
          <p className="font-semibold mt-3">거래처 관련 정보</p>
          <ul className="space-y-1">
            <li>① 계약 이행</li>
            <li>② 거래협의 및 회의 관련 연락</li>
          </ul>
          <p className="font-semibold mt-3">임직원/채용지원자/퇴사자 및 가족 관련 정보(해당 시)</p>
          <ul className="space-y-1">
            <li>① 업무 연락, 업무 관리, 시설 관리</li>
            <li>② 채용 및 인사관리, 근태관리</li>
            <li>③ 채용 안내 발송 및 모집활동</li>
            <li>④ 급여 및 복리후생</li>
            <li>⑤ 건강관리</li>
            <li>⑥ 세금 및 4대 보험 처리</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm sm:text-base">
          <h2 className="text-2xl font-extrabold">C. 개인정보에 관한 상담 창구</h2>
          <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2">
            <p className="font-semibold">고객상담실</p>
            <p>
              이메일:{" "}
              <a href="mailto:privacy@ohyes24.com" className="text-primary underline">
                privacy@ohyes24.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              (열람·정정·삭제·처리정지 요청은 이메일 접수 후, 본인확인 절차를 거쳐 처리됩니다. 대리인 신청 시 위임장 등 확인서류가 필요합니다.)
            </p>
          </div>
        </section>

        <section className="space-y-4 text-sm sm:text-base">
          <h2 className="text-2xl font-extrabold">D. 쿠키 정책</h2>
          <div className="space-y-3">
            <h3 className="text-lg font-bold">1. 쿠키 이용</h3>
            <p>쿠키란 사이트 접속 시 브라우저에 저장되는 정보입니다. 당사는 이용자 편의 제공 및 서비스 개선을 위해 쿠키를 이용할 수 있습니다. 쿠키에는 원칙적으로 개인정보가 포함되지 않습니다.</p>
            <p>또한 당사는 광고전송사업자와 제휴하여 인터넷상의 다른 사이트에 광고를 게재할 수 있으며, 이용자가 동의한 경우 제3자가 운영하는 데이터 관리 플랫폼 등에서 쿠키를 통해 수집된 웹사이트 열람 이력 및 분석결과를 취득하여 개인 데이터와 결부해 이용할 수 있습니다.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold">2. 이용 목적</h3>
            <ul className="space-y-1">
              <li>① 입력의 간략화 등 이용 편의 향상</li>
              <li>② 관심 정보 표시 및 맞춤형 서비스 제공</li>
              <li>③ 웹사이트 및 서비스 개선</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold">3. 무효화 방법</h3>
            <ul className="space-y-1">
              <li>① 모든 쿠키 무효화: 브라우저 설정 변경을 통해 쿠키 저장을 거부할 수 있습니다. 다만 일부 기능이 제한될 수 있습니다.</li>
              <li>② 특정 쿠키 무효화: 각 기업의 옵트아웃 페이지에서 쿠키 이용을 거부할 수 있습니다. 옵트아웃 방법은 각 제공업체 정책에 따릅니다.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold">4. 구글 애널리틱스에 대하여(사용 시)</h3>
            <p>당사는 서비스 개선을 위해 Google Analytics를 사용할 수 있습니다. Google Analytics는 쿠키를 통해 접속 정보를 익명으로 수집하며, 개인을 직접 식별하지 않습니다. 이용자는 브라우저 설정 또는 구글이 제공하는 옵트아웃 기능을 통해 수집을 거부할 수 있습니다.</p>
            <p className="font-medium">옵트아웃: Google Analytics Opt-out Browser Add-on을 이용할 수 있습니다.</p>
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
