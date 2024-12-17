import { Chance } from 'chance';
import { sub } from 'date-fns';
import { uniqueId } from 'lodash';
import bg1 from 'src/assets/images/blog/blog-img1.jpg';
import type { ChatsType } from 'src/types/apps/chat';
import mock from '../mock';

const chance = new Chance();

const ChatData: ChatsType[] = [
  {
    id: 1,
    name: 'Первый чат',
    messages: [
      {
        createdAt: sub(new Date(), { hours: 1 }),
        content: chance.sentence({ words: 5 }),
        senderId: 1,
        type: 'text',
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 30 }),
        content: chance.sentence({ words: 10 }),
        senderId: 1,
        type: 'text',
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        content: chance.sentence({ words: 5 }),
        senderId: uniqueId(),
        type: 'text',
        attachment: [],
        id: uniqueId(),
      },
      {
        content: bg1,
        senderId: uniqueId(),
        type: 'image',
        attachment: [],
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 5 }),
        content: chance.sentence({ words: 5 }),
        senderId: 1,
        type: 'text',
        attachment: [],
        id: uniqueId(),
      },
    ],
  },
  {
    id: 2,
    name: 'Второй чат',
    messages: [],
  },
];

mock.onGet('/api/data/chat/ChatData').reply(() => {
  return [200, ChatData];
});

export default ChatData;
