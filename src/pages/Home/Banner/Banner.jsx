

import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from '../../../assets/train.png';
import bannerImg2 from '../../../assets/bus.jpg';
import bannerImg3 from '../../../assets/travel.png';
import { Carousel } from 'react-responsive-carousel';
import { BsArrowUpRightCircleFill } from 'react-icons/bs';
import useAuth from '../../../hook/useAuth';
import Loader from '../../../components/Loading/Loading';

const Banner = () => {
    const {loading}=useAuth()
    if(loading){
        return <Loader></Loader>
    }
    return (
        <Carousel className=''
            autoPlay={true}
            infiniteLoop={true}
            data-aos="fade-up" data-aos-easing="linear"   data-aos-duration="1500"
        >
            <div className='relative'>
                <img src={bannerImg1} />
              
            </div>
            <div>
                <img src={bannerImg2} />
            </div>
            <div>
                <img src={bannerImg3} />
            </div>
        </Carousel>
    );
};

export default Banner;
