// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';


const ScanHistoryPage = () => {
  return (
      <PageContainer title="История сканирований">
          {/* breadcrumb */}
          <Box mt={2} />
          {/* end breadcrumb */}
          <DashboardCard title="Недавние сканирования">
              <Typography>...</Typography>
          </DashboardCard>
      </PageContainer>
  );
};

export default ScanHistoryPage;
