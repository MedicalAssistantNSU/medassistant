import { Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const Help = () => {
  return (
      <PageContainer title="Поддержка">
          <Box mt={2} />
          <DashboardCard title="Связаться">
              <Typography>...</Typography>
          </DashboardCard>
      </PageContainer>
  );
};

export default Help;
