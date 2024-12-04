// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Stack, Typography } from '@mui/material';

import { IconAccessible, IconBriefcase, IconMail, IconMapPin } from '@tabler/icons-react';
import ChildCard from 'src/components/shared/ChildCard';

const IntroCard = () => (
  <ChildCard>
    <Typography fontWeight={600} variant="h4" mb={2}>
      Основная информация
    </Typography>
    <Typography color="textSecondary" variant="subtitle2" mb={2}>
      Здесь будет собрана информация, на основе которой будут состовляться рекомендации.
    </Typography>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconBriefcase size="21" />
      <Typography variant="h6">Профессия</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconMail size="21" />
      <Typography variant="h6">Почта</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconMapPin size="21" />
      <Typography variant="h6">Место</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconAccessible size="21" />
      <Typography variant="h6">Пол</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconAccessible size="21" />
      <Typography variant="h6">Возраст</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={3}>
      <IconAccessible size="21" />
      <Typography variant="h6">Вес</Typography>
    </Stack>
    <Stack direction="row" gap={2} alignItems="center" mb={1}>
      <IconAccessible size="21" />
      <Typography variant="h6">Рост</Typography>
    </Stack>
  </ChildCard>
);

export default IntroCard;
