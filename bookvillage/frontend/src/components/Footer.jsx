import { Link } from "react-router-dom";

const quickLinks = {
  service: [
    { label: "공지사항", to: "/customer-service?tab=notice" },
    { label: "자주 묻는 질문", to: "/customer-service?tab=faq" },
    { label: "이용약관", to: "/terms/service" },
    { label: "개인정보처리방침", to: "/terms/privacy" },
  ],
  shortcuts: [
    { label: "마이페이지", to: "/mypage" },
    { label: "베스트셀러", to: "/books?category=베스트셀러" },
    { label: "신간 도서", to: "/books?category=신간" },
    { label: "이벤트", to: "/events" },
  ],
};

const Footer = () => (
  <footer className="bg-secondary border-t border-border mt-14">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <img src="/bookvillage-logo.svg" alt="BOOKVILLAGE" className="h-10 w-auto mb-3" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            BOOKVILLAGE 온라인 서점.
            <br />
            언제 어디서나 좋은 책을 만나보세요.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-base">고객센터</h4>
          <p className="text-3xl font-extrabold text-foreground leading-none">1544-0000</p>
          <p className="text-sm text-muted-foreground mt-3">평일 09:00 ~ 18:00</p>
          <p className="text-sm text-muted-foreground">help@bookvillage.com</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-base">서비스</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {quickLinks.service.map((item) => (
              <Link key={item.label} to={item.to} className="block hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-base">바로가기</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {quickLinks.shortcuts.map((item) => (
              <Link key={item.label} to={item.to} className="block hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
        <p>(c) 2026 BOOKVILLAGE. All rights reserved.</p>
        <p>모의 해킹 테스트용 사이트입니다.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
