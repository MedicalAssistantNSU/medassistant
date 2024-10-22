import { Box, Grid, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';


const AboutUs = () => {
  return (
      <PageContainer title="О нас">
          {/* breadcrumb */}
          <Box mt={2} />
          {/* end breadcrumb */}
          <Grid container spacing={4}>
              <Grid item xs={4}>
                  <DashboardCard title="Недавние сканирования">
                      <Typography>...</Typography>
                  </DashboardCard>
              </Grid>
              <Grid item xs={4}>
                  <DashboardCard title="Недавние сканирования">
                      <Typography>...</Typography>
                  </DashboardCard>
              </Grid>
              <Grid item xs={4}>
                  <DashboardCard title="Недавние сканирования">
                      <Typography>...</Typography>
                  </DashboardCard>
              </Grid>
          </Grid>
      </PageContainer>
  );
};

export default AboutUs;
