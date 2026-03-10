const Faq = () => {
    const faqs = [
        {
            question: "How do I book a ticket online?",
            answer: "Simply browse available tickets, select your preferred destination and date, fill in passenger details, and complete the secure payment process. You'll receive instant confirmation via email."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, debit cards, and secure online payment methods through our integrated payment gateway. All transactions are encrypted and secure."
        },
        {
            question: "Can I cancel or modify my booking?",
            answer: "Yes, you can cancel or modify your booking through your dashboard. Cancellation policies vary by ticket type and vendor. Please check the specific terms before booking."
        },
        {
            question: "How will I receive my ticket?",
            answer: "After successful payment, you'll receive an e-ticket via email instantly. You can also download it from your account dashboard. Simply show the digital ticket or print it for your journey."
        },
        {
            question: "Is my personal information secure?",
            answer: "Absolutely. We use industry-standard encryption and security measures to protect your personal and payment information. Your data is never shared with third parties without consent."
        },
        {
            question: "What if I don't receive my booking confirmation?",
            answer: "Check your spam folder first. If you still don't see it, contact our 24/7 customer support team with your booking reference number, and we'll resend your confirmation immediately."
        }
    ];

    return (
        <div className="py-20 px-4 lg:px-14 md:py-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 md:mb-12">
                    <div className="inline-block px-6 py-3 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">
                        FAQ
                    </div>
                    <h2 className="text-4xl md:text-3xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our online ticket booking platform
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4 ">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="collapse collapse-arrow  border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                            <div className="collapse-title text-lg font-semibold  pr-12">
                                {faq.question}
                            </div>
                            <div className="collapse-content">
                                <p className="text-base text-gray-400 leading-relaxed pt-2">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

               
            </div>
        </div>
    );
};

export default Faq;