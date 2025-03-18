import { cn } from "@/lib/client/utils";
import React from "react";

import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@radix-ui/themes";

const authProviders: Record<
  string,
  { name: string; url: string; icon: React.ReactNode; className?: string }
> = {
  github: {
    name: "GitHub",
    url: "/login/github",
    icon: <FaGithub className="h-5 w-5" />,
  },
  google: {
    name: "Google",
    url: "/login/google",
    icon: <FcGoogle className="h-5 w-5" />,
  },
};

type Props = {
  className?: string;
  provider: keyof typeof authProviders;
};

const LoginButton: React.FC<Props> = (props) => {
  const { className, provider } = props;
  const authProvider = authProviders[provider];
  return (
    <Button size="3" variant="soft" asChild>
      <a
        className={cn("relative", authProvider.className, className)}
        href={authProvider.url}
      >
        <span className="absolute left-4">{authProvider.icon}</span>
        <span>Continue with {authProvider.name}</span>
      </a>
    </Button>
  );
};

export default LoginButton;
