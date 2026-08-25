import { Link } from "react-router-dom";
import Container from "./Container.jsx";
import profile from "../../data/profile.js";

/**
 * Minimal footer: attribution left, wayfinding right.
 *
 * Deliberately does NOT list social links. They already appear in
 * the masthead on every page and as cards in the contact section —
 * a third copy directly under the second one just read as a
 * duplicate rather than as thoroughness.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule py-10">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {year} {profile.fullName}
          </p>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-6">
            <Link to="/work" className="text-sm text-muted hover:text-ink">
              Work
            </Link>
            <Link to="/about" className="text-sm text-muted hover:text-ink">
              About
            </Link>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-ink"
            >
              CV
            </a>

            {/* The previous portfolio, kept alive. Understated on
                purpose — it should reward a wanderer, not advertise
                itself. */}
            <Link
              to="/os"
              className="text-sm text-faint hover:text-muted"
              title="The previous portfolio — a desktop OS"
            >
              AKANBI.OS
            </Link>

            <span className="text-sm text-faint">{profile.location}</span>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
