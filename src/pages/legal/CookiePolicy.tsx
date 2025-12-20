import React from "react";
import Footer from "../../components/Footer";

const CookiePolicy: React.FC = () => {
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
              Cookie Policy
            </h1>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              We've designed this information page to provide our site visitors with accessible, transparent information about the cookies we use.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              This information is relevant for visitors to{" "}
              <a 
                href="https://www.fiftyfirstswellness.co.uk" 
                className="text-brand-green hover:text-brand-green-dark underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.fiftyfirstswellness.co.uk
              </a>{" "}
              and{" "}
              <a 
                href="https://www.fiftyfirstswellness.com" 
                className="text-brand-green hover:text-brand-green-dark underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.fiftyfirstswellness.com
              </a>{" "}
              on the areas of our site which provide you with access to our blogs, webinars and resources content. As you move around our site you may see a Cookie 'pop up' appearing - this is to ensure we keep you fully informed about the cookies used in the particular area of the site you are visiting.
            </p>
          </div>

          {/* What are cookies? */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              What are cookies?
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Cookies are small text files that are placed on your computer by the websites that you visit. They are used in order to make websites work, or work more efficiently, as well as to provide statistical information to site owners. Some cookies also enable the display of relevant advertising when you move from site to site.
            </p>
          </section>

          {/* Our Cookies, Your Choice */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Our Cookies, Your Choice
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
              We use three types of cookies on our site:
            </p>

            {/* Necessary Cookies */}
            <div className="mb-8">
              <h3 
                className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Necessary Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These cookies are necessary for our site to operate. They don't access or store any personal data. Our website cannot function without these cookies so they are always set on.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                You can manage and control cookies through your browser (a good search term is 'managing cookies'). Your choices will include removing cookies by deleting them from your 'browser history' when you leave our site. If you do switch cookies off for our site it may not work as well as you would expect it to.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="mb-8">
              <h3 
                className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Analytics Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These cookies allow us to measure and report on website activity such as which pages are visited most frequently and how visitors move around the site. The information collected does not directly identify any visitors individually. We drop these cookies and use Adobe to help us analyse the data.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We've set these cookies on but you can turn them off at any time via the cookie settings button below.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="mb-8">
              <h3 
                className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Marketing Cookies
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These cookies help us provide personalised and relevant services or advertising to our site visitors, and to assess the effectiveness of our digital marketing activities. We also use these cookies to enable third party 'plug-ins' like social media sharing and like buttons. They also ensure that video content can be played.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                The tables below provide details about the actual cookies we use of each type. We've included information on the duration of each cookie, its purpose and if its use involves the transfer of information to any of our third party business partners.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                These partners include, but not limited to:
              </p>
              <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 leading-relaxed mb-4 ml-4">
                <li>Adobe</li>
                <li>Google</li>
                <li>LinkedIn</li>
                <li>Facebook</li>
                <li>Instagram</li>
              </ul>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We are always on dialogue with our third party partners about the duration of some of the cookies i.e. where we think the duration could be reduced.
              </p>
            </div>
          </section>

          {/* Managing cookies on your device */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Managing cookies on your device
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We use cookies to personalize content and to provide you with an improved user experience. By using this website or application you consent to the deployment of cookies. You can control and manage cookies using your browser (see below). Please note that removing or blocking cookies can impact your user experience and some functionality may no longer be available.
            </p>
          </section>

          {/* Using your browser to control cookies */}
          <section className="mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Using your browser to control cookies
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Most browsers allow you to view, manage, delete and block cookies for a website. Be aware that if you delete all cookies then any preferences you have set will be lost, including the ability to opt-out from cookies as this function itself requires placement of an opt out cookie on your device.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
