import "react-chat-elements/dist/main.css";

import {
  json,
  TypedResponse,
  type MetaFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { ITextMessage, MessageList } from "react-chat-elements";

export const meta: MetaFunction = () => {
  return [
    { title: "Gen AI Demo" },
    { name: "description", content: "Gemini の Chat AI デモ" },
  ];
};

interface IActionResponse {
  type: "model" | "user";
  text: string;
}

export async function action(
  req: ActionFunctionArgs
): Promise<TypedResponse<IActionResponse[]>> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await req.request.formData();

  const historyData = data.get("history");
  const histories: IActionResponse[] = historyData
    ? JSON.parse(historyData)
    : [];

  console.log(histories);

  // TODO: ここで LLM を呼び出す

  const message = data.get("message");
  histories.push({
    type: "user",
    text: message ?? "",
  });
  histories.push({
    type: "model",
    text: "this is sample model response message",
  });

  return json(histories);
}

function toChatMessage({
  id,
  isSelf,
  text,
}: {
  id: string;
  isSelf: boolean;
  text: string;
}): ITextMessage {
  return {
    id,
    position: isSelf ? "right" : "left",
    type: "text",
    text,
    notch: true,
    retracted: false,
    focus: false,
    forwarded: false,
    removeButton: false,
    replyButton: false,
  };
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigaeion = useNavigation();
  const messageRef = useRef();

  const [dataSources, setDataSources] = useState<ITextMessage[]>([]);

  useEffect(() => {
    const chatMessages = actionData?.map((data, index) => {
      return toChatMessage({
        id: `${index + 1}`,
        isSelf: data.type === "user",
        text: data.text,
      });
    });
    setDataSources(chatMessages ?? []);
    console.log(chatMessages);
  }, [actionData]);

  const isLoading =
    navigaeion.state === "loading" || navigaeion.state === "submitting";

  return (
    <main
      style={{
        width: "1024px",
        margin: "0 auto",
      }}
    >
      <h1>Chat Demo</h1>

      <Form method="post">
        <div>
          <MessageList
            className="message-list"
            referance={messageRef}
            lockable={true}
            toBottomHeight="100%"
            messageBoxStyles={{}}
            dataSource={dataSources}
          />
          <div
            style={{
              padding: "2rem",
              textAlign: "right",
            }}
          >
            <input
              type="hidden"
              name="history"
              value={JSON.stringify(actionData)}
            />
            <textarea
              rows={5}
              name="message"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.code === "Enter" && e.ctrlKey) {
                  e.stopPropagation();
                }
              }}
              style={{
                resize: "none",
                width: "100%",
              }}
            />
            <button type="submit" disabled={isLoading}>
              送信
            </button>
          </div>
        </div>
      </Form>
    </main>
  );
}
