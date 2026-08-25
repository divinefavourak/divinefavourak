import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";

export default function NotFound() {
  return (
    <Container as="main" className="grid min-h-[70vh] place-items-center py-40">
      <div className="text-center">
        <p className="label numeral">404</p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)]">
          Nothing here
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-muted">
          That page doesn't exist — or it moved when the site was rebuilt.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link to="/" className="link-underline text-sm">
            Home
          </Link>
          <Link to="/work" className="link-underline text-sm text-muted">
            Work
          </Link>
        </div>
      </div>
    </Container>
  );
}
