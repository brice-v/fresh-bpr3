interface CreatePostWizardProps {
  author: string;
}

export default function CreatePostWizard({ author }: CreatePostWizardProps) {
  // TODO: use the author for posting to the db - should be able to use trpc here

  // TODO: Inlcude button to add new post
  // TODO: Include signout button? - that probably doesnt belong here Unless we change the name of the component (could even be server side with only the post part as an island)
  return (
    <div class="flex w-full text-white align-middle pt-3 pl-3 gap-3">
      <div class="font-bold text-2xl">{author}</div>
      <input
        placeholder="Type something here!!"
        class="flex-grow bg-transparent outline-none text-gray-200 pt-1"
        minLength={3}
        maxLength={255}
        autofocus={true}
      />
    </div>
  );
}
