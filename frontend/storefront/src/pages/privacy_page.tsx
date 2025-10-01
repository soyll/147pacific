import React from 'react';
import { BlockSection, type BlockSectionText } from '@/components/features/block_section';

const privacyText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Privacy'
  },
  {
    type: 'paragraph',
    content: 'How and why we might collect, store, use, and/or share your information.'
  },
  {
    type: 'paragraph',
    content: 'This privacy notice for Accurate Machinery, Inc. Company we, us, or our, describes how and why we might collect, store, use, and/or share your information when you use our services. Services, such as when you: Visit our website https:// or any website of ours that links to this privacy notice. Engage with us in other related ways, including any sales, marketing, or events. Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at accu@accumachinery.com.'
  },
  {
    type: 'paragraph',
    content: 'Last updated July 19, 2025'
  }
];

const privacyNoticeText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Privacy notice'
  },
  {
    type: 'paragraph',
    content: 'This privacy notice for Accurate Machinery, Inc. Company we, us, or our, describes how and why we might collect, store, use, and/or share your information when you use our services. Services, such as when you: Visit our website https:// or any website of ours that links to this privacy notice. Engage with us in other related ways, including any sales, marketing, or events. Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at accu@accumachinery.com.'
  }
];

const summaryText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Summary of key points'
  },
  {
    type: 'paragraph',
    content: 'This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for. What personal information do we process? When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Accu Machinery, Inc. and the Services, the choices you make, and the products and features you use.'
  },
  {
    type: 'paragraph',
    content: 'Do we process any sensitive personal information? We do not process sensitive personal information. Do we receive any information from third parties? We may receive information from public databases, marketing partners, social media platforms, and other outside sources.'
  },
  {
    type: 'paragraph',
    content: 'How do we process your information? We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. We may share information in specific situations and with specific third parties.'
  }
];

const cookiesText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Cookies'
  },
  {
    type: 'paragraph',
    content: 'Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.'
  }
];

const cookiesTechText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Cookies and similar technologies'
  },
  {
    type: 'paragraph',
    content: 'Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.'
  }
];

const doNotTrackText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Controls for do-not-track features'
  },
  {
    type: 'paragraph',
    content: 'Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for and implementing DNT signals has been. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.'
  }
];

const californiaRightsText: BlockSectionText[] = [
  {
    type: 'title',
    content: 'Do california residents have specific privacy rights?'
  },
  {
    type: 'paragraph',
    content: 'Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information. California Civil Code Section 1798.83, also known as the Shine The Light law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.'
  }
];

export const PrivacyPage: React.FC = React.memo(() => {
  return (
    <main className="content" style={{ marginTop: '100px' }}>
      <div className="content__wrapper">
        <BlockSection
          direction="rtl"
          images={[]}
          caption="Privacy"
          text={privacyText}
          secondText={[
            ...privacyNoticeText,
            ...summaryText
          ]}
          useTextVariation={true}
          showArrow={false}
        />

        <BlockSection
          direction="rtl"
          images={[]}
          caption="Cookies"
          text={cookiesText}
          secondText={[
            ...cookiesTechText,
            ...doNotTrackText,
            ...californiaRightsText
          ]}
          useTextVariation={true}
          showArrow={false}
        />
      </div>
    </main>
  );
});

PrivacyPage.displayName = 'PrivacyPage';

