// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

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
