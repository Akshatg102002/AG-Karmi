import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';

const LandingPage: React.FC = () => {
    const { categories } = useData();
    const featuredCategories = categories.slice(0, 4);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-brand-light text-center py-20 px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">Experience Beauty, Redefined.</h1>
                <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">Your sanctuary for style, wellness, and relaxation in the heart of New York. Book your appointment today and let us pamper you.</p>
                <Link to="/book" className="mt-8 inline-block bg-brand-primary text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-brand-dark transition-transform transform hover:scale-105">
                    Book Now
                </Link>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-brand-dark mb-10">Our Services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredCategories.map(category => (
                            <div key={category.id} className="bg-gray-50 rounded-lg shadow-lg overflow-hidden text-center p-6 flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-secondary flex items-center justify-center overflow-hidden">
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-semibold text-brand-dark">{category.name}</h3>
                                <p className="text-gray-600 flex-grow mb-4">{category.description}</p>
                                 <Link to="/book" className="font-semibold text-brand-primary hover:text-brand-dark text-sm mt-auto">Book Now &rarr;</Link>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/book" className="font-semibold text-brand-primary hover:text-brand-dark">
                            View All Services &rarr;
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* About & Testimonials Section */}
            <section className="bg-brand-light py-16">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">About Karmi Beauty</h2>
                        <p className="text-brand-text mb-4">
                            Founded with a passion for artistry and a commitment to our clients, Karmi Beauty Salon is more than just a place to get your hair done. It's a community, a place to relax, and a space where you can feel confident and beautiful. Our team of expert stylists is dedicated to providing personalized service and exceptional results.
                        </p>
                    </div>
                     <div>
                        <h3 className="text-2xl font-bold text-brand-dark mb-4">What Our Clients Say</h3>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <blockquote className="text-brand-text italic">
                                "I've been coming to Karmi for years and I refuse to go anywhere else! The atmosphere is so welcoming, and my stylist, Ana, is a true artist. I always leave feeling like a brand new person."
                            </blockquote>
                            <p className="mt-4 font-semibold text-right">- Sarah L.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;