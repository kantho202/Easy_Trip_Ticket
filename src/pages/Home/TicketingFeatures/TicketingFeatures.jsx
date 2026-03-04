import { 
    FaMobileAlt, 
    FaClock, 
    FaMapMarkedAlt, 
    FaHeadset, 
    FaPercent, 
    FaLock 
} from 'react-icons/fa';

const TicketingFeatures = () => {
    const features = [
        {
            icon: <FaMobileAlt />,
            title: "Mobile Friendly",
            description: "Book tickets anytime, anywhere from your mobile device",
            color: "bg-blue-100 text-blue-500"
        },
        {
            icon: <FaClock />,
            title: "24/7 Availability",
            description: "Access our platform round the clock for instant bookings",
            color: "bg-green-100 text-green-500"
        },
        {
            icon: <FaMapMarkedAlt />,
            title: "Multiple Routes",
            description: "Wide range of destinations and routes to choose from",
            color: "bg-yellow-100 text-yellow-500"
        },
        {
            icon: <FaHeadset />,
            title: "Customer Support",
            description: "Dedicated support team ready to assist you",
            color: "bg-purple-100 text-purple-500"
        },
        {
            icon: <FaPercent />,
            title: "Best Prices",
            description: "Competitive pricing with exclusive deals and offers",
            color: "bg-pink-100 text-pink-500"
        },
        {
            icon: <FaLock />,
            title: "Secure Booking",
            description: "Safe and encrypted payment processing",
            color: "bg-red-100 text-red-500"
        }
    ];

    return (
        <div className="py-16 px-4  md:py-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-3xl font-bold mb-3">
                        Why Book Tickets Online?
                    </h2>
                    <p className="text-lg  max-w-2xl mx-auto">
                        Experience hassle-free ticket booking with our advanced features
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="p-8 rounded-2xl  text-center transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-black hover:border-orange-500 hover:-translate-y-1  group"
                        >
                            <div className={`w-18 h-18 ${feature.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold  mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 p-12 md:p-8 rounded-3xl border border-gray-200 shadow-xl">
                    <div className="text-center ">
                        <div className="text-4xl md:text-3xl font-bold mb-2">
                            10K+
                        </div>
                        <div className="text-base opacity-95 font-medium">
                            Happy Customers
                        </div>
                    </div>
                    <div className="text-center ">
                        <div className="text-4xl md:text-3xl font-bold mb-2">
                            50+
                        </div>
                        <div className="text-base opacity-95 font-medium">
                            Routes Available
                        </div>
                    </div>
                    <div className="text-center ">
                        <div className="text-4xl md:text-3xl font-bold mb-2">
                            99.9%
                        </div>
                        <div className="text-base opacity-95 font-medium">
                            Success Rate
                        </div>
                    </div>
                    <div className="text-center ">
                        <div className="text-4xl md:text-3xl font-bold mb-2">
                            24/7
                        </div>
                        <div className="text-base opacity-95 font-medium">
                            Support Available
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketingFeatures;
