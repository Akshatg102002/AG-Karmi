import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-dark mb-8">Privacy Policy</h1>
            <div className="prose max-w-none text-brand-text">
                <p><em>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

                <h2 className="text-brand-dark">1. Introduction</h2>
                <p>
                    Welcome to Karmi Beauty Salon. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and booking services.
                </p>

                <h2 className="text-brand-dark">2. Information We Collect</h2>
                <p>We may collect personal information from you in a variety of ways, including, but not limited to, when you visit our site, register on the site, book an appointment, and in connection with other activities, services, features, or resources we make available.</p>
                <ul>
                    <li><strong>Personal Identification Information:</strong> Name, email address, phone number.</li>
                    <li><strong>Booking Information:</strong> Services booked, appointment times, stylist preferences, and notes you provide.</li>
                    <li><strong>Technical Data:</strong> We may collect non-personal identification information about Users whenever they interact with our Site, such as the browser name, the type of computer, and technical information about Users' means of connection to our Site.</li>
                </ul>

                <h2 className="text-brand-dark">3. How We Use Your Information</h2>
                <p>We use the information we collect or receive:</p>
                <ul>
                    <li>To personalize your experience.</li>
                    <li>To improve our website and services.</li>
                    <li>To process transactions and manage your bookings.</li>
                    <li>To send periodic emails, such as appointment confirmations, reminders, and updates.</li>
                </ul>

                <h2 className="text-brand-dark">4. Data Security</h2>
                <p>
                    We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.
                </p>

                <h2 className="text-brand-dark">5. Sharing Your Personal Information</h2>
                <p>
                    We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
                </p>

                <h2 className="text-brand-dark">6. Your Consent</h2>
                <p>
                    By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
                </p>

                <h2 className="text-brand-dark">7. Contacting Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us through our <a href="/contact" className="text-brand-primary hover:underline">Contact Page</a>.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
