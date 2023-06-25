import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>bpr</title>
      </Head>
      <div class="wrapper bg-gray-900 h-screen w-screen flex justify-center">
        <div class="bg-gray-800 h-screen w-full max-w-4xl flex flex-col items-center gap-5 border-x border-gray-600">
          <Component />
        </div>
      </div>
    </>
  );
}
