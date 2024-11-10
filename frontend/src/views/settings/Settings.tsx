import { FC, useState } from 'react';
import {
  Fab,
  Drawer,
  Grid,
  Slider,
  Divider,
  styled,
  IconButton,
  Typography,
  Tooltip,
  Stack,
  Button,
  ButtonBase,
} from '@mui/material';
import { useSelector, useDispatch } from 'src/store/Store';
import Box, { BoxProps } from '@mui/material/Box';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconX, IconSettings, IconCheck } from '@tabler/icons-react';
import {
  setTheme,
  setDir,
  setDarkMode,
  toggleLayout,
  toggleSidebar,
  toggleHorizontal,
  setBorderRadius,
  setCardShadow,
} from 'src/store/customizer/CustomizerSlice';
import { AppState } from 'src/store/Store';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';


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
