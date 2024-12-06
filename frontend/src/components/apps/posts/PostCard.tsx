import {
    Backdrop,
    Box,
    Button,
    ButtonBase,
    CardMedia,
    Chip,
    Fade,
    Grid,
    InputAdornment,
    Modal,
    Skeleton,
    Stack,
    TextField,
    Typography
} from '@mui/material';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import { IconSearch } from '@tabler/icons-react';
import { formatDistanceToNowStrict } from 'date-fns';
import React, { useEffect, useState } from 'react';
import BlankCard from 'src/components/shared/BlankCard';
import { fetchPosts, SelectPost } from 'src/store/apps/posts/PostSlice';
import { setBorderRadius } from 'src/store/customizer/CustomizerSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { PostType } from 'src/types/apps/posts';
import PostInfo from './PostInfo';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '90%',
    bgcolor: 'background.paper',
    overflowY: 'auto',
    boxShadow: 24,
};
  
const PostCard = () => {
    const dispatch = useDispatch();
    const [openPost, setOpenPost] = useState(false);

    useEffect(() => {
      dispatch(fetchPosts());
    }, [dispatch]);

    const handleClick = (post: PostType) => {
        dispatch(SelectPost(post))
        setOpenPost(true)
    }
  
  
    const [_, setSearch] = React.useState('');
    const posts : PostType[]  = useSelector((state) => state.postReducer.posts);
  
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
      <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openPost}
                onClose={() => setOpenPost(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={openPost}>
                    <Box sx={style}>
                      <PostInfo />
                    </Box>
                </Fade>
         </Modal>

        <Grid container spacing={3}>
          <Grid item sm={12} lg={12}>
            <Stack direction="row" alignItems={'center'} mt={2}>
              <Box>
                <Typography variant="h3">
                  Статьи и новости &nbsp;
                  <Chip label={posts ? posts.length : 0} color="primary" size="small" />
                </Typography>
              </Box>
              <Box ml="auto">
                <TextField
                  id="outlined-search"
                  placeholder="Поиск по новостям"
                  size="small"
                  type="search"
                  variant="outlined"
                  inputProps={{ 'aria-label': 'Поиск по новостям' }}
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
          {posts ? posts.map((post) => {
            return (
              <Grid item xs={12} lg={4} key={post.id}>
                <ButtonBase onClick={()=>handleClick(post)}>
                <BlankCard className="hoverCard" >
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
                    <CardMedia component={'img'} height="220" alt="Remy Sharp" src={post.image_url} />
                  )}
                  <Box p={3}>
                    <Stack direction="row" gap={1}>
                      <Box>
                        <Typography variant="h6">{post.title}</Typography>
                        <br/>
                        <Typography variant="caption">
                          {post.created_at ? (
                                  <Typography variant="body2" color="black" mb={1}>
                                    {formatDistanceToNowStrict(new Date(post.created_at), {
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
                </ButtonBase>
              </Grid>
            );
          }) : null}
        </Grid>
      </>
    );
  };
  
  export default PostCard;
  