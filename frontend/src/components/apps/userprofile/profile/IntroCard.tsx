import { Backdrop, Box, Button, Fade, Modal, Stack, Typography } from '@mui/material';

import { IconAccessible, IconBriefcase, IconUpload } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import ChildCard from 'src/components/shared/ChildCard';
import { fetchProfile } from 'src/store/apps/profile/ProfileSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import UpdateProfile from './UpdateProfile';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '500',
  bgcolor: 'background.paper',
  //overflowY: 'auto',
  boxShadow: 24,
  p: 4,
};

const IntroCard  = () => {
    const dispatch = useDispatch();
    
    const [updateProfile, setUpdateProfile] = useState(false);
  
    useEffect(() => {
      dispatch(fetchProfile());
    }, [dispatch]);
  
    const profile = useSelector((state) => state.profileReducer.profile);
    console.log(profile)

    return (
  <ChildCard>
    <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={updateProfile}
                    onClose={() => setUpdateProfile(false)}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                >
                    <Fade in={updateProfile}>
                        <Box sx={style}>
                          <UpdateProfile profile={profile} setUpdateProfile={setUpdateProfile} />
                        </Box>
                    </Fade>
              </Modal>
    <Typography fontWeight={600} variant="h4" mb={2}>
      Основная информация
    </Typography>
    <Typography color="textSecondary" variant="subtitle2" mb={2}>
      Здесь будет собрана информация, на основе которой будут состовляться рекомендации.
    </Typography>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconBriefcase size="21" />
      <Typography variant="h6">Профессия: </Typography>
       <Typography variant="h6">{profile.profession ? profile.profession : "-"}</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconAccessible size="21" />
      <Typography variant="h6">Пол:</Typography>
      <Typography variant="h6">{profile.gender ? profile.gender : "-"}</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconAccessible size="21" />
      <Typography variant="h6">Возраст: </Typography>
      <Typography variant="h6">{profile.age ? profile.age : "-"}</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconAccessible size="21" />
      <Typography variant="h6">Вес: </Typography>
      <Typography variant="h6">{profile.weight ? profile.weight : "-"}</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={1}>
      <IconAccessible size="21" />
      <Typography variant="h6">Рост: </Typography>
      <Typography variant="h6">{profile.height ? profile.height : "-"}</Typography>
    </Stack>

    <Button onClick={() => setUpdateProfile(true)}>
                <IconUpload />
    </Button>
  </ChildCard>
  );
};

export default IntroCard;
