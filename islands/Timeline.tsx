import { useState } from "preact/hooks";
import { Post } from "../utils/constants.ts";
import dayjs from "@dayjs";
import relativeTime from "@dayjs/plugin/relativetime";

interface TimelineProps {
  author: string;
}

interface PostViewProps {
  post: Post;
}

dayjs.extend(relativeTime);

function PostView({ post }: PostViewProps) {
  return (
    <div class="border-b border-gray-600 p-8">
      <div class="flex flex-col">
        <div class="flex flex-row gap-2 items-center">
          <div class="font-bold">{`@${post.author}`}</div>
          <span class="text-sm">
            {` · ${dayjs(post.timestamp).fromNow()}`}
          </span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
}

export default function Timeline({ author }: TimelineProps) {
  // TODO: Get the posts that the author should see
  const fakePosts: Post[] = [{
    author: "brice",
    content: "test",
    timestamp: new Date(),
  }, {
    author: "someone else",
    content: "Another string of content for this one",
    timestamp: new Date(),
  }];
  const [posts] = useState(fakePosts);
  return (
    <div class="text-white flex flex-col w-full border-t border-gray-300">
      {posts.map((post) => <PostView post={post} />)}
    </div>
  );
}
