"use client"

import { motion } from "framer-motion"

export function LegalSections() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
      {/* Privacy Policy */}
      <section id="privacy-policy" className="scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="backdrop-blur-3xl bg-black/10 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl p-8 md:p-10"
        >
          <h2 className="text-3xl bento-title mb-6">Privacy Policy</h2>
          <div className="bento-text space-y-4">
            <p>
              <strong>Ascend Accounting and Advisory</strong><br />
              <strong>Effective Date: February 27, 2026</strong>
            </p>
            <p>
              Ascend Accounting and Advisory is committed to protecting personal data and maintaining trust of clients, investors, and applicants.
            </p>

            <h3 className="text-xl bento-title mt-4">Key Rights</h3>
            <p>
              You may request:<br />
              - Access to personal data<br />
              - Correction of inaccurate data<br />
              - Deletion of personal data<br />
              - Withdrawal of consent<br />
              Requests may be directed to: <a href="mailto:info@ascendadvisoryet.com" className="text-primary hover:underline">info@ascendadvisoryet.com</a>
            </p>
            
            <p className="text-sm text-muted-foreground mt-4">
              For complete privacy policy details, visit our <a href="/legal#privacy-policy" className="text-primary hover:underline">full legal page</a>.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Terms of Use */}
      <section id="terms-of-use" className="scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="bento-card"
        >
          <h2 className="text-3xl bento-title mb-6">Terms of Use</h2>
          <div className="bento-text space-y-4">
            <p>
              <strong>Ascend Accounting and Advisory</strong><br />
              <strong>Effective Date: February 27, 2026</strong>
            </p>
            <p>
              These Terms of Use govern access to and use of website of Ascend Accounting and Advisory. By accessing this website, you agree to be bound by these Terms.
            </p>

            <h3 className="text-xl bento-title mt-4">Key Points</h3>
            <p>
              - Use website only for lawful purposes<br />
              - Provide accurate and complete information when submitting forms<br />
              - Not misuse downloadable materials (including pitch decks)<br />
              - Not attempt to compromise website security<br />
              Ascend reserves the right to restrict access in cases of misuse.
            </p>
            
            <p className="text-sm text-muted-foreground mt-4">
              For complete terms and conditions, visit our <a href="/legal#terms-of-use" className="text-primary hover:underline">full legal page</a>.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
