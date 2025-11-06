import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState({ name: '', email: '', message: '' });

    const validate = () => {
        let tempErrors = { name: '', email: '', message: '' };
        let isValid = true;
        if (!formData.name) {
            tempErrors.name = 'Full name is required.';
            isValid = false;
        }
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'A valid email is required.';
            isValid = false;
        }
        if (!formData.message) {
            tempErrors.message = 'Message cannot be empty.';
            isValid = false;
        }
        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            console.log("Form Submitted:", formData); // Mock submission
            setIsSubmitted(true);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-dark mb-8">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info & Map */}
                <div>
                    <h2 className="text-2xl font-semibold text-brand-dark mb-4">Get In Touch</h2>
                    <div className="space-y-4 text-brand-text">
                        <p><strong>📍 Address:</strong> 147-13 Jamaica Avenue, New York, NY</p>
                        <p><strong>📞 Phone:</strong> (123) 456-7890</p>
                        <p><strong>🕒 Hours:</strong><br />
                            Mon-Sat: 9AM - 7PM<br />
                            Sun: 10AM - 6PM
                        </p>
                    </div>
                    <div className="mt-8 rounded-lg overflow-hidden shadow-md">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.411685817268!2d-73.8093156845945!3d40.7088489793322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c260ff170957c7%3A0x6287f3531b4356e!2s147-13%20Jamaica%20Ave%2C%20Jamaica%2C%20NY%2011435%2C%20USA!5e0!3m2!1sen!2suk!4v1678886456789!5m2!1sen!2suk" 
                            width="100%" 
                            height="300" 
                            style={{ border: 0 }} 
                            allowFullScreen={true}
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                {/* Contact Form */}
                <div>
                    <h2 className="text-2xl font-semibold text-brand-dark mb-4">Send Us a Message</h2>
                    {isSubmitted ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Thank you!</strong>
                            <span className="block sm:inline"> Your message has been sent successfully.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea name="message" id="message" rows={5} value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary"></textarea>
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark transition-colors">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
