import {
  Divider,
  Stack,
  styled,
  Typography
} from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { useDispatch, useSelector } from 'src/store/Store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import PageContainer from 'src/components/container/PageContainer';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import DashboardCard from 'src/components/shared/DashboardCard';
import {
  setDarkMode
} from 'src/store/customizer/CustomizerSlice';
import { AppState } from 'src/store/Store';


const Settings = () => {
    const customizer = useSelector((state: AppState) => state.customizer);

    const dispatch = useDispatch();

    const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
        boxShadow: theme.shadows[8],
        padding: '10px',
        cursor: 'pointer',
        justifyContent: 'center',
        display: 'flex',
        transition: '0.1s ease-in',
        border: '1px solid rgba(145, 158, 171, 0.12)',
        '&:hover': {
          transform: 'scale(1.10)',
        },
      }));
    
  return (
    <PageContainer title="Настройки">
      {/* breadcrumb */}
      <Box mt={2} />
      {/* end breadcrumb */}
      <DashboardCard>
        {/* ------------------------------------------- */}
        {/* ------------ Customizer Sidebar ------------- */}
        {/* ------------------------------------------- */}
        <Scrollbar sx={{ }}>
          <Box p={1} display="flex" justifyContent={'space-between'} alignItems="center">
            <Typography variant="h4">Настройки</Typography>

          </Box>
          <Divider  />
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Тема
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(setDarkMode('light'))} display="flex" gap={1}>
                <WbSunnyTwoToneIcon
                  color={customizer.activeMode === 'light' ? 'primary' : 'inherit'}
                />
                Светлая
              </StyledBox>
              <StyledBox onClick={() => dispatch(setDarkMode('dark'))} display="flex" gap={1}>
                <DarkModeTwoToneIcon
                  color={customizer.activeMode === 'dark' ? 'primary' : 'inherit'}
                />
                Тёмная
              </StyledBox>
            </Stack>

          </Box>
        </Scrollbar>
      </DashboardCard>
    </PageContainer>
  );
};

export default Settings;
