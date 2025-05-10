import type { UseQueryResult } from "@tanstack/react-query";
import Loader from "@/components/ui/loader";
import Placeholder from "@/components/ui/placeholder";
import ErrorDisplay from "@/components/ui/error-display";
import React from "react";

type Props = React.PropsWithChildren<{
  query: UseQueryResult<any[] | undefined>;
  placeholder?: string;
}>;

const ArrayQueryGuard: React.FC<Props> = (props) => {
  const { query, children, placeholder } = props;

  if (query.isLoading) return <Loader />;
  if (query.isError) return <ErrorDisplay message={query.error.message} />;
  if (query.isSuccess && query.data?.length === 0)
    return <Placeholder message={placeholder || "No items"} />;

  return children;
};

export default ArrayQueryGuard;
