import { Card, Heading, Link, Text } from "@radix-ui/themes";
import React from "react";
import LoginButton from "./login-button";

const LoginCard: React.FC = () => {
  return (
    <article className="flex flex-col items-center gap-6">
      <Heading className="flex items-center gap-2">
        <div className="size-6">
          <img src="/earth.svg" />
        </div>
        LighterTravel
      </Heading>
      <Card
        size="3"
        className="z-10 flex w-full max-w-screen-xs flex-col items-center gap-6"
      >
        <header className="flex flex-col items-center gap-1">
          <Heading size="4" weight="bold" align="center">
            Welcome
          </Heading>
          <Text size="2" color="gray" align="center">
            Sign in to continue to LighterTravel
          </Text>
        </header>
        <section className="flex flex-col items-center gap-2 w-full">
          <LoginButton className="w-full" provider="google" />
        </section>
        <footer className="max-w-64 text-balance text-center">
          <Text size="1" color="gray">
            By clicking continue, you agree to our{" "}
            <Link href="/terms-of-service">Terms of Service</Link> and{" "}
            <Link href="privacy">Privacy Policy</Link>.
          </Text>
        </footer>
      </Card>
    </article>
  );
};

export default LoginCard;
