import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './BannerSlider.css';

const slides = [
    { image: '/anh bia 1.jpeg', alt: 'banner1', title: 'CHUYÊN GIA LỌC NƯỚC' },
    { image: '/anh bia 2.jpeg', alt: 'banner2', title: 'ROBOT VÀ THIẾT BỊ' },
    { image: '/anh bia 3.jpeg', alt: 'banner3', title: 'GIA DỤNG VÀ NHÀ BẾP' }
];

const BannerSlider = () => {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const goToSlide = (index) => {
        if (swiperRef.current) {
            swiperRef.current.slideToLoop(index);
        }
    };

    return (
        <div className="slider-wrapper h-[315px] flex flex-col">
            {/* phần slider chiếm 100% - 50px */}
            <div className="flex-1 h-[90%] w-[80%]">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    autoplay={{ delay: 3000 }}
                    loop={true}
                    className="h-full"
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={slide.image}
                                alt={slide.alt}
                                className="w-full h-full object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* phần chữ cao 50px */}
            <div className="slider-text-menu h-[50px] w-[80%] flex items-center justify-center gap-6 bg-white" >
                {slides.map((slide, index) => (
                    <span
                        key={index}
                        className={`menu-item cursor-pointer ${activeIndex === index ? 'active font-bold text-blue-600' : ''
                            }`}
                        onClick={() => goToSlide(index)}
                    >
                        {slide.title}
                    </span>
                ))}
            </div>
        </div>
    );
};



export default BannerSlider;
