import { Box, Grid, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import img1 from '../../assets/images/developers/Lera.jpg'
import img2 from '../../assets/images/developers/Vova.png'
import img3 from '../../assets/images/developers/Max.jpg'


const AboutUs = () => {
  return (
      <PageContainer title="О нас">
          {/* breadcrumb */}
          <Box mt={2} />
          {/* end breadcrumb */}
          <Grid container spacing={4}>
              <Grid item xs={4}>
                  <DashboardCard>
                        <>
                        <img src={img1} alt="attach" width="100%" />
                        <Typography fontWeight={600} mt={2} fontSize={20} textAlign={"center"}>Яковлева Валерия</Typography>
                      </>
                  </DashboardCard>
              </Grid>
              <Grid item xs={4}>
                  <DashboardCard>
                  <>
                        <img src={img2} alt="attach" width="100%" />
                        <Typography fontWeight={600} mt={2} fontSize={20} textAlign={"center"}>Петров Владимир</Typography>
                      </>
                  </DashboardCard>
              </Grid>
              <Grid item xs={4}>
                  <DashboardCard>
                  <>
                        <img src={img3} alt="attach" width="100%" />
                      <Typography fontWeight={600} mt={2} fontSize={20} textAlign={"center"}>Котенков Максим</Typography>
                      </>
                  </DashboardCard>
              </Grid>
          </Grid>
      </PageContainer>
  );
};

export default AboutUs;
