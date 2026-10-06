import styled from "styled-components";

// A responsive grid container for layout purposes.
export const GridContainer = styled.section`
  display: grid;
  // 1 column on small screens.
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
  padding: 1rem;

  @media (min-width: 640px) {
    // 2 columns on medium screens.
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    // 4 columns on large screens.
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;
