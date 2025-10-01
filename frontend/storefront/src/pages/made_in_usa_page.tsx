import React from 'react';
import { HeroSection, type HeroSlide } from '@/components/features/hero_section';
import { BlockSection, type BlockSectionImage, type BlockSectionText } from '@/components/features/block_section';

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/assets/images/hero/main.webp',
    title: 'Made in USA',
    description: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials'
  },
  {
    id: 2,
    image: '/assets/images/hero/main.webp',
    title: 'Quality Standards',
    description: 'Built to meet the highest standards of durability and performance'
  },
  {
    id: 3,
    image: '/assets/images/hero/main.webp',
    title: 'American Excellence',
    description: 'Crafted with precision and attention to detail in American facilities'
  },
  {
    id: 4,
    image: '/assets/images/hero/main.webp',
    title: 'Premium Materials',
    description: 'Using only the finest materials sourced domestically'
  }
];

const madeInUsaText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Made in USA'
  },
  {
    type: 'paragraph',
    content: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions.'
  }
];

const proudlyManufacturedText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'All products are proudly manufactured in the USA'
  },
  {
    type: 'paragraph',
    content: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions.'
  },
  {
    type: 'paragraph',
    content: 'Family owned and operated in Georgetown, Texas, the company is dedicated to American craftsmanship and customer-focused service. We take pride in building premium products with integrity, precision, and attention to detail.'
  }
];

const highestStandardsImages: BlockSectionImage[] = [
  { src: '/assets/images/slider/1.webp', alt: 'Truck with bed rack and rooftop tent' },
  { src: '/assets/images/slider/2.webp', alt: 'Off-road truck accessories' },
  { src: '/assets/images/slider/3.webp', alt: 'Quality truck modifications' },
  { src: '/assets/images/slider/4.webp', alt: 'Premium truck equipment' }
];

const highestStandardsText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Built to meet the highest standards of durability and performance'
  },
  {
    type: 'paragraph',
    content: 'The rise of rugged and versatile storage solutions for pickup trucks opens up opportunities for innovation in the automobile accessories industry.'
  },
  {
    type: 'paragraph',
    content: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions.'
  }
];

const finalMadeInUsaText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Made in USA'
  },
  {
    type: 'paragraph',
    content: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions.'
  }
];

const finalAlternativeText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'All products are proudly manufactured in the USA'
  },
  {
    type: 'paragraph',
    content: 'All products are proudly designed, engineered, and manufactured in the USA using premium materials. Built to meet the highest standards of quality, durability, and performance for real-world American conditions.'
  },
  {
    type: 'paragraph',
    content: 'Family owned and operated in Georgetown, Texas, the company is dedicated to American craftsmanship and customer-focused service. We take pride in building premium products with integrity, precision, and attention to detail.'
  }
];

export const MadeInUSAPage: React.FC = React.memo(() => {
  return (
    <main className="content">
      <HeroSection
        slides={heroSlides}
      />

      <div className="content__wrapper">
        <BlockSection
          direction="ltr"
          images={[]}
          caption="Made in USA"
          text={madeInUsaText}
          secondText={proudlyManufacturedText}
          useTextVariation={true}
          showArrow={false}
        />

        <BlockSection
          direction="ltr"
          images={highestStandardsImages}
          caption="Built to meet standards"
          text={highestStandardsText}
          showArrow={false}
        />

        {/* Third section - Two columns: Made in USA + All products proudly manufactured */}
        <BlockSection
          direction="rtl"
          images={[]}
          caption="Made in USA"
          text={finalMadeInUsaText}
          secondText={finalAlternativeText}
          useTextVariation={true}
          showArrow={false}
        />
      </div>
    </main>
  );
});
