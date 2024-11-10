// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Box, Button, Grid, Typography } from '@mui/material';


const StillQuestions = () => {
  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} lg={10}>
        <Box bgcolor="primary.light" p={5} mt={7}>

          <Typography variant="h3" textAlign="center" mt={3} mb={1}>
            Всё еще остались вопросы?
          </Typography>
          <Typography variant="h6" fontWeight={400} lineHeight="23px" color="textSecondary" textAlign="center">
            Не можете найти вопрос, который вас интересует? Пожалуйста, напишите нам.
          </Typography>
          <Box textAlign="center" mt={3}>
            <Button variant="contained" color="primary">
              Написать
            </Button>
        </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StillQuestions;