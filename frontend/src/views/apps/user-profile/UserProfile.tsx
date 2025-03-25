// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Box, ButtonBase, Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

import ProfileBanner from 'src/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from 'src/components/apps/userprofile/profile/IntroCard';
import PhotosCard from 'src/components/apps/userprofile/profile/PhotosCard';
import axios from 'axios';
import { useNavigate } from 'react-router';
import useAuth from 'src/guards/authGuard/UseAuth';

const UserProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const onClick = () => {
    axios.delete('/account/my-account');
    handleLogout()
  }

  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProfileBanner />
        </Grid>

        {/* intro and Photos Card */}
        <Grid item xs={12} container spacing={3}>
            <Grid item sm={6}>
              <IntroCard />
            </Grid>
            <Grid item sm={6}>
              <PhotosCard />
            </Grid>
          
        </Grid>
      </Grid>

      <ButtonBase onClick={onClick}>Удалить профиль</ButtonBase>

      </Box>
    </PageContainer>
  );
};

export default UserProfile;
