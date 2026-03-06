import { FaSearch, FaTicketAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const BookingProcess = () => {
    const steps = [
        {
            icon: <FaSearch />,
            title: "Search Tickets",
            description: "Browse available tickets for your destination",
            color: "bg-blue-100 text-blue-500"
        },
        {
            icon: <FaTicketAlt />,
            title: "Select & Book",
            description: "Choose your preferred ticket and booking details",
            color: "bg-green-100 text-green-500"
        },
        {
            icon: <FaCreditCard />,
            title: "Secure Payment",
            description: "Complete payment with our secure payment gateway",
            color: "bg-yellow-100 text-yellow-500"
        },
        {
            icon: <FaCheckCircle />,
            title: "Get Confirmation",
            description: "Receive instant booking confirmation via email",
            color: "bg-purple-100 text-purple-500"
        }
    ];

    return (
        <div className="py-16 px-4  md:py-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        How Online Ticket Booking Works
                    </h2>
                    <p className="text-lg ">
                        Book your tickets in 4 simple steps
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative">
                    {steps.map((step, index) => (
                        <div 
                            key={index}
                            className="p-4 lg:p-8 rounded-2xl text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative"
                        >
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                {index + 1}
                            </div>
                            <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center text-3xl mx-auto mt-6 mb-6 transition-transform duration-300 hover:scale-110`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold  mb-3">
                                {step.title}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {step.description}
                            </p>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-8 -translate-y-1/2 text-3xl text-orange-500 font-bold">
                                    →
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center p-5 lg:p-12 md:p-4  rounded-3xl ">
                    <h3 className="text-3xl md:text-2xl font-bold  mb-6">
                        Ready to Book Your Ticket?
                    </h3>
                    <a 
                        href="/alltickets"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Browse All Tickets
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BookingProcess;
