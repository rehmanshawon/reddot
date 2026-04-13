import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section auth-layout">
      <div className="auth-card">
        <p className="section-header__eyebrow">404</p>
        <h1>That page does not exist.</h1>
        <p>The route is not configured yet or the URL is incorrect.</p>
        <Link to="/" className="button button--solid">
          Return Home
        </Link>
      </div>
    </section>
  );
}
