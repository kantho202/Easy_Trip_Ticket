import { 
    FaRocket, 
    FaUsers, 
    FaAward, 
    FaGlobe,
    FaCheckCircle 
} from 'react-icons/fa';

const AboutSection = () => {
    const achievements = [
        { icon: <FaUsers />, number: "10K+", label: "Happy Customers" },
        { icon: <FaGlobe />, number: "50+", label: "Cities Covered" },
        { icon: <FaAward />, number: "5+", label: "Years Experience" },
        { icon: <FaRocket />, number: "99%", label: "Success Rate" }
    ];

    const features = [
        "Easy and quick ticket booking process",
        "Secure payment gateway integration",
        "Real-time ticket availability updates",
        "24/7 customer support service",
        "Mobile-friendly booking platform",
        "Instant booking confirmation"
    ];

    return (
        <div className="py-20 px-4  md:py-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:gap-12">
                    {/* Left Side - Image & Stats */}
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop" 
                                alt="Online Ticket Booking"
                                className="w-full h-96 md:h-72 object-cover"
                            />
                            <div className="absolute bottom-5 right-5 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-float">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center text-2xl">
                                    <FaRocket />
                                </div>
                                <div className=''>
                                    <div className="text-xl lg:text-2xl font-bold text-gray-700">20K+</div>
                                    <div className="text-sm text-gray-700">Tickets Booked</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4">
                            {achievements.map((item, index) => (
                                <div 
                                    key={index}
                                    className="border-gray-200 border-2 p-6 md:p-4 rounded-xl text-center transition-all duration-300  hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="text-3xl md:text-2xl flex justify-center text-orange-500 mb-2">
                                        {item.icon}
                                    </div>
                                    <div className="text-2xl md:text-xl font-bold  mb-1">
                                        {item.number}
                                    </div>
                                    <div className="text-xs font-semibold text-gray-400">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div>
                        <div className="inline-block px-5 py-2 rounded-full text-xl font-semibold mb-6">
                            About Us
                        </div>
                        <h2 className="text-4xl md:text-3xl font-bold  mb-6 leading-tight ">
                            Your Trusted Partner for Online Ticket Booking
                        </h2>
                        <p className="text-lg  leading-relaxed mb-6">
                            We are a leading online ticket booking platform dedicated to making your travel 
                            planning seamless and hassle-free. With years of experience in the industry, 
                            we provide a reliable and user-friendly platform for booking tickets to various 
                            destinations.
                        </p>
                        <p className="text-lg  leading-relaxed mb-6">
                            Our mission is to revolutionize the way people book tickets by offering a 
                            convenient, secure, and efficient booking experience. We partner with trusted 
                            service providers to ensure you get the best deals and quality service.
                        </p>

                        <div className="my-8">
                            <h3 className="text-2xl font-semibold  mb-6">
                                Why Choose Our Platform?
                            </h3>
                            <div className="grid gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="text-green-500 text-xl flex-shrink-0">
                                            <FaCheckCircle />
                                        </div>
                                        <span className="text-base ">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 flex-col sm:flex-row">
                            <a 
                                href="/all-tickets"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
                            >
                                Book Now
                            </a>
                            <a 
                                href="/contact"
                                className="inline-block px-6 py-3  text-orange-500 font-semibold border-2 border-orange-500 rounded-xl transition-all duration-300 hover:bg-orange-500 hover:text-white hover:-translate-y-1 text-center"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AboutSection;
