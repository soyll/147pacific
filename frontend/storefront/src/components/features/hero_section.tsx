import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface HeroSectionProps {
  slides: HeroSlide[];
  bannerTitle?: string;
  bannerDescription?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({
  slides,
  bannerTitle,
  bannerDescription
}) => {
  const [heroNavSwiper, setHeroNavSwiper] = useState<SwiperType | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  return (
    <div className="hero">
      <div className="hero-gradient-top"></div>
      <div className="hero__wrapper">
        <Swiper
          modules={[Thumbs]}
          className="swiper hero-slider"
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          thumbs={{ swiper: heroNavSwiper && !heroNavSwiper.destroyed ? heroNavSwiper : null }}
          onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="hero-item">
              <div className="hero-item__img">
                <img src={slide.image} alt={slide.title} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hero-main">
          <div className="container">
            <div className="hero-main__wrapper">
              {(bannerTitle || bannerDescription) && (
                <div className="hero-content">
                  {bannerTitle && (
                    <p className="title--big">
                      {bannerTitle}
                    </p>
                  )}
                  {bannerDescription && (
                    <p className="text text--base">
                      {bannerDescription}
                    </p>
                  )}
                </div>
              )}

              <div className="hero-nav">
                <Swiper
                  modules={[FreeMode]}
                  className="swiper hero-nav__slider"
                  onSwiper={setHeroNavSwiper}
                  spaceBetween={16}
                  slidesPerView="auto"
                  freeMode={true}
                  watchSlidesProgress={true}
                  breakpoints={{
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 50
                    },
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 16
                    }
                  }}
                >
                  {slides.map((slide, _) => (
                    <SwiperSlide key={slide.id} className="hero-nav__item">
                      <p className="hero-nav__title">
                        {slide.title}
                      </p>
                      <p className="text text--base hero-nav__text">
                        {slide.description}
                      </p>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="hero-nav__indicator-container">
                  <div 
                    className="hero-nav__indicator"
                    style={{
                      transform: `translateX(${activeSlideIndex * 100}%)`,
                      width: `${100 / slides.length}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-gradient-bottom"></div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';