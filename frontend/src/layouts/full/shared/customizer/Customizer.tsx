import {
  ButtonBase,
  Divider,
  Drawer,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography
} from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'src/store/Store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import { IconSettings, IconX } from '@tabler/icons-react';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import {
  setDarkMode
} from 'src/store/customizer/CustomizerSlice';
import { AppState } from 'src/store/Store';

const SidebarWidth = '320px';

const Customizer: FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const customizer = useSelector((state: AppState) => state.customizer);

  const dispatch = useDispatch();

  const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
    boxShadow: theme.shadows[8],
    padding: '20px',
    cursor: 'pointer',
    justifyContent: 'center',
    display: 'flex',
    transition: '0.1s ease-in',
    border: '1px solid rgba(145, 158, 171, 0.12)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }));

  return (
      <div>
          {/* ------------------------------------------- */}
          {/* --Floating Button to open customizer ------ */}
          {/* ------------------------------------------- */}
          <Tooltip title="Settings">
              <ButtonBase onClick={() => setShowDrawer(true)}>
                  <IconSettings />
              </ButtonBase>
          </Tooltip>
          <Drawer
              anchor="right"
              open={showDrawer}
              onClose={() => setShowDrawer(false)}
              PaperProps={{
                  sx: {
                      width: SidebarWidth,
                  },
              }}
          >
              {/* ------------------------------------------- */}
              {/* ------------ Customizer Sidebar ------------- */}
              {/* ------------------------------------------- */}
              <Scrollbar sx={{ height: 'calc(100vh - 5px)' }}>
                  <Box p={2} display="flex" justifyContent={'space-between'} alignItems="center">
                      <Typography variant="h4">Настройки</Typography>

                      <IconButton color="inherit" onClick={() => setShowDrawer(false)}>
                          <IconX size="1rem" />
                      </IconButton>
                  </Box>
                  <Divider />
                  <Box p={3}>
                      {/* ------------------------------------------- */}
                      {/* ------------ Dark light theme setting ------------- */}
                      {/* ------------------------------------------- */}
                      <Typography variant="h6" gutterBottom>
                          Тема
                      </Typography>
                      <Stack direction={'row'} gap={2} my={2}>
                          <StyledBox
                              onClick={() => dispatch(setDarkMode('light'))}
                              display="flex"
                              gap={1}
                          >
                              <WbSunnyTwoToneIcon
                                  color={customizer.activeMode === 'light' ? 'primary' : 'inherit'}
                              />
                              Светлая
                          </StyledBox>
                          <StyledBox
                              onClick={() => dispatch(setDarkMode('dark'))}
                              display="flex"
                              gap={1}
                          >
                              <DarkModeTwoToneIcon
                                  color={customizer.activeMode === 'dark' ? 'primary' : 'inherit'}
                              />
                              Тёмная
                          </StyledBox>
                      </Stack>

                      <Box pt={3} />
                  </Box>
              </Scrollbar>
          </Drawer>
      </div>
  );
};

export default Customizer;
