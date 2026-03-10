import React from 'react';
import Banner from '../Banner/Banner';
import LatestTickets from '../LatestTickets/LatestTickets';
import { PopularRoutes } from '../PopularRoutes/PopularRoutes';
import { WhyChooseUs } from '../WhyChooseUs/WhyChooseUs';
import Advertisement from '../Advertisement/Advertisement';
import BookingProcess from '../BookingProcess/BookingProcess';
import TicketingFeatures from '../TicketingFeatures/TicketingFeatures';
import AboutSection from '../AboutSection/AboutSection';
import Contact from '../../Contact/Contact';
import Faq from '../Faq/Faq';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Advertisement></Advertisement>
            <AboutSection></AboutSection>
            <BookingProcess></BookingProcess>
            <LatestTickets></LatestTickets>
            <TicketingFeatures></TicketingFeatures>
            {/* <PopularRoutes></PopularRoutes> */}
            {/* <WhyChooseUs></WhyChooseUs> */}
            <Faq/>
            <Contact></Contact>
        </div>
    );
};

export default Home;