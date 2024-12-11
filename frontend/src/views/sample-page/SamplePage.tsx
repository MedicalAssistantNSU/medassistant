// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Box, Grid } from '@mui/material';
import PostCard from 'src/components/apps/posts/PostCard';
import PageContainer from 'src/components/container/PageContainer';


const Posts = () => {
  return (
    <PageContainer title="Posts" description="this is posts page">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <Box sx={{bgcolor:"secondary.light"}} p={4} borderRadius={0}>
            <PostCard />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Posts;

