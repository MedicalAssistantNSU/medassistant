import mock from '../mock';
import bg1 from 'src/assets/images/blog/blog-img1.jpg';
import user1 from 'src/assets/images/profile/user-1.jpg';
import user2 from 'src/assets/images/profile/user-2.jpg';
import adobe from 'src/assets/images/chat/icon-adobe.svg';
import chrome from 'src/assets/images/chat/icon-chrome.svg';
import figma from 'src/assets/images/chat/icon-figma.svg';
import java from 'src/assets/images/chat/icon-javascript.svg';
import zip from 'src/assets/images/chat/icon-zip-folder.svg';
import { Chance } from 'chance';
import type { ChatsType } from 'src/types/apps/chat';
import { sub } from 'date-fns';
import { uniqueId } from 'lodash';

const chance = new Chance();

const ChatData: ChatsType[] = [
  {
    id: 1,
    name: 'Первый чат',
    messages: [
      {
        createdAt: sub(new Date(), { hours: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: 'text',
        attachment: [
          { icon: adobe, file: 'service-task.pdf', fileSize: '2MB' },
          { icon: chrome, file: 'homepage-design.fig', fileSize: '3MB' },
          { icon: figma, file: 'about-us.htmlf', fileSize: '1KB' },
          { icon: java, file: 'work-project.zip', fileSize: '20MB' },
          { icon: zip, file: 'custom.js', fileSize: '2MB' },
        ],
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 30 }),
        msg: chance.sentence({ words: 10 }),
        senderId: 1,
        type: 'text',
        attachment: [],
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: uniqueId(),
        type: 'text',
        attachment: [],
        id: uniqueId(),
      },
      {
        msg: bg1,
        senderId: uniqueId(),
        type: 'image',
        attachment: [],
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 5 }),
        msg: chance.sentence({ words: 5 }),
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
    messages: [
      {
        createdAt: sub(new Date(), { hours: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: uniqueId(),
        type: 'text',
        attachment: [
          { icon: adobe, file: 'service-task.pdf', fileSize: '2MB' },
          { icon: chrome, file: 'homepage-design.fig', fileSize: '3MB' },
          { icon: java, file: 'work-project.zip', fileSize: '20MB' },
          { icon: zip, file: 'custom.js', fileSize: '2MB' },
        ],
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 30 }),
        msg: chance.sentence({ words: 10 }),
        senderId: uniqueId(),
        type: 'text',
        attachment: [],
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 2,
        type: 'text',
        attachment: [],
        id: uniqueId(),
      },
      {
        msg: bg1,
        senderId: 2,
        type: 'image',
        attachment: [],
        id: uniqueId(),
      },
      {
        createdAt: sub(new Date(), { minutes: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: uniqueId(),
        type: 'text',
        attachment: [],
        id: uniqueId(),
      },
    ],
  },
];

mock.onGet('/api/data/chat/ChatData').reply(() => {
  return [200, ChatData];
});

export default ChatData;
