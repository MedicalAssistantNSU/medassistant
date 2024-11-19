// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Box, ButtonBase, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useDispatch, useSelector } from 'src/store/Store';
import { MessageType } from 'src/types/apps/chat';
import { formatDistanceToNowStrict } from 'date-fns';
import { useEffect } from 'react';
import { fetchScans } from 'src/store/apps/chat/ChatSlice';
import { Link } from 'react-router-dom';


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
          <Typography fontSize={30} color={"primary.main"} textAlign={'center'}> Недавние сканирования </Typography>
          <Box p={1}>
                  {scans.map((scan) => (
                    <ButtonBase sx={{width: "90%", margin: "0 5%"}} component={Link} to="/apps/chats">
                      <Box width={"100%"} key={scan.id + scan.content + scan.createdAt}>
                        
                          <Box
                            p={2}
                            mt={3}
                            display="flex"
                            sx={{backgroundColor: "white"}}
                          >
                            <Box alignItems="flex-end" display="flex" flexDirection={'column'}>
                              {scan.createdAt ? (
                                <Typography variant="body2" color="black" mb={1}>
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
            
                  ))}
                </Box>
          
      </PageContainer>
  );
};

export default ScanHistoryPage;
