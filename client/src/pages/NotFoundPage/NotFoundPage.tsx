import { useState } from "react";

import { useBackNavigation } from "hooks";

import { Button, Container, Text } from "./NotFoundPage.style";

export function NotFoundPage() {
  const handleBackNavigation = useBackNavigation();
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  function handleTitleMouseEnter() {
    setIsTitleHovered(true);
  }

  function handleTitleMouseLeave() {
    setIsTitleHovered(false);
  }

  return (
    <Container.Main>
      <Container.Content>
        <Text.Title.Parent
          onMouseEnter={handleTitleMouseEnter}
          onMouseLeave={handleTitleMouseLeave}
        >
          4
          <Text.Title.Child $isParentHovered={isTitleHovered}>
            0
          </Text.Title.Child>
          4
        </Text.Title.Parent>
        <Text.Subtitle>Oops! Page not found</Text.Subtitle>
        <Text.Description>
          Sorry, the page you're looking for doesn't exist.
        </Text.Description>
        <Button onClick={handleBackNavigation}>Return home</Button>
      </Container.Content>
    </Container.Main>
  );
}
