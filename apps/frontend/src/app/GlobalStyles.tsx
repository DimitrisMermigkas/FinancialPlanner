/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      html,
      body,
      #root {
        margin: 0;
        height: 100%;
        font-family: Plus Jakarta Sans, sans-serif !important;
      }
    `}
  />
);

export default GlobalStyles;
