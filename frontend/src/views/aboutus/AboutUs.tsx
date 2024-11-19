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
          <Box >
          <Grid container justifyContent={"center"}>
              <Box display={"flex"} m={1}>
                  <DashboardCard>
                    <>
                        <img src={img1} alt="attach" width="200px" />
                        <Typography fontWeight={600} mt={2} fontSize={20} textAlign={"center"}>Яковлева Валерия</Typography>
                    </>
                  </DashboardCard>
              </Box>
              <Box display={"flex"} m={1}>
                  <DashboardCard>
                    <>
                        <img src={img2} alt="attach" width="200px" />
                        <Typography fontWeight={600} mt={2} fontSize={20} textAlign={"center"}>Петров Владимир</Typography>
                    </>
                  </DashboardCard>
                  </Box>
              <Box display={"flex"} m={1}>
                  <DashboardCard>
                    <>
                        <img src={img3} alt="attach" width="200px"/>
                      <Typography fontWeight={600} mt={2} fontSize={20} textAlign={"center"}>Котенков Максим</Typography>
                      </>
                  </DashboardCard>
                </Box>
          </Grid>
          </Box>
      </PageContainer>
  );
};

export default AboutUs;
