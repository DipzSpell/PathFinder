import PageShell, { Callout, Section } from '../components/PageShell'
import { CONTACT_EMAIL } from '../siteConfig'

const GOOD_REASONS = [
  'A step in a roadmap is wrong or out of date',
  'An exam, stream or career is missing',
  'Something is broken, or looks broken on your phone',
  'You have an idea that would make this more useful',
]

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 6.5l8.5 6 8.5-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Contact() {
  return (
    <PageShell
      eyebrow="contact"
      title="Say hello"
      intro="There is no contact form, no ticket number and no chatbot. Just an email address that a person reads."
    >
      <section className="reveal">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="lift press flex items-center gap-4 rounded-2xl border border-teal/25 bg-teal-soft/70 px-6 py-5 hover:border-teal/50"
        >
          <span className="text-teal">
            <MailIcon />
          </span>
          <span>
            <span className="block font-mono text-xs uppercase tracking-widest text-ink-soft">
              email
            </span>
            <span className="block font-display font-semibold text-lg text-ink break-all">
              {CONTACT_EMAIL}
            </span>
          </span>
        </a>
      </section>

      <Section title="Especially worth emailing about">
        <ul className="space-y-2 pl-5 list-disc marker:text-teal">
          {GOOD_REASONS.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <p>
          Corrections are the most valuable thing you can send. If a roadmap told you something
          that turned out to be wrong, that is worth knowing — include the career you searched
          for and what it got wrong, and it helps more than you would think.
        </p>
      </Section>

      <Section title="Response time">
        <p>
          This is a small independent project run by a person with other commitments, not a
          support desk. Replies usually happen, but not instantly, and not always quickly.
        </p>
      </Section>

      <Callout tone="coral" title="one thing we cannot help with">
        <p>
          We can&rsquo;t give you personal admissions advice — which college to choose, whether
          your marks are enough, or whether to take a drop year. We genuinely don&rsquo;t know
          your situation, and a confident guess from a stranger is worse than no answer.
        </p>
        <p>
          For that, speak to your school counsellor, or the admissions office of the college
          itself. They have your actual numbers in front of them.
        </p>
      </Callout>
    </PageShell>
  )
}
