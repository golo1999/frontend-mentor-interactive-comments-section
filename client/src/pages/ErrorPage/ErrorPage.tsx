import { Container, Icon, Text } from "./ErrorPage.style";

export function ErrorPage() {
  function handlePageReload() {
    window.location.reload();
  }

  return (
    <Container.Main>
      <Container.Content>
        <Icon.Error />
        <Text.Title>Oops, something went wrong</Text.Title>
        <Text.Description>
          There was a problem connecting to the server.
          <br />
          Please&nbsp;
          <Text.Refresh onClick={handlePageReload}>
            refresh the page
          </Text.Refresh>
          &nbsp;or check your connection.
        </Text.Description>
      </Container.Content>
    </Container.Main>
  );
}
