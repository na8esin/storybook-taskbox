
import InboxScreen from './InboxScreen';

import store from '../lib/store';

 import { http, HttpResponse } from 'msw';

 import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {
 parameters: {
   msw: {
     handlers: [
       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
         return HttpResponse.json(MockedState.tasks);
       }),
     ],
   },
 },
};

// Docsの表示がおかしい
// mswの設定が後勝ちになっていて、Defaultも影響を受けている気がする
export const Error = {
 parameters: {
   msw: {
     handlers: [
       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
         return new HttpResponse(null, {
           status: 403,
         });
       }),
     ],
   },
 },
};