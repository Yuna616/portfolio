import { type FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { CONTACT_INBOX_EMAIL } from '../../constants/contact';

const FORMSUBMIT_AJAX = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_INBOX_EMAIL)}`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const onContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(FORMSUBMIT_AJAX, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setSent(true);
      form.reset();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Could not send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-neutral-200"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="font-mono text-[13px] text-portfolio uppercase tracking-[0.35em] mb-4">
            ▸ Get in touch
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-neutral-900 max-w-lg mx-auto">
            Have a question or want to work together?
          </h2>
        </motion.div>

        {sent ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-sm text-portfolio py-4 text-center"
          >
            Message sent. Thanks!
          </motion.p>
        ) : (
          <motion.form
            onSubmit={onContactSubmit}
            className="relative max-w-xl mx-auto space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            aria-busy={submitting}
          >
            <input type="hidden" name="_subject" value="Portfolio contact — PhotoPolio" />
            <input
              type="text"
              name="_gotcha"
              className="absolute -left-[10000px] h-0 w-0 opacity-0"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <motion.div variants={fadeUp}>
              <label htmlFor="contact-email" className="sr-only">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                disabled={submitting}
                placeholder="Email"
                className="w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-portfolio/50 transition-colors disabled:opacity-50"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <label htmlFor="contact-message" className="sr-only">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                disabled={submitting}
                placeholder="Your message"
                className="w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-portfolio/50 transition-colors resize-none min-h-[120px] disabled:opacity-50"
              />
            </motion.div>
            {sendError ? (
              <p className="font-mono text-sm text-red-500" role="alert">
                {sendError}
              </p>
            ) : null}
            <motion.div variants={fadeUp}>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg font-mono text-xs uppercase tracking-[0.2em] px-8 py-3 bg-portfolio text-portfolio-foreground font-bold transition-colors hover:bg-portfolio-hover disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? 'Sending…' : 'Submit'}
              </button>
            </motion.div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
