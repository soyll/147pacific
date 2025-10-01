import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Scrollbar } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';

const heroSlides = [
  { id: 1, image: '/assets/images/hero/main.webp' },
  { id: 2, image: '/assets/images/hero/main.webp' },
  { id: 3, image: '/assets/images/hero/main.webp' },
  { id: 4, image: '/assets/images/hero/main.webp' },
  { id: 5, image: '/assets/images/hero/main.webp' },
  { id: 6, image: '/assets/images/hero/main.webp' }
];

const heroNavItems = [
  {
    id: 1,
    title: 'About us',
    description: 'All products are proudly designed, engineered, and manufactured in the USA'
  },
  {
    id: 2,
    title: 'Our company',
    description: 'All products are proudly designed, engineered, and manufactured in the USA'
  },
  {
    id: 3,
    title: 'Running Board',
    description: 'for the convenience of landing'
  },
  {
    id: 4,
    title: 'Made in USA',
    description: 'for the convenience of landing'
  },
  {
    id: 5,
    title: 'Made in USA',
    description: 'for the convenience of landing'
  },
  {
    id: 6,
    title: 'Made in USA',
    description: 'for the convenience of landing'
  }
];

export const CompanyPage: React.FC = React.memo(() => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <main className="content">
      <div className="content__wrapper">
        <div className="hero">
          <div className="hero__wrapper">
            <Swiper
              className="swiper hero-slider"
              modules={[Thumbs]}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
            >
              {heroSlides.map((slide) => (
                <SwiperSlide key={slide.id} className="hero-item">
                  <div className="hero-item__img">
                    <img src={slide.image} alt="" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="hero-main">
              <div className="container">
                <div className="hero-main__wrapper">
                  <div className="hero-nav">
                    <Swiper
                      className="hero-nav__slider swiper"
                      modules={[FreeMode, Scrollbar, Navigation]}
                      onSwiper={setThumbsSwiper}
                      freeMode={true}
                      watchSlidesProgress={true}
                      slidesPerView="auto"
                      spaceBetween={20}
                      navigation={{
                        nextEl: '.hero-nav__button--next',
                        prevEl: '.hero-nav__button--prev',
                      }}
                      scrollbar={{
                        el: '.hero-nav__scrollbar',
                        draggable: true,
                      }}
                    >
                      <button className="hero-nav__button hero-nav__button--next">
                        <svg className="icon">
                          <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                        </svg>
                      </button>
                      <div className="hero-nav__scrollbar"></div>
                      {heroNavItems.map((item) => (
                        <SwiperSlide key={item.id} className="hero-nav__item">
                          <p className="hero-nav__title">
                            {item.title}
                          </p>
                          <p className="text text--base hero-nav__text">
                            {item.description}
                          </p>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <section className="section">
          <div className="section__wrapper">
            <div className="container">
              <div className="block">
                <div className="block__wrapper">
                  <div className="block__grid">
                    <div className="block-content block-content--gradient">
                      <div className="block-content__wrapper">
                        <div className="block-content__box">
                          <div className="block-content__text">
                            <h2 className="title title--base">
                              About us
                            </h2>
                            <p className="text text--opacity">
                              All products are proudly designed, engineered, and manufactured
                              in the USA using premium materials. Built to meet the highest
                              standards of quality, durability, and performance for real-world
                              American conditions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block-content">
                      <div className="block-content__wrapper">
                        <div className="block-content__box">
                          <div className="block-content__text">
                            <h2 className="title title--base">
                              All products are proudly manufactured in the USA
                            </h2>
                            <p className="text text--opacity">
                              All products are proudly designed, engineered, and manufactured
                              in the USA using premium materials. Built to meet the highest
                              standards of quality, durability, and performance for real-world
                              American conditions.
                            </p>
                            <p className="text text--opacity">
                              Family-owned and operated in Georgetown, Texas, the company is
                              dedicated to American craftsmanship and customer-focused
                              service. We take pride in building premium products with
                              integrity, precision, and attention to detail.
                            </p>
                            <p className="text text--opacity">
                              This summary provides key points from our privacy notice, but
                              you can find out more details about any of these topics by
                              clicking the link following each key point or by using our table
                              of contents below to find the section you are looking for. What
                              personal information do we process? When you visit, use, or
                              navigate our Services, we may process personal information
                              depending on how you interact with Accu Machinery, Inc. and the
                              Services, the choices you make, and the products and features
                              you use.
                            </p>
                            <p className="text text--opacity">
                              Do we process any sensitive personal information? We do not
                              process sensitive personal information. Do we receive any
                              information from third parties? We may receive information from
                              public databases, marketing partners, social media platforms,
                              and other outside sources.
                            </p>
                            <p className="text text--opacity">
                              How do we process your information? We process your information
                              to provide, improve, and administer our Services, communicate
                              with you, for security and fraud prevention, and to comply with
                              law. We may also process your information for other purposes
                              with your consent. We process your information only when we have
                              a valid legal reason to do so. We may share information in
                              specific situations and with specific third parties.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="section__wrapper">
            <div className="container">
              <div className="block">
                <div className="block__wrapper">
                  <div className="block__grid">
                    <div className="block-img">
                      <Swiper
                        className="swiper block-slider"
                        modules={[Navigation]}
                        navigation={{
                          nextEl: '.block-slider__button--next',
                          prevEl: '.block-slider__button--prev',
                        }}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                      >
                        <SwiperSlide className="block-slider__item">
                          <img src="/assets/images/slider/1.webp" alt="" />
                        </SwiperSlide>
                        <SwiperSlide className="block-slider__item">
                          <img src="/assets/images/slider/2.webp" alt="" />
                        </SwiperSlide>
                      </Swiper>
                      
                      <div className="block-slider__nav">
                        <button className="block-slider__button block-slider__button--next">
                          <svg className="icon">
                            <use xlinkHref="/assets/images/sprite.svg#top-chevron"></use>
                          </svg>
                        </button>
                        <div className="block-slider__pagination"></div>
                        <button className="block-slider__button block-slider__button--prev">
                          <svg className="icon">
                            <use xlinkHref="/assets/images/sprite.svg#top-chevron"></use>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="block-content">
                      <div className="block-content__wrapper">
                        <div className="block-content__box">
                          <div className="block-content__text">
                            <h2 className="title title--base">
                              Built to meet the highest standards of durability and
                              performance
                            </h2>
                            <p className="text text--opacity">
                              The rise of rugged and versatile storage solutions for pickup
                              trucks opens up opportunities for innovation in the automobile
                              accessories industry.
                            </p>
                            <p className="text text--opacity">
                              All products are proudly designed, engineered, and manufactured
                              in the USA using premium materials. Built to meet the highest
                              standards of quality, durability, and performance for real-world
                              American conditions.
                            </p>
                            <p className="text text--opacity">
                              The rise of rugged and versatile storage solutions for pickup
                              trucks opens up opportunities for innovation in the automobile
                              accessories industry.
                            </p>
                            <p className="text text--opacity">
                              The rise of rugged and versatile storage solutions for pickup
                              trucks opens up opportunities for innovation in the automobile
                              accessories industry.
                            </p>
                            <p className="text text--opacity">
                              All products are proudly designed, engineered, and manufactured
                              in the USA using premium materials. Built to meet the highest
                              standards of quality, durability, and performance for real-world
                              American conditions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="section__wrapper">
            <div className="container">
              <div className="block">
                <div className="block__wrapper">
                  <div className="block__grid">
                    <div className="block-content block-content--gradient">
                      <div className="block-content__wrapper">
                        <div className="block-content__box">
                          <div className="block-content__text">
                            <h2 className="title title--base">
                              Our company
                            </h2>
                            <p className="text text--opacity">
                              All products are proudly designed, engineered, and manufactured
                              in the USA using premium materials. Built to meet the highest
                              standards of quality, durability, and performance for real-world
                              American conditions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block-content">
                      <div className="block-content__wrapper">
                        <div className="block-content__box">
                          <div className="block-content__text">
                            <h2 className="title title--base">
                              All products are proudly manufactured in the USA
                            </h2>
                            <p className="text text--opacity">
                              Pick-up truck roll cage built from 2.375" round stainless steel
                              tubing with stainless sheet connections and anodized aluminum
                              inserts. Designed for durability and style, with numerous
                              customization options available. Pick-up truck bed racks built
                              with 2.375" round stainless steel tubing with stainless sheet
                              connections. Pick-up truck bed racks built with 2.375" round
                              stainless steel tubing with stainless sheet connections
                            </p>
                            <p className="text text--opacity">
                              One of the elements described in the paragraph above. New ones
                              may be added in the future. The picture below shows a Bed Rack
                              mounted on a pickup truck body.
                            </p>
                            <p className="text text--opacity">
                              An element or group of elements that can be installed on or
                              using one of the main products. In the photo below, a Bed Rack
                              with an option is a set of 4 screens.
                            </p>
                            <p className="text text--opacity">
                              A website for online sales and advertising of self-made
                              products. Automotive-themed accessories made of metal, mostly
                              stainless steel pipes, are typically used to protect specific
                              parts of cars during transportation or outdoor adventures
                              (overlanding).
                            </p>
                            <p className="text text--opacity">
                              One of the elements described in the paragraph above. New ones
                              may be added in the future. The picture below shows a Bed Rack
                              mounted on a pickup truck body.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
});

CompanyPage.displayName = 'CompanyPage';