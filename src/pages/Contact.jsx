import { useState } from "react";
import Container from "../components/layout/Container.jsx";
import Reveal from "../components/motion/Reveal.jsx";
import profile from "../data/profile.js";

const MESSAGE_MAX = 1000;

/**
 * Client-side validation deliberately mirrors api/contact.js. The
 * server is still the authority — this only saves a round trip and
 * lets errors appear next to the field that caused them.
 */
function validate({ name, email, message }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please provide a valid email address.";
  if (message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  if (message.trim().length > MESSAGE_MAX)
    errors.message = `Message must be under ${MESSAGE_MAX} characters.`;
  return errors;
}

const EMPTY = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [serverMessage, setServerMessage] = useState("");

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  async function onSubmit(e) {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    setServerMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setStatus("error");
        // Surface the server's own message where it gave one — it
        // distinguishes rate limiting from a genuine failure.
        setServerMessage(
          data.message ?? "Something went wrong. Please try again."
        );
        return;
      }

      setStatus("sent");
      setServerMessage(data.message ?? "Message sent.");
      setForm(EMPTY);
    } catch {
      setStatus("error");
      setServerMessage(
        "Couldn't reach the server. Check your connection and try again."
      );
    }
  }

  return (
    <Container as="main" className="pt-36 pb-(--spacing-section) sm:pt-44">
      <Reveal>
        <p className="label">Contact</p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)]">Get in touch</h1>
      </Reveal>

      <div className="mt-14 grid gap-12 border-t border-rule pt-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="max-w-prose text-base leading-relaxed text-muted">
            Open to full-stack and mobile work, collaborations, and
            conversations about building things.
          </p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="label">Email</dt>
              <dd className="mt-1.5">
                <a
                  href={`mailto:${profile.email}`}
                  className="link-underline text-sm"
                >
                  {profile.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">Elsewhere</dt>
              <dd className="mt-1.5 flex flex-wrap gap-x-5 gap-y-2">
                {profile.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-muted hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className="lg:col-span-7">
          <form onSubmit={onSubmit} noValidate className="space-y-8">
            <Field
              id="name"
              label="Name"
              value={form.name}
              onChange={update("name")}
              error={errors.name}
              autoComplete="name"
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={update("email")}
              error={errors.email}
              autoComplete="email"
            />
            <Field
              id="message"
              label="Message"
              value={form.message}
              onChange={update("message")}
              error={errors.message}
              multiline
              hint={`${form.message.length} / ${MESSAGE_MAX}`}
            />

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={status === "sending"}
                className="border border-ink px-8 py-3 text-sm transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>

              {/* Announced to screen readers as it changes, rather
                  than only being visible. */}
              <p
                role="status"
                aria-live="polite"
                className={
                  status === "error"
                    ? "text-sm text-accent"
                    : "text-sm text-muted"
                }
              >
                {serverMessage}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </Container>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  multiline,
  hint,
  type = "text",
  ...rest
}) {
  const Tag = multiline ? "textarea" : "input";
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="label">
          {label}
        </label>
        {hint && <span className="numeral label">{hint}</span>}
      </div>

      <Tag
        id={id}
        name={id}
        type={multiline ? undefined : type}
        rows={multiline ? 6 : undefined}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className="mt-2 w-full resize-y border-b border-rule bg-transparent py-2.5 text-base outline-none transition-colors focus:border-ink"
        {...rest}
      />

      {error && (
        <p id={errorId} className="mt-2 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
