import React from "react";
import Markdown from "react-markdown";
import ViewerCategory from "./viewer-category";
import type { ExpandedList } from "@/db/schema";

type Props = {
  list: ExpandedList;
};

const ViewerList: React.FC<Props> = (props) => {
  const { list } = props;

  return (
    <div className="grid w-full gap-8">
      <Markdown className="text-sm prose prose-sm max-w-none px-2 dark:prose-invert">
        {`# ${list.name}\n` + list.description}
      </Markdown>
      {list.categories.map((category) => (
        <ViewerCategory key={category.id} category={category} list={list} />
      ))}
    </div>
  );
};

export default ViewerList;
