import React from "react";
import Footer from "../../components/Footer";

const TermsAndConditions: React.FC = () => {
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
              Terms & Conditions
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Last updated: October 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Welcome to Fifty Firsts Wellness. These Terms & Conditions govern your use of our website, services, and any digital content provided. By accessing or using our site, you agree to be bound by these terms.
            </p>
          </div>

          {/* Section 1: About Us */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              1. About Us
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Fifty Firsts Wellness is a UK-based wellness brand offering non-clinical, no evasive programmes, content, products and tools to support workplace wellbeing and personal growth. We operate under Fifty Firsts Wellness, a trading name for JKI Insights Limited, a registered company via Companies House, in England and Wales. For contact details, see Section 10.
            </p>
          </section>

          {/* Section 2: Use of Our Website */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              2. Use of Our Website
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>You may browse most areas of our site without registering for membership, but some content is restricted for Membership Subscriptions Only.</li>
              <li>Certain features (e.g. community access, premium downloads, ambassador portals) may require registration.</li>
              <li>You agree not to misuse the site or attempt to gain unauthorised access to any part of it.</li>
            </ul>
          </section>

          {/* Section 3: Intellectual Property */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              3. Intellectual Property
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>All content, branding, and materials (including podcast scripts, training frameworks and visual assets) are owned by Fifty Firsts Wellness or licensed to us.</li>
              <li>You may not reproduce, distribute or modify any content without written permission.</li>
              <li>Fifty Firsts Wellness is a Registered Trade Mark</li>
            </ul>
          </section>

          {/* Section 4: Services and Programmes */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              4. Services and Programmes
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>Our wellness programmes, services, ambassador training and downloadable tools are for informational and educational purposes only.</li>
              <li>They are not substitutes for clinical advice or treatment.</li>
              <li>We aim to provide inclusive, community and, where appropriate, bespoke wellness support, so outcomes may vary per individual or company.</li>
            </ul>
          </section>

          {/* Section 5: Payment and Subscriptions */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              5. Payment and Subscriptions
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>Prices for services or digital products are listed clearly and may include VAT.</li>
              <li>Payment is required in advance unless otherwise agreed.</li>
              <li>Subscription-based services (e.g. membership) will renew automatically unless cancelled.</li>
            </ul>
          </section>

          {/* Section 6: Cancellation and Refunds */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              6. Cancellation and Refunds
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>You may cancel services within 14 days of purchase unless delivery has already begun.</li>
              <li>Refunds are issued in accordance with the Consumer Rights Act 2015 for faulty products.</li>
              <li>For bespoke services (e.g. tailored wellness plans), cancellation terms will be outlined in your agreement.</li>
            </ul>
          </section>

          {/* Section 7: Liability and Disclaimers */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              7. Liability and Disclaimers
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>We do not guarantee specific outcomes from our wellness tools or training.</li>
              <li>We are not liable for indirect or consequential loss arising from use of our site or services.</li>
              <li>Our content is regularly reviewed and make every effort to keep our site up to date.</li>
              <li>We hold necessary insurance provision to conduct our wellness services.</li>
            </ul>
          </section>

          {/* Section 8: Compliance, Privacy and Data Protection */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              8. Compliance, Privacy and Data Protection
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>We comply with UK GDPR and data protection laws.</li>
              <li>Please refer to our Privacy Policy and Cookie Policy for details on how we collect and use your data.</li>
              <li>Our products are made in line with associated legal and regulatory requirements.</li>
              <li>We design and implement necessary controls, governance, risk mitigation and processes to manage our operations efficiently and effectively.</li>
            </ul>
          </section>

          {/* Section 9: Community Conduct */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              9. Community Conduct
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>We foster respectful, inclusive engagement across our platforms.</li>
              <li>Users must not post discriminatory, harmful or misleading content.</li>
              <li>We reserve the right to suspend access for breaches of conduct.</li>
            </ul>
          </section>

          {/* Section 10: Contact, Quality and Customer Satisfaction */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              10. Contact, Quality and Customer Satisfaction
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed space-y-2">
              <li>For queries or concerns, contact us at: <a href="mailto:info@fiftyfirstswellness.co.uk" className="text-brand-green hover:text-brand-green-dark underline">info@fiftyfirstswellness.co.uk</a></li>
              <li>We have high standards of quality in our products, services and community engagement, if you feel we have fallen short of these standards please contact us to discuss.</li>
              <li>We aim to resolve complaints promptly and fairly, with an initial acknowledgement within 3 working days.</li>
            </ul>
          </section>

          {/* Section 11: Governing Law */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              11. Governing Law
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the English courts.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
