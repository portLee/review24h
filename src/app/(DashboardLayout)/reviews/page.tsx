'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import ProductPerformance from '../components/dashboard/ProductPerformance';


const ReviewPage = () => {
  return (
    <PageContainer title="Review Page" description="this is Review page">
      <ProductPerformance />
    </PageContainer>
  );
};

export default ReviewPage;

