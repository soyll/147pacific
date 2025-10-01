import React from 'react';
import { BlockSection, type BlockSectionText } from '@/components/features/block_section';

const disclaimerText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Disclaimer'
  },
  {
    type: 'paragraph',
    content: 'Limitations of our liability for the use of the website'
  },
  {
    type: 'paragraph',
    content: 'Last updated July 19, 2025'
  }
];

const disclaimerDetailsText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Website disclaimer'
  },
  {
    type: 'paragraph',
    content: 'The information provided by Accurate Machinery, Inc. ("we," "us," or "our" on giuliano-usa.com) is for general informational purposes only. All information on is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site your use of the site and your reliance on any information on the site is solely at your own risk.'
  },
  {
    type: 'title',
    content: 'External links disclaimer'
  },
  {
    type: 'paragraph',
    content: 'The Site may contain or you may be sent through to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.'
  },
  {
    type: 'title',
    content: 'Affiliates disclaimer'
  },
  {
    type: 'paragraph',
    content: 'The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links.'
  }
];

export const DisclaimerPage: React.FC = React.memo(() => {
  return (
    <main className="content" style={{ marginTop: '100px' }}>
      <div className="content__wrapper">
        <BlockSection
          direction="rtl"
          images={[]}
          caption="Disclaimer"
          text={disclaimerText}
          secondText={disclaimerDetailsText}
          useTextVariation={true}
          showArrow={false}
        />
      </div>
    </main>
  );
});

DisclaimerPage.displayName = 'DisclaimerPage';
