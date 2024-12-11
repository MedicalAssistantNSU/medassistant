import { Box, CardMedia, Typography } from '@mui/material';
import { useSelector } from 'src/store/Store';
import { PostType } from 'src/types/apps/posts';

const PostInfo = () => {
    const post : PostType = useSelector((state) => state.postReducer.selectedPost);

    return (
        <>
         <CardMedia component={'img'} height="220" alt="Remy Sharp" src={post.image_url}/> 
            <Box
                p={2}
                sx={
                    {
                        width: "90%",
                        margin: "auto"
                    }
                }
            >
                <Box mb={3}>
                    <Typography fontSize={18} fontWeight={600}>
                        {post ? post.title : ""}
                    </Typography>
                    
                    
                    <br/>
                    <Typography fontSize={14} fontWeight={600}>
                        Описание
                    </Typography>
                    <Typography fontSize={14} fontWeight={400}>
                        {post ? post.description : ""}
                    </Typography>
                    <br/>
                    <Typography fontSize={14} fontWeight={600}>
                        Статья
                    </Typography>
                    <Typography fontSize={14} fontWeight={400}>
                        {post ? post.content : ""}
                    </Typography>
                </Box>
            
            </Box>
        </>
    )
}

export default PostInfo;