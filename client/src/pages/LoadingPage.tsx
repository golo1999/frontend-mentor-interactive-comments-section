import styled from "styled-components";

const Container = {
  Items: styled.div`
    align-items: center;
    display: flex;
    gap: 6.4vw;

    @media screen {
      @media (min-width: 768px) {
        gap: 3.125vw;
      }

      @media (min-width: 1200px) {
        gap: 1.66vw;
      }
    }
  `,
  Main: styled.div`
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background.primary};
    display: flex;
    flex: 1;
    justify-content: center;
  `,
};

interface ItemProps {
  $animationDelay: number;
}

const Item = styled.div<ItemProps>`
  animation: jump 2s infinite;
  animation-delay: ${({ $animationDelay }) => $animationDelay}s;
  aspect-ratio: 1 / 1;
  background-color: ${({ theme }) => theme.colors.loading};
  border-radius: 50%;
  width: 6.4vw;

  @media screen {
    @media (min-width: 768px) {
      width: 3.125vw;
    }

    @media (min-width: 1200px) {
      width: 2.22vw;
    }
  }

  @keyframes jump {
    0%,
    80%,
    100% {
      transform: translateY(0);
    }

    10%,
    70% {
      transform: translateY(8px);
    }

    40% {
      transform: translateY(-64px);
    }
  }
`;

export function LoadingPage() {
  return (
    <Container.Main>
      <Container.Items>
        {Array.from({ length: 3 }, (_, index) => (
          <Item $animationDelay={index * 0.2} key={`item-${index}`} />
        ))}
      </Container.Items>
    </Container.Main>
  );
}
