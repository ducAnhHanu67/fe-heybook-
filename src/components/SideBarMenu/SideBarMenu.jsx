import React, { useState } from 'react';
import './SideBarMenu.css';

const menuData = [
    {
        title: 'ROBOT HÚT BỤI',
        icon: '/icon1.jpg',
        brands: ['HÃNG ECOVACS', 'HÃNG XIAOMI', 'HÃNG KHÁC', 'HÃNG ROBOROCK', 'HÃNG YEEDI', 'HÃNG DREAME', 'HÃNG LIECTROUX']
    },
    {
        title: 'MÁY RỬA BÁT',
        icon: '/2 may rua bat.png',
        brands: ['HÃNG BOSCH', 'HÃNG ELECTROLUX', 'HÃNG HAFELE']
    },
    {
        title: 'MÁY LỌC KHÔNG KHÍ',
        icon: '/3 loc khong khi.png',
        brands: ['HÃNG DAIKIN', 'HÃNG SHARP', 'HÃNG PANASONIC']
    },
    {
        title: 'MÁY LỌC NƯỚC & LỌC KIỀM',
        icon: '/4 loc nuoc va loc kiem.png',
        brands: ['KANGAROO', 'KAROFI', 'AO SMITH']
    },
    {
        title: 'THIẾT BỊ BẾP',
        icon: '/5 thiet bi bep.png',
        brands: ['BẾP TỪ', 'MÁY HÚT MÙI', 'LÒ NƯỚNG']
    },
    {
        title: 'ĐỒ GIA DỤNG',
        icon: '/6 do gia dung.png',
        brands: ['NỒI CƠM', 'QUẠT ĐIỆN', 'MÁY SẤY TÓC']
    },
    {
        title: 'PHỤ KIỆN',
        icon: '/7 phu kien.png',
        brands: ['PIN', 'SẠC', 'PHỤ KIỆN KHÁC']
    }
];

const SideBarMenu = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="sidebar-container">
            <div className="sidebar-left">
                {menuData.map((item, index) => (
                    <div
                        key={index}
                        className={`menu-item ${activeIndex === index ? 'active' : ''}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {/* icon = ảnh */}
                        <img
                            src={item.icon}
                            alt={item.title}
                            className="menu-icon w-[22px] h-[22px] object-contain mr-2"
                        />

                        <span className="menu-title">{item.title}</span>
                        <span className="arrow">›</span>

                        {/* phần right xuất hiện absolute khi hover */}
                        {activeIndex === index && (
                            <div className="sidebar-right">
                                <div className="brands-list">
                                    {item.brands.map((brand, i) => (
                                        <div key={i} className="brand-item">
                                            {brand}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

    );
};

export default SideBarMenu;
