import InboxScreen from "./InboxScreen";

import store from "../lib/store";

import { http, HttpResponse } from "msw";

import { MockedState } from "./TaskList.stories";

import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

import {
  fireEvent,
  waitFor,
  within,
  waitForElementToBeRemoved,
} from "@storybook/test";

export default {
  component: InboxScreen,
  title: "InboxScreen",
  tags: ["autodocs"],
};

export const Default = {
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  args: {
    userId: 1,
  },
  // parameters: {
  //   msw: {
  //     handlers: [
  //       http.get(
  //         "https://jsonplaceholder.typicode.com/todos",
  //         ({ request }) => {
  //           const url = new URL(request.url);
  //           if (url.searchParams.get("userId") !== "1") {
  //             return new HttpResponse(null, {
  //               status: 403,
  //             });
  //           } else {
  //             return HttpResponse.json(MockedState.tasks);
  //           }
  //         },
  //       ),
  //     ],
  //   },
  // },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Waits for the component to transition from the loading state
    // TaskListに仕込んでたやつか。
    await waitForElementToBeRemoved(await canvas.findByTestId("loading"));
    // Waits for the component to be updated based on the store
    await waitFor(async () => {
      // Simulates pinning the first task
      await fireEvent.click(canvas.getByLabelText("pinTask-1"));
      // Simulates pinning the third task
      await fireEvent.click(canvas.getByLabelText("pinTask-3"));
    });
  },
};

// extraReducersは実装しない
const Mockstore = ({ taskboxState, children }) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: "taskbox",
          initialState: taskboxState,
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

// 下記のようにやれば、Docsでもちゃんとエラーの表示になる
const ErrorMockedState = {
  tasks: [],
  status: "idle",
  error: "error",
};
export const Error = {
  args: {
    userId: 1,
  },
  decorators: [
    (story) => <Mockstore taskboxState={ErrorMockedState}>{story()}</Mockstore>,
  ],
};

// Docsの表示がおかしい
// mswの設定が後勝ちになっていて、Defaultも影響を受けている気がする
// userIdの値で分岐しても結果は一緒
export const Error2 = {
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  args: {
    userId: 9999,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(
          "https://jsonplaceholder.typicode.com/todos",
          ({ request }) => {
            const url = new URL(request.url);
            console.log(`userId=${url.searchParams.get("userId")}`);
            if (url.searchParams.get("userId") !== 1) {
              return new HttpResponse(null, {
                status: 403,
              });
            } else {
              return HttpResponse.json(MockedState.tasks);
            }
          },
        ),
      ],
    },
  },
};
