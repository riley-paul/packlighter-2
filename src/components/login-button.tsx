import { cn } from "@/lib/utils";
import React from "react";

import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@radix-ui/themes";
import { UserRound } from "lucide-react";

const authProviders: Record<
  string,
  { string: string; url: string; icon: React.ReactNode; className?: string }
> = {
  github: {
    string: "Continue with GitHub",
    url: "/login/github",
    icon: <FaGithub className="h-5 w-5" />,
  },
  google: {
    string: "Continue with Google",
    url: "/login/google",
    icon: <FcGoogle className="h-5 w-5" />,
  },
  guest: {
    string: "Continue as Guest",
    url: "/login/guest",
    icon: <UserRound className="h-5 w-5" />,
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
        <span>{authProvider.string}</span>
      </a>
    </Button>
  );
};

export default LoginButton;
