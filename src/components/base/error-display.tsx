import { Button, Heading, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import React from "react";

interface Props {
  status?: number;
  message?: string;
  showGoHome?: boolean;
  retry?: () => void;
}

const ErrorDisplay: React.FC<Props> = (props) => {
  const {
    showGoHome,
    retry,
    status = 500,
    message = "An unknown error occurred. Please try again later.",
  } = props;

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="flex h-full max-h-[50%] w-full max-w-sm flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-4">
          <i className="fa-solid fa-bug text-8 text-red-10" />
          <div className="flex flex-col">
            <Heading size="4">{status} Error</Heading>
            <Text size="2" color="gray">
              {message}
            </Text>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {retry && <Button onClick={() => retry()}>Retry</Button>}
          {showGoHome && (
            <Button asChild variant="soft">
              <Link to="/">Go Home</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
