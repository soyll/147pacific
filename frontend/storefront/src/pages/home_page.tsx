import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { HeroSection, type HeroSlide } from '@/components/features/hero_section';
import { BlockSection, type BlockSectionImage, type BlockSectionText } from '@/components/features/block_section';

import 'swiper/css';
import 'swiper/css/navigation';

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/assets/images/hero/main.webp',
    title: 'Bed Rack',
    description: 'for accommodation and transportation of things and equipment'
  },
  {
    id: 2,
    image: '/assets/images/hero/main.webp',
    title: 'Bull Bar',
    description: 'to protect the front of the car'
  },
  {
    id: 3,
    image: '/assets/images/hero/main.webp',
    title: 'Running Board',
    description: 'for the convenience of landing'
  },
  {
    id: 4,
    image: '/assets/images/hero/main.webp',
    title: 'Made in USA',
    description: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials'
  },
  {
    id: 5,
    image: '/assets/images/hero/main.webp',
    title: 'Made in USA',
    description: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials'
  },
  {
    id: 6,
    image: '/assets/images/hero/main.webp',
    title: 'Made in USA',
    description: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials'
  }
];

const aboutUsImages: BlockSectionImage[] = [
  { src: '/assets/images/slider/1.webp', alt: 'About us image 1' },
  { src: '/assets/images/slider/2.webp', alt: 'About us image 2' }
];

const aboutUsText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Our company has its own production of metal car accessories',
    isAccent: false
  },
  {
    type: 'paragraph',
    content: 'One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body.'
  },
  {
    type: 'paragraph',
    content: 'An element or group of elements that can be installed on or using one of the main products. In the photo below, a Bed Rack with an option is a set of 4 screens.'
  },
  {
    type: 'paragraph',
    content: 'A website for online sales and advertising of self-made products. Automotive-themed accessories made of metal, mostly stainless steel pipes, are typically used to protect specific parts of cars during transportation or outdoor adventures (overlanding).'
  },
  {
    type: 'paragraph',
    content: 'One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body.'
  },
  {
    type: 'paragraph',
    content: 'One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body.'
  },
  {
    type: 'paragraph',
    content: 'One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body.'
  },
  {
    type: 'paragraph',
    content: 'One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body.'
  }
];

const madeInUsaImages: BlockSectionImage[] = [
  { src: '/assets/images/slider/3.webp', alt: 'Made in USA image 1' },
  { src: '/assets/images/slider/4.webp', alt: 'Made in USA image 2' }
];

const madeInUsaText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'All products are proudly designed, engineered and manufactured in the USA',
    isAccent: false
  },
  {
    type: 'paragraph',
    content: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions.'
  },
  {
    type: 'paragraph',
    content: 'One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body.'
  },
  {
    type: 'paragraph',
    content: 'An element or group of elements that can be installed on or using one of the main products. In the photo below, a Bed Rack with an option is a set of 4 screens.'
  }
];

const productSliderItems = [
  {
    id: 1,
    image: '/assets/images/slider/3.webp',
    title: 'Bed Rack',
    description: 'Pick-up truck roll cage built from 2.375" round stainless steel tubing with stainless sheet connections and anodized aluminum inserts. Designed for durability and style, with numerous customization options available.'
  },
  {
    id: 2,
    image: '/assets/images/slider/4.webp',
    title: 'Bed Rack',
    description: 'Pick-up truck roll cage built from 2.375" round stainless steel tubing with stainless sheet connections and anodized aluminum inserts. Designed for durability and style, with numerous customization options available.'
  },
  {
    id: 3,
    image: '/assets/images/slider/4.webp',
    title: 'Bed Rack',
    description: 'Pick-up truck roll cage built from 2.375" round stainless steel tubing with stainless sheet connections and anodized aluminum inserts. Designed for durability and style, with numerous customization options available.'
  }
];

export const HomePage: React.FC = React.memo(() => {

  return (
    <main className="content">
      <HeroSection
        slides={heroSlides}
        bannerTitle="All products are proudly manufactured in the USA"
        bannerDescription="All products are proudly designed, engineered, and manufactured in the USA using premium materials."
      />

      <div className="content__wrapper">
        <div className="section">
          <div className="section__wrapper">
            <div className="container">
              <Swiper
                className="single-slider swiper"
                modules={[Navigation]}
                navigation={{
                  nextEl: '.single-slider__button--next',
                  prevEl: '.single-slider__button--prev',
                }}
                loop={true}
                allowTouchMove={false}
                allowSlideNext={true}
                allowSlidePrev={true}
                centeredSlides={false}
                breakpoints={{
                  768: {
                    spaceBetween: 30,
                    centeredSlides: false,
                    slidesPerView: 1.1
                  },
                  320: {
                    spaceBetween: 30,
                    slidesPerView: 1,
                    centeredSlides: true
                  }
                }}
              >
                {productSliderItems.map((item) => (
                  <SwiperSlide key={item.id} className="block swiper-slide single-slider__item">
                    <div className="block__grid">
                      <div className="block-img block-img--full">
                        <div className="block-img__bg">
                          <img src={item.image} alt="" />
                        </div>
                        <div className="block-img__wrapper">
                          <p className="block__tag">Products</p>
                          <div className="block-img__content">
                            <p className="title title--base">
                              {item.title}
                            </p>
                            <p className="text text--opacity text--base">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="single-slider__nav">
                <button className="single-slider__button single-slider__button--prev">
                  <svg className="icon">
                    <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                  </svg>
                </button>
                <button className="single-slider__button single-slider__button--next">
                  <svg className="icon">
                    <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <BlockSection
          direction="ltr"
          images={aboutUsImages}
          caption="About us"
          text={aboutUsText}
          showArrow={true}
          arrowText="More about company"
        />

        <BlockSection
          direction="rtl"
          images={madeInUsaImages}
          caption="Made in USA"
          text={madeInUsaText}
          showArrow={true}
          arrowText="More"
        />
      </div>
    </main>
  );
});

HomePage.displayName = 'HomePage';