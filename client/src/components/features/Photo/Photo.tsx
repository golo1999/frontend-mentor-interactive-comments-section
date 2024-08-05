import styled from "styled-components";

const StyledPhoto = styled.div`
  aspect-ratio: 1 / 1;
  background-image: url("https://i.pinimg.com/736x/1e/98/47/1e9847a968366b52fe9eac6e9ecebd73.jpg");
  background-position: center;
  background-size: cover;
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
`;

export function Photo() {
  return <StyledPhoto />;
}
