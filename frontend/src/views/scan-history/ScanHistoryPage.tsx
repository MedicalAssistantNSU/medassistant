// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Box, ButtonBase, Chip, Typography } from '@mui/material';
import { formatDistanceToNowStrict } from 'date-fns';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { fetchScans } from 'src/store/apps/chat/ChatSlice';
import { useDispatch, useSelector } from 'src/store/Store';
import { MessageType } from 'src/types/apps/chat';


const ScanHistoryPage = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchScans());
    }, [dispatch]);

    const scans: MessageType[] = useSelector(
        (state) => state.chatReducer.scans,
      );
    console.log(scans)
  return (
      <PageContainer title="История сканирований">
          {/* breadcrumb */}
          <Box mt={4} />
          {/* end breadcrumb */}
          <Box p={2} boxShadow={15} sx={{backgroundColor:"secondary.contrastText"}} borderRadius={3} margin={"0 auto"}>
          <Typography fontSize={25} color={"secondary.dark"} textAlign={'center'}> Недавние сканирования </Typography>
          </Box>
          <Box p={1}>
                  {scans ? scans.map((scan) => (
                    <ButtonBase sx={{width: "90%", margin: "0 5%"}} component={Link} to="/apps/chats">
                      <Box width={"100%"} key={scan.id + scan.content + scan.createdAt}>
                        
                          <Box
                            p={2}
                            mt={3}
                            display="flex"
                            sx={{backgroundColor: "secondary.contrastText"}}
                          >
                            <Box alignItems="flex-end" display="flex" flexDirection={'column'}>
                              {scan.createdAt ? (
                                <Typography variant="body2" color="primary.main" mb={1}>
                                  {formatDistanceToNowStrict(new Date(scan.createdAt), {
                                      addSuffix: false,
                                    })}{' '}
                                  ago
                                </Typography>
                              ) : null}
                              {scan.type === 'image' ? (
                                <Box mb={1} sx={{ overflow: 'hidden', lineHeight: '0px' }}>
                                  <a href={scan.content}><img src={scan.content} alt="attach" width="70" /></a>
                                </Box>
                              ) : null}
                            </Box>
                          </Box>
                         
                      </Box>
                      </ButtonBase>
            
                  )) : <></>}
                </Box>
          
      </PageContainer>
  );
};

export default ScanHistoryPage;
