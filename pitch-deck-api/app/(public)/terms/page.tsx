import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions - Ascend Finance & Advisory",
  description:
    "Read the terms and conditions for using Ascend Finance & Advisory as an investor or founder.",
}

export default function TermsPage() {
  return (
    <div>
      <section className="border-b bg-card py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-card-foreground md:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            These Terms & Conditions govern your use of the Ascend Finance &
            Advisory platform as a founder or investor. By creating an
            account or accessing the platform, you agree to these terms.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl space-y-10 px-4 text-sm leading-relaxed text-muted-foreground lg:px-8">
          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              1. Accounts and Eligibility
            </h2>
            <p>
              You must provide accurate information when creating an account.
              You are responsible for keeping your login credentials secure
              and for all activity that occurs under your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              2. Use of the Platform
            </h2>
            <p>
              Founders may upload pitch decks and company information for
              review by Ascend and potential investors. Investors may access
              these materials for the sole purpose of evaluating investment
              opportunities. You agree not to misuse the platform, attempt to
              breach security, or use the service for any unlawful purpose.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              3. Confidentiality and Intellectual Property
            </h2>
            <p>
              Pitch decks and related materials remain the property of the
              founders who submit them. Investors agree not to share,
              redistribute, or publicly disclose confidential information
              obtained through the platform without prior written consent from
              the relevant founder, except as required by law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              4. No Investment Advice
            </h2>
            <p>
              Ascend Finance & Advisory does not provide legal, tax, or
              investment advice. Any decision to invest is made solely by the
              investor. You are responsible for conducting your own due
              diligence and seeking independent professional advice where
              appropriate.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              5. Appointments and Communication
            </h2>
            <p>
              When you book appointments through the platform, you agree to
              attend at the scheduled time or cancel with reasonable notice.
              Ascend may monitor communication on the platform to ensure
              quality, security, and compliance with these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              6. Acceptable Use and Prohibited Conduct
            </h2>
            <p>
              You agree not to upload harmful, offensive, or illegal content;
              impersonate any person or entity; or attempt to interfere with
              the normal operation of the platform. Ascend may suspend or
              terminate accounts that violate these rules.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Ascend Finance & Advisory
              is not liable for any indirect, incidental, or consequential
              damages arising from your use of the platform, including but not
              limited to lost profits, data loss, or business interruptions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              8. Changes to These Terms
            </h2>
            <p>
              We may update these Terms & Conditions from time to time. When
              we make material changes, we will update the effective date and,
              where appropriate, notify you through the platform. Continued
              use of the service after changes take effect constitutes your
              acceptance of the updated terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-foreground">
              9. Contact
            </h2>
            <p>
              If you have questions about these Terms & Conditions, you can
              contact us using the details on our{" "}
              <a
                href="/contact"
                className="font-medium text-primary underline underline-offset-2"
              >
                contact page
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}

