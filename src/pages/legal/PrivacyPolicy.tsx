import React from "react";
import Footer from "../../components/Footer";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Last updated: October 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Fifty Firsts Wellness Privacy Statement
            </h2>
            <h3 
              className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Introduction
            </h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              At Fifty Firsts Wellness, safeguarding your personal information is our highest priority. This Privacy Statement sets out how we collect, use, store and protect your data when you engage with our services, website and related platforms. We are committed to compliance with UK and EU data protection law, including the UK General Data Protection Regulation (UK GDPR) and EU GPDR. By using our services, you agree to the practices detailed in this statement.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              1. Information We Collect
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>
                <strong>Personal Information:</strong> When you register, book appointments or subscribe to communications, we may collect your name, email address, telephone number, date of birth and postal address.
              </li>
              <li>
                <strong>Health & Wellness Data:</strong> To deliver tailored wellness services, we may need health information, details about your wellness goals, medical history and lifestyle preferences.
              </li>
              <li>
                <strong>Technical Data:</strong> We collect data on how you interact with our website and services, including your IP address (if appropriate), device type, browser information and pages visited.
              </li>
              <li>
                <strong>Cookies:</strong> Our website uses cookies and similar technologies in line with UK and EU law. You can adjust your browser settings to refuse cookies, although some website features may then be unavailable.
              </li>
            </ul>
          </section>

          {/* Section 2: Lawful Basis for Processing */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              2. Lawful Basis for Processing
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              We will only process your personal information when a lawful basis exists under UK and EU Privacy Law including:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>Performance of a contract</li>
              <li>Processing product / service delivery and shipping</li>
              <li>Compliance with legal and regulatory obligations</li>
              <li>Consent (for marketing and certain health information)</li>
              <li>Legitimate interests, provided your rights and freedoms are not overridden</li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>To deliver, personalise, and improve our wellness services</li>
              <li>To communicate with you regarding appointments, updates, and relevant wellness information</li>
              <li>To process payments and manage accounts</li>
              <li>To comply with UK legal and regulatory requirements</li>
              <li>For internal record-keeping, analytics, and service improvement</li>
            </ul>
          </section>

          {/* Section 4: Sharing Your Information */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              4. Sharing Your Information
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              We do not sell or rent your personal information to third parties. We may share your data only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>With trusted service providers and partners (such as payment processors, consultants needed to complete service delivery and IT support), under robust contracts and confidentiality agreements</li>
              <li>If required by UK and EU law, a court order or regulatory authority</li>
              <li>In the event of a business transfer, such as a merger or acquisition, where your information may be transferred as part of the assets</li>
            </ul>
          </section>

          {/* Section 5: International Transfers */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              5. International Transfers
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Your data may be transferred outside the UK or EEA. Where this happens, we ensure appropriate safeguards are in place, such as UK-approved standard contractual clauses.
            </p>
          </section>

          {/* Section 6: Data Security */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              6. Data Security
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We implement technical and organisational measures to protect your information from unauthorised access, alteration, disclosure or destruction. This includes secure servers, encryption and regular security reviews.
            </p>
          </section>

          {/* Section 7: Data Retention */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              7. Data Retention
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Your personal information is retained only as long as necessary for the purposes stated or as required by law. Data is securely deleted or anonymised when no longer needed.
            </p>
          </section>

          {/* Section 8: Your Rights Under UK / EU GDPR */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              8. Your Rights Under UK / EU GDPR
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              You have rights regarding your personal data, including:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2 mb-4">
              <li>The right to access your data</li>
              <li>The right to rectification of inaccurate data</li>
              <li>The right to erasure ("the right to be forgotten") in certain circumstances</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent for marketing or other processing at any time</li>
            </ul>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              To exercise these rights, please contact us on{" "}
              <a 
                href="mailto:info@fiftyfirstswellness.co.uk" 
                className="text-brand-green hover:text-brand-green-dark underline"
              >
                info@fiftyfirstswellness.co.uk
              </a>{" "}
              for further information.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              If you are unhappy with how your data is being processed, please let us know on the same email and will contact you to discuss. You also have the right to record a complaint with the Information Commissioner's Office (ICO){" "}
              <a 
                href="https://www.ico.org.uk" 
                className="text-brand-green hover:text-brand-green-dark underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.ico.org.uk
              </a>{" "}
              should we be unable to process to your satisfaction.
            </p>
          </section>

          {/* Section 9: Children's Privacy */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              9. Children's Privacy
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect data from children. If you believe a child has provided personal information, please contact us for prompt removal.
            </p>
          </section>

          {/* Section 10: Changes to This Privacy Policy */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We may update this Privacy Policy to reflect changes in legislation or our practices. Any revisions will be published on this page with the effective date.
            </p>
          </section>

          {/* Section 11: Contact Us */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              11. Contact Us
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              If you have questions or concerns about this policy or your data, please contact:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>
                Email:{" "}
                <a 
                  href="mailto:info@fiftyfirstswellness.com" 
                  className="text-brand-green hover:text-brand-green-dark underline"
                >
                  info@fiftyfirstswellness.com
                </a>
              </li>
            </ul>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mt-4">
              This policy was last updated on October 2025.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
