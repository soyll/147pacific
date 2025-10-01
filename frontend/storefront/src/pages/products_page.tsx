import React from 'react';
import { BlockSection, BlockSectionImage, BlockSectionText } from '@/components/features/block_section';

const ProductsPage: React.FC = () => {
  const blockSections = [
    {
      id: 1,
      direction: 'ltr' as const,
      caption: "Bed Rack",
      images: [
        { src: "/assets/images/slider/1.webp", alt: "Bed Rack 1" },
        { src: "/assets/images/slider/2.webp", alt: "Bed Rack 2" }
      ] as BlockSectionImage[],
      text: [
        { type: 'title' as const, content: "Bed Rack" },
        { type: 'paragraph' as const, content: "Pick-up truck roll cage built from 2.375\" round stainless steel tubing with stainless sheet connections and anodized aluminum inserts. Designed for durability and style, with numerous customization options available. Pick-up truck bed racks built with 2.375\" round stainless steel tubing with stainless sheet connections. Pick-up truck bed racks built with 2.375\" round stainless steel tubing with stainless sheet connections" },
        { type: 'paragraph' as const, content: "One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body." },
        { type: 'paragraph' as const, content: "An element or group of elements that can be installed on or using one of the main products. In the photo below, a Bed Rack with an option is a set of 4 screens." },
        { type: 'paragraph' as const, content: "A website for online sales and advertising of self-made products. Automotive-themed accessories made of metal, mostly stainless steel pipes, are typically used to protect specific parts of cars during transportation or outdoor adventures (overlanding)." },
        { type: 'paragraph' as const, content: "One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body." }
      ] as BlockSectionText[],
      showArrow: true,
      arrowText: "More"
    },
    {
      id: 2,
      direction: 'rtl' as const,
      caption: "Bull Bar",
      images: [
        { src: "/assets/images/slider/1.webp", alt: "Bull Bar 1" },
        { src: "/assets/images/slider/2.webp", alt: "Bull Bar 2" }
      ] as BlockSectionImage[],
      text: [
        { type: 'title' as const, content: "Bull Bar" },
        { type: 'paragraph' as const, content: "Protective front bar made from 2.375\" round stainless steel tubing with stainless sheet reinforcements. Designed for pickups and SUVs to enhance front-end protection and rugged appearance. Protective front bar made from 2.375\" round stainless steel tubing with stainless sheet reinforcements. Protective front bar made from 2.375\" round stainless steel tubing with stainless sheet reinforcements." },
        { type: 'paragraph' as const, content: "One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body." },
        { type: 'paragraph' as const, content: "An element or group of elements that can be installed on or using one of the main products. In the photo below, a Bed Rack with an option is a set of 4 screens." },
        { type: 'paragraph' as const, content: "A website for online sales and advertising of self-made products. Automotive-themed accessories made of metal, mostly stainless steel pipes, are typically used to protect specific parts of cars during transportation or outdoor adventures (overlanding)." },
        { type: 'paragraph' as const, content: "One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body." }
      ] as BlockSectionText[],
      showArrow: true,
      arrowText: "More"
    },
    {
      id: 3,
      direction: 'ltr' as const,
      caption: "Running Board",
      images: [
        { src: "/assets/images/slider/1.webp", alt: "Running Board 1" },
        { src: "/assets/images/slider/2.webp", alt: "Running Board 2" }
      ] as BlockSectionImage[],
      text: [
        { type: 'title' as const, content: "Running Board" },
        { type: 'paragraph' as const, content: "Designed to provide easy access to your vehicle while enhancing its rugged appearance. Made from high-strength stainless steel with durable construction for long-lasting performance." },
        { type: 'paragraph' as const, content: "One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body." },
        { type: 'paragraph' as const, content: "An element or group of elements that can be installed on or using one of the main products. In the photo below, a Bed Rack with an option is a set of 4 screens." },
        { type: 'paragraph' as const, content: "A website for online sales and advertising of self-made products. Automotive-themed accessories made of metal, mostly stainless steel pipes, are typically used to protect specific parts of cars during transportation or outdoor adventures (overlanding)." },
        { type: 'paragraph' as const, content: "One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body." }
      ] as BlockSectionText[],
      showArrow: true,
      arrowText: "More"
    },
    {
      id: 4,
      direction: 'rtl' as const,
      caption: "HD Grille Guard",
      images: [
        { src: "/assets/images/slider/1.webp", alt: "HD Grille Guard 1" },
        { src: "/assets/images/slider/2.webp", alt: "HD Grille Guard 2" }
      ] as BlockSectionImage[],
      text: [
        { type: 'title' as const, content: "HD Grille Guard" },
        { type: 'paragraph' as const, content: "Heavy-duty front-end protection for semi-trucks, built from high-strength stainless steel 2.375\" or 2.875\" tubing. Provides maximum protection while maintaining vehicle aesthetics." },
        { type: 'paragraph' as const, content: "One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body." },
        { type: 'paragraph' as const, content: "An element or group of elements that can be installed on or using one of the main products. In the photo below, a Bed Rack with an option is a set of 4 screens." },
        { type: 'paragraph' as const, content: "A website for online sales and advertising of self-made products. Automotive-themed accessories made of metal, mostly stainless steel pipes, are typically used to protect specific parts of cars during transportation or outdoor adventures (overlanding)." },
        { type: 'paragraph' as const, content: "One of the elements described in the paragraph above. New ones may be added in the future. The picture below shows a Bed Rack mounted on a pickup truck body." }
      ] as BlockSectionText[],
      showArrow: true,
      arrowText: "More"
    }
  ];

  return (
    <main className="content">
      <div className="content__wrapper">
        {blockSections.map((section) => (
          <BlockSection
            key={section.id}
            direction={section.direction}
            images={section.images}
            caption={section.caption}
            text={section.text}
            showArrow={section.showArrow}
            arrowText={section.arrowText}
          />
        ))}
                  </div>
    </main>
  );
};

export default ProductsPage;