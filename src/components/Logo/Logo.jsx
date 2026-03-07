
import React from 'react';
import { MdOutlineAirplaneTicket } from 'react-icons/md';
import { Link } from 'react-router';
import image  from '../../assets/online-booking.png'
const Logo = () => {
    return (
        <div>
             <Link to="/" className="flex justify-center items-center font-bold logo text-xl"> 
                <img src={image} className='w-8 pr-2' alt="" />
                <h1>EasyTrip <span className='text-primary'>Ticket</span></h1>
                {/* <MdOutlineAirplaneTicket color='orange' size={33} />EasyTrip <span className='text-orange-400'>Ticket</span> */}
                </Link>
        </div>
    );
};

export default Logo;