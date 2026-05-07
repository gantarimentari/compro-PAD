'use client';

import SectionWrapper from '@/components/layouts/SectionWrapper';
import NotificationHistoryClient from './NotificationHistoryClient';

export default function NotificationHistoryPageClient({ activeFilter = 'all' }) {
  return (
    <>
      <section>
        <SectionWrapper bgImage="/Background/bg-bone-orange.svg">
          <NotificationHistoryClient activeFilter={activeFilter} />
        </SectionWrapper>
      </section>
    </>
  );
}