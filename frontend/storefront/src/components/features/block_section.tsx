import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export interface BlockSectionImage {
  src: string;
  alt: string;
}

export interface BlockSectionText {
  type: 'title' | 'paragraph';
  content: string;
  isAccent?: boolean;
}

export interface BlockSectionProps {
  direction: 'ltr' | 'rtl';
  images: BlockSectionImage[];
  caption: string;
  text: BlockSectionText[];
  showArrow?: boolean;
  arrowText?: string;
  secondText?: BlockSectionText[];
  useTextVariation?: boolean;
}

export const BlockSection: React.FC<BlockSectionProps> = React.memo(({
  direction,
  images,
  caption,
  text,
  showArrow = false,
  arrowText = 'More',
  secondText,
  useTextVariation = false
}) => {
  const isRtl = direction === 'rtl';
  
  const renderText = (textItem: BlockSectionText, index: number) => {
    if (textItem.type === 'title') {
      const parts = textItem.content.split(/(\s+)/);
      const titleParts = parts.map((part, partIndex) => {
        if (part.trim() === 'own production' || part.trim() === 'All products' || part.trim() === 'in the USA') {
          return (
            <span key={partIndex} className="title title--accent">
              {part}
            </span>
          );
        }
        return part;
      });

      return (
        <h2 key={index} className="title title--base">
          {titleParts}
        </h2>
      );
    }
    
    return (
      <p key={index} className="text text--opacity">
        {textItem.content}
      </p>
    );
  };

  return (
    <section className="section">
      <div className="section__wrapper">
        <div className="container">
          <div className="block">
            <div className="block__wrapper">
              <div className="block__grid">
                {/* Second Block - either images or text */}
                {useTextVariation ? (
                  // Text variation without gradient
                  <div className="block-content" style={{ order: isRtl ? 2 : 1 }}>
                    <div className="block-content__wrapper">
                      <div className="block-content__box">
                        <div className="block-content__text">
                          {secondText?.map((textItem, index) => renderText(textItem, index))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Image Block - only show if images exist
                  images.length > 0 && (
                    <div className="block-img" style={{ order: isRtl ? 2 : 1 }}>
                      <div className="block-img__wrapper">
                        <p className="block__tag">{caption}</p>
                      </div>
                      <Swiper
                        className="swiper block-slider"
                        modules={[Navigation, Pagination, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        navigation={{
                          nextEl: '.block-slider__button--prev',
                          prevEl: '.block-slider__button--next',
                        }}
                        pagination={{
                          el: '.block-slider__pagination',
                          clickable: true,
                          renderBullet: (_, className) => {
                            return `<span class="${className} block-slider__bullet"></span>`;
                          }
                        }}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                      >
                        {images.map((image, index) => (
                          <SwiperSlide key={index} className="block-slider__item">
                            <img src={image.src} alt={image.alt} />
                          </SwiperSlide>
                        ))}

                        <div className={`block-slider__nav ${isRtl ? 'block-slider__nav--left' : ''}`}>
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
                      </Swiper>
                    </div>
                  )
                )}

                {/* Content Block */}
                <div className={`block-content ${useTextVariation ? 'block-content--gradient' : ''}`} style={{ 
                  order: isRtl ? 1 : 2,
                  ...(images.length === 0 && !useTextVariation && { gridColumn: '1/-1' })
                }}>
                  <div className="block-content__wrapper">
                    <div className="block-content__box">
                      <div className="block-content__text">
                        {text.map((textItem, index) => renderText(textItem, index))}
                      </div>
                      {showArrow && (
                        <div className="block-content__footer">
                          <a href="#" className="button button--text">
                            <span className="button__text">{arrowText}</span>
                            <svg className="button__icon">
                              <use xlinkHref="/assets/images/sprite.svg#arrow-right"></use>
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

BlockSection.displayName = 'BlockSection';

