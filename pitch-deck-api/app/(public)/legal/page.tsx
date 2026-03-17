"use client"

import { motion } from "framer-motion"
import { CursorGlow } from "@/components/cursor-glow"

export default function Legal() {
  return (
    <div className="relative w-full overflow-x-hidden">
      <CursorGlow />

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Legal Information</span>
          </motion.h1>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.1 }}
             className="text-lg opacity-80"
          >
            Transparency and trust are at the core of our business.
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
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
                These Terms of Use govern access to and use of the website of Ascend Accounting and Advisory ("Ascend", "the Firm", "we", "our", or "us").
                By accessing this website, you agree to be bound by these Terms.
              </p>

              <h3 className="text-xl bento-title mt-4">1. About the Firm</h3>
              <p>
                Ascend Accounting and Advisory is an Ethiopia-based professional advisory firm providing accounting, financial advisory, transaction support, and related consulting services.<br />
                The content on this website is provided for general informational purposes only and does not constitute accounting, tax, financial, legal, or investment advice.<br />
                Accessing or using this website does not create a client relationship. A professional engagement is established only through a signed engagement letter.
              </p>

              <h3 className="text-xl bento-title mt-4">2. Permitted Use</h3>
              <p>
                You agree to:<br />
                - Use the website only for lawful purposes<br />
                - Provide accurate and complete information when submitting forms<br />
                - Not misuse downloadable materials (including pitch decks)<br />
                - Not attempt to compromise website security<br />
                Ascend reserves the right to restrict access in cases of misuse.
              </p>

              <h3 className="text-xl bento-title mt-4">3. Intellectual Property</h3>
              <p>
                All materials on this website, including but not limited to:<br />
                - Branding and logos<br />
                - Reports and insights<br />
                - Presentations and pitch materials<br />
                - Written content and graphics<br />
                They are the property of Ascend Accounting and Advisory unless otherwise stated. Unauthorized reproduction, distribution, or modification is prohibited.
              </p>

              <h3 className="text-xl bento-title mt-4">4. Confidentiality and Communications</h3>
              <p>
                Information submitted through this website (including investor inquiries or CV submissions) is handled with reasonable care.<br />
                However, website communication does not create fiduciary or confidentiality obligations beyond standard data protection practices. Confidentiality protections apply only once formal agreements are executed.
              </p>

              <h3 className="text-xl bento-title mt-4">5. Limitation of Liability</h3>
              <p>
                To the fullest extent permitted by law:<br />
                Ascend Accounting and Advisory shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:<br />
                - Reliance on website content<br />
                - Business interruption<br />
                - Data loss<br />
                - Use of third-party links<br />
                Use of this website is at your own risk.
              </p>

              <h3 className="text-xl bento-title mt-4">6. Third-Party Links</h3>
              <p>
                The website may include links to external websites. Ascend does not control and is not responsible for third-party content or privacy practices.
              </p>

              <h3 className="text-xl bento-title mt-4">7. Governing Law</h3>
              <p>
                These Terms shall be governed by the laws of the Federal Democratic Republic of Ethiopia.
              </p>
            </div>
          </motion.div>
        </section>

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
                Ascend Accounting and Advisory is committed to protecting personal data and maintaining the trust of clients, investors, and applicants.
              </p>

              <h3 className="text-xl bento-title mt-4">1. Information We Collect</h3>
              <p>
                We may collect following categories of personal data:<br />
                <strong>A. Contact Information</strong>: Name, Email address, Telephone number, Company name (if provided)<br />
                <strong>B. Investor & Pitch Deck Access</strong>: Email address, Company name, Position/title (if provided)<br />
                <strong>C. Careers & Recruitment</strong>: Curriculum Vitae (CV), Professional qualifications, Employment history, Educational background<br />
                <strong>D. Technical Information</strong>: IP address, Device type, Browser information, Usage analytics, Cookies
              </p>

              <h3 className="text-xl bento-title mt-4">2. Purpose of Processing</h3>
              <p>
                We process personal data for:<br />
                - Responding to inquiries<br />
                - Providing requested materials (e.g., pitch decks)<br />
                - Recruitment evaluation<br />
                - Improving website performance<br />
                - Maintaining security<br />
                - Complying with legal obligations<br />
                We do not sell personal information.
              </p>

              <h3 className="text-xl bento-title mt-4">3. Legal Basis</h3>
              <p>
                Processing is conducted based on:<br />
                - Legitimate business interests<br />
                - Consent (where required)<br />
                - Contractual necessity<br />
                - Legal compliance obligations
              </p>

              <h3 className="text-xl bento-title mt-4">4. Data Security</h3>
              <p>
                Ascend implements reasonable technical and organizational safeguards to protect personal data. However, no internet transmission is fully secure.
              </p>

              <h3 className="text-xl bento-title mt-4">5. Data Retention</h3>
              <p>
                Career applications may be retained for future opportunities unless deletion is requested.<br />
                Inquiry data is retained as necessary for business purposes.<br />
                Individuals may request deletion at any time.
              </p>

              <h3 className="text-xl bento-title mt-4">6. International Considerations</h3>
              <p>
                As Ascend expands internationally, personal data may be processed outside Ethiopia through reputable service providers, subject to appropriate safeguards.
              </p>

              <h3 className="text-xl bento-title mt-4">7. Your Rights</h3>
              <p>
                You may request:<br />
                - Access to personal data<br />
                - Correction of inaccurate data<br />
                - Deletion of personal data<br />
                - Withdrawal of consent<br />
                Requests may be directed to: <a href="mailto:info@ascendadvisoryet.com" className="text-primary hover:underline">info@ascendadvisoryet.com</a>
              </p>
            </div>
          </motion.div>
        </section>

        {/* Cookie Policy */}
        <section id="cookie-policy" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="backdrop-blur-3xl bg-black/10 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl p-8 md:p-10"
          >
            <h2 className="text-3xl bento-title mb-6">Cookie Policy</h2>
            <div className="bento-text space-y-4">
              <p>
                Ascend Accounting and Advisory uses cookies and similar technologies to:<br />
                - Improve website performance<br />
                - Analyze traffic and engagement<br />
                - Enhance user experience<br />
              </p>
              <p>
                Users may disable cookies in their browser settings.<br />
                If Firm engages with jurisdictions requiring explicit consent mechanisms, a cookie consent banner will be implemented.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Professional Disclaimer */}
        <section id="professional-disclaimer" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="backdrop-blur-3xl bg-black/10 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl p-8 md:p-10"
          >
            <h2 className="text-3xl bento-title mb-6">Professional Disclaimer</h2>
            <div className="bento-text space-y-4">
              <p>
                The materials on this website are provided for informational purposes only. They do not constitute:<br />
                - Accounting advice<br />
                - Tax advice<br />
                - Investment advice<br />
                - Legal advice<br />
              </p>
              <p>
                No action should be taken based solely on website content without obtaining independent professional advice.<br />
                Ascend Accounting and Advisory disclaims liability for reliance placed on website information.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Ethics & Professional Standards */}
        <section id="ethics" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="backdrop-blur-3xl bg-black/10 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl p-8 md:p-10"
          >
            <h2 className="text-3xl bento-title mb-6">Ethics & Professional Standards Statement</h2>
            <div className="bento-text space-y-4">
              <p>Ascend Accounting and Advisory is committed to:<br />
                - Integrity and independence<br />
                - Professional competence<br />
                - Confidentiality<br />
                - Compliance with applicable Ethiopian laws and professional standards<br />
                - Ethical conduct in all advisory engagements
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
