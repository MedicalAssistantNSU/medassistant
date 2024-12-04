// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
  Avatar,
  Box,
  CardMedia,
  Grid,
  styled,
  Typography
} from '@mui/material';
import profilecover from 'src/assets/images/backgrounds/profile.png';
import userimg from 'src/assets/images/profile/1.png';
import useAuth from 'src/guards/authGuard/UseAuth';
import BlankCard from '../../../shared/BlankCard';
import ProfileTab from './ProfileTab';

const ProfileBanner = () => {
  const { user } = useAuth()
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#01C0C8)',
    borderRadius: '50%',
    width: '105px',
    height: '105px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  }));

  return (
    <>
      <BlankCard>
        <CardMedia component="img" image={profilecover} alt={profilecover} height="200px" width="100%" />
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          {/* about profile */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: '1',
                sm: '1',
                lg: '2',
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: '-85px',
              }}
            >
              <Box>
                <ProfileImage>
                  <Avatar
                    src={userimg}
                    alt={userimg}
                    sx={{
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      border: '4px solid #fff',
                    }}
                  />
                </ProfileImage>
                <Box mt={1}>
                  <Typography fontWeight={600} variant="h5">
                  {user ? user.name : "unknown"}
                  </Typography>
                  <Typography color="textSecondary" variant="h6" fontWeight={400}>
                    {user ? user.username : "unknown"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <ProfileTab />
      </BlankCard>
    </>
  );
};

export default ProfileBanner;
