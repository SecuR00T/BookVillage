import { Link } from "react-router-dom";

const quickLinks = {
  service: [
    { label: "\uC774\uC6A9\uC57D\uAD00", to: "/terms/service" },
    { label: "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68", to: "/terms/privacy" },
    { label: "\uACF5\uC9C0\uC0AC\uD56D", to: "/customer-service" },
    { label: "\uC790\uC8FC \uBB3B\uB294 \uC9C8\uBB38", to: "/customer-service" },
  ],
  shortcuts: [
    { label: "\uB9C8\uC774\uD398\uC774\uC9C0", to: "/mypage" },
    { label: "\uBCA0\uC2A4\uD2B8\uC140\uB7EC", to: "/books?category=\uBCA0\uC2A4\uD2B8\uC140\uB7EC" },
    { label: "\uC2E0\uAC04 \uB3C4\uC11C", to: "/books?category=\uC2E0\uAC04" },
    { label: "\uC774\uBCA4\uD2B8", to: "/security-labs" },
  ],
};

const Footer = () => (
  <footer className="bg-secondary border-t border-border mt-14">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <img src="/ohyes24-logo.svg" alt="오예스24" className="h-10 w-auto mb-3" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            {"\uB300\uD55C\uBBFC\uAD6D \uB300\uD45C \uC628\uB77C\uC778 \uC11C\uC810."}
            <br />
            {"\uC5B8\uC81C \uC5B4\uB514\uC11C\uB098 \uC88B\uC740 \uCC45\uC744 \uB9CC\uB098\uC138\uC694."}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-base">{"\uACE0\uAC1D\uC13C\uD130"}</h4>
          <p className="text-3xl font-extrabold text-foreground leading-none">1544-0000</p>
          <p className="text-sm text-muted-foreground mt-3">{"\uD3C9\uC77C 09:00 ~ 18:00"}</p>
          <p className="text-sm text-muted-foreground">help@ohyes24.com</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-base">{"\uC11C\uBE44\uC2A4"}</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {quickLinks.service.map((item) => (
              <Link key={item.label} to={item.to} className="block hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3 text-base">{"\uBC14\uB85C\uAC00\uAE30"}</h4>
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
        <p>(c) 2026 OHYES24. All rights reserved.</p>
        <p>{"\uBAA8\uC758 \uD574\uD0B9 \uD14C\uC2A4\uD2B8\uC6A9 \uC0AC\uC774\uD2B8\uC785\uB2C8\uB2E4."}</p>
      </div>
    </div>
  </footer>
);

export default Footer;
