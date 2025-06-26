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
            <div className="left-slider">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    loop={true}
                >
                    <SwiperSlide>
                        <img src="/banner1.webp" alt="banner1" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/banner2.webp" alt="banner2" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/banner3.webp" alt="banner3" />
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
