// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Grid, Typography } from '@mui/material';
import { IconChevronDown } from '@tabler/icons-react';

const Questions = () => {
  return (
    <Box>
      <Grid container spacing={3} >
        <Grid item >
          <Box mt={2} mb={1}>
        <Box  p={1} sx={{width: "90%", margin: "0 auto 0 auto"}}> 
          <Typography variant="h3" textAlign="center" p={2} color='primary' >Часто задаваемые вопросы</Typography>
          <Typography variant="h6" fontWeight={400} sx={{color: "primary.contrastText"}} textAlign="center" mb={4}>Узнайте как использовать этот сайт.</Typography>
          </Box>
          </Box>
          <Box p={1} sx={{width: "90%", margin: "0 auto 0 auto"}}> 
          <Accordion elevation={9}>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6" px={2} py={1}>Что такое HealthMate?</Typography>
            </AccordionSummary>
            
            <Divider />
            <AccordionDetails>
              <Typography variant="subtitle1" pt={1} px={2} color="textSecondary">
                HealthMate - это платформа, вмещающая в себя медицинские сервисы, доступные всем.
              </Typography>
            </AccordionDetails>
          </Accordion>
          </Box>
          <Box p={1} sx={{width: "90%", margin: "0 auto 0 auto"}}> 
          <Accordion elevation={9}>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h6" px={2} py={1}>Как работает чат?</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography variant="subtitle1" pt={1} px={2} color="textSecondary">
                Учитель может сам наполнять свои курсы разнообразными механиками, которые включают методы геймификации,
                уроки, тэги и задачи.
              </Typography>
            </AccordionDetails>
          </Accordion>
          </Box>
          <Box p={1} sx={{width: "90%", margin: "0 auto 0 auto"}}> 
          <Accordion elevation={9}>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography variant="h6" px={2} py={1}>Зачем нужны рекомендации?</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography variant="subtitle1" pt={1} px={2} color="textSecondary">
                Урок включается в себя видео урок, учебные материалы(описание урока), а также вознаграждения
                , которые будут получены за его прохождение.
              </Typography>
            </AccordionDetails>
          </Accordion>
          </Box>
          <Box p={1} sx={{width: "90%", margin: "0 auto 0 auto"}}> 
          <Accordion elevation={9}>
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography variant="h6" px={2} py={1}>Будут ли в сохранности мои данные?</Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography variant="subtitle1" pt={1} px={2} color="textSecondary">
                Задача - вопрос преподавателя, по пройденному уроку или независимая боевая единица.
              </Typography>
            </AccordionDetails>
          </Accordion>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Questions;