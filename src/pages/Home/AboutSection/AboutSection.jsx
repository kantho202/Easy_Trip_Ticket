import { 
    FaRocket, 
    FaUsers, 
    FaAward, 
    FaGlobe,
    FaCheckCircle 
} from 'react-icons/fa';
import { Link } from 'react-router';
import image from '../../../assets/Green Modern Travel Poster.png'
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
        <div className="py-20 px-4 lg:px-14  md:py-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:gap-12">
                    {/* Left Side - Image & Stats */}
                    <div className="relative">
                        <div className="relative rounded-[10px] overflow-hidden mb-8 shadow-2xl">
                            <img 
                                src={image}
                                alt="Online Ticket Booking"
                                className="w-full h-[300px] md:h-[400px] lg:h-96 object-cover"
                            />
                            <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 bg-gray-200 p-4 md:p-6 rounded-2xl shadow-xl flex items-center gap-3 md:gap-4 animate-float">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center text-xl md:text-2xl">
                                    <FaRocket />
                                </div>
                                <div>
                                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700">20K+</div>
                                    <div className="text-xs md:text-sm text-gray-700">Tickets Booked</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {achievements.map((item, index) => (
                                <div 
                                    key={index}
                                    className="border-gray-200 border-2 p-4 md:p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className="text-2xl md:text-3xl flex justify-center text-orange-500 mb-2">
                                        {item.icon}
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold mb-1">
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
                        <div className="inline-block px-5 py-2 bg-orange-100 text-orange-600 rounded-full text-sm md:text-base font-semibold mb-6">
                            About Us
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                            Your Trusted Partner for Online Ticket Booking
                        </h2>
                        <p className="text-base md:text-lg leading-relaxed mb-4 md:mb-6 text-gray-600">
                            We are a leading online ticket booking platform dedicated to making your travel 
                            planning seamless and hassle-free. With years of experience in the industry, 
                            we provide a reliable and user-friendly platform for booking tickets to various 
                            destinations.
                        </p>
                        <p className="text-base md:text-lg leading-relaxed mb-6 text-gray-600">
                            Our mission is to revolutionize the way people book tickets by offering a 
                            convenient, secure, and efficient booking experience. We partner with trusted 
                            service providers to ensure you get the best deals and quality service.
                        </p>

                        <div className="my-6 md:my-8">
                            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
                                Why Choose Our Platform?
                            </h3>
                            <div className="grid gap-3 md:gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 md:gap-4">
                                        <div className="text-green-500 text-lg md:text-xl flex-shrink-0">
                                            <FaCheckCircle />
                                        </div>
                                        <span className="text-sm md:text-base text-gray-700">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6 md:mt-8 flex-col sm:flex-row">
                            <Link 
                                to="/alltickets"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
                            >
                                Book Now
                            </Link>
                            <Link 
                                to="/contact"
                                className="inline-block px-6 py-3 text-orange-500 font-semibold border-2 border-orange-500 rounded-xl transition-all duration-300 hover:bg-orange-500 hover:text-white hover:-translate-y-1 text-center"
                            >
                                Contact Us
                            </Link>
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
