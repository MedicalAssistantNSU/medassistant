// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Box, Typography } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const BCrumb = [
  {
    to: '/',
    title: 'Д',
  },
  {
    title: 'Sample Page',
  },
];

const SamplePage = () => {
  return (
    <PageContainer title="Домашняя страница">
      {/* breadcrumb */}
      <Box mt={2} />
      {/* end breadcrumb */}
      <DashboardCard title="Актуальные новости">
        <Typography>...</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
