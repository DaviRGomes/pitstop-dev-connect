import { Link } from "@tanstack/react-router";
import sennaS from "@/assets/brand/senna-s.png.asset.json";

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link to="/" className="home-brand">
        <span className="brand-mark">
          <img src={sennaS.url} alt="" width={28} height={28} />
        </span>
        <b>
          pitstop<span className="tld">.dev.br</span>
        </b>
      </Link>
      <nav>
        <Link to="/" hash="sobre">sobre</Link>
        <Link to="/" hash="areas">áreas</Link>
        <Link to="/" hash="relatorios">relatórios</Link>
      </nav>
    </header>
  );
}