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

export const meta: MetaFunction = () => {
  return [
    { title: "Gen AI Demo" },
    { name: "description", content: "Gemini の Chat AI デモ" },
  ];
};

export async function loader(): Promise<TypedResponse<{ message: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("load data in server!!");
  return json({ message: "Hello World" });
}

export async function action(
  req: ActionFunctionArgs
): Promise<TypedResponse<{ message: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`do action in server with ${req.request.method}!!`);
  return json({ message: `This is Server Action with ${req.request.method}` });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigaeion = useNavigation();

  const actionMessge =
    navigaeion.state === "loading" || navigaeion.state === "submitting"
      ? "loading"
      : actionData?.message ?? "no action";

  return (
    <>
      <div>
        <h1>Navigation</h1>
        <p>{navigaeion.state}</p>
      </div>
      <div>
        <h1>Loading Demo</h1>
        <p>{data.message}</p>
      </div>
      <div>
        <h1>Action Demo</h1>
        <Form method="post">
          <button type="submit">click me</button>
        </Form>
        <Form method="delete">
          <button type="submit">click me with delete</button>
        </Form>
        <p>{actionMessge}</p>
      </div>
    </>
  );
}
