import {
  Box,
  Stack,
  Grid,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  CardMedia,
  Skeleton
} from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useEffect } from 'react';
import BlankCard from 'src/components/shared/BlankCard';
import { useSelector, useDispatch } from 'src/store/Store';
import { IconDotsVertical, IconSearch } from '@tabler/icons-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { fetchScans } from 'src/store/apps/chat/ChatSlice';
import { MessageType } from 'src/types/apps/chat';

const GalleryCard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchScans());
  }, [dispatch]);


  const [search, setSearch] = React.useState('');
  const getPhotos : MessageType[]  = useSelector((state) => state.chatReducer.scans);

  // skeleton
  const [isLoading, setLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item sm={12} lg={12}>
          <Stack direction="row" alignItems={'center'} mt={2}>
            <Box>
              <Typography variant="h3">
                Галерея &nbsp;
                <Chip label={getPhotos ? getPhotos.length : 0} color="primary" size="small" />
              </Typography>
            </Box>
            <Box ml="auto">
              <TextField
                id="outlined-search"
                placeholder="Поиск по галереи"
                size="small"
                type="search"
                variant="outlined"
                inputProps={{ 'aria-label': 'Поиск по галереи' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="14" />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </Stack>
        </Grid>
        {getPhotos ? getPhotos.map((photo) => {
          return (
            <Grid item xs={12} lg={4} key={photo.id}>
              <BlankCard className="hoverCard">
                {isLoading ? (
                  <>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="100%"
                      height={220}
                    ></Skeleton>
                  </>
                ) : (
                  <CardMedia component={'img'} height="220" alt="Remy Sharp" src={photo.content} />
                )}
                <Box p={3}>
                  <Stack direction="row" gap={1}>
                    <Box>
                      <Typography variant="h6">{photo.content.split("/").pop()}</Typography>
                      <Typography variant="caption">
                        {photo.createdAt ? (
                                <Typography variant="body2" color="black" mb={1}>
                                  {formatDistanceToNowStrict(new Date(photo.createdAt), {
                                      addSuffix: false,
                                    })}{' '}
                                  ago
                                </Typography>
                              ) : null}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </BlankCard>
            </Grid>
          );
        }) : null}
      </Grid>
    </>
  );
};

export default GalleryCard;
