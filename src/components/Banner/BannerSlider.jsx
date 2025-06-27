// src/components/BannerSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './BannerSlider.css';

const BannerSlider = () => {
    return (
        <div className="slider-wrapper">
            <div className="left-slider" style={{ height: '315px', overflow: 'hidden' }}>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    loop={true}
                    style={{ height: '100%' }}
                >
                    <SwiperSlide>
                        <img
                            src="/banner1.webp"
                            alt="banner1"
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="/banner2.webp"
                            alt="banner2"
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="/banner3.webp"
                            alt="banner3"
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="right-banners">
                <img src="/small1.webp" alt="small1" />
                <img src="/small2.webp" alt="small2" />
            </div>
        </div>
    );
};

export default BannerSlider;
