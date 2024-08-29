'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import ProductPerformance from '../components/dashboard/ProductPerformance';


const ReviewPage = () => {
  return (
    <PageContainer title="Review Page" description="this is Review page">
      <ProductPerformance />
    </PageContainer>
  );
};

export default ReviewPage;

