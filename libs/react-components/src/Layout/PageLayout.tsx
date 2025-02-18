import styled from '@emotion/styled';
import { Typography, useTheme } from '@mui/material';

const titleHeight = 72;

const PageContentDiv = styled.div<{ $hasPaddingTop?: boolean }>`
  height: ${({ $hasPaddingTop }) =>
    $hasPaddingTop ? '100%' : `calc(100% - ${titleHeight}px)`};
  padding: 40px;
  padding-bottom: 20px;
  width: 100%;
  padding-top: ${({ $hasPaddingTop }) => ($hasPaddingTop ? '40px' : '0')};
  overflow: auto;
  display: flex;
  box-sizing: border-box;
`;

const ToolbarDiv = styled.div`
  height: ${titleHeight}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 40px;
`;
type PageLayoutProps = {
  title?: string;
  titleStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  toolbarContent?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * PageLayout component provides a structured layout with an optional toolbar and title at the top,
 * and a flexible content area below. Ideal for creating consistent page structures.
 *
 * @param {string} title - Optional. The title text displayed at the top of the page layout. Typically serves as a header for the content below.
 * @param {React.CSSProperties} titleStyle - Optional. Custom styles for the title, such as font size, color, or font weight, allowing further customization of the title appearance.
 * @param {React.CSSProperties} contentStyle - Optional. Styles applied to the main content area (`PageContentDiv`). Controls layout aspects such as padding, margins, and background color.
 * @param {React.ReactNode} toolbarContent - Optional. React node representing additional elements in the toolbar, such as buttons or icons, positioned next to the title.
 * @param {React.ReactNode} children - Required. The primary content of the page layout, displayed within the styled `PageContentDiv` section.
 * @param {React.CSSProperties} style - Optional. Overall custom styles for the root container, allowing adjustments to width, height, or other flex properties.
 */

export const PageLayout = ({
  title,
  titleStyle,
  toolbarContent,
  children,
  contentStyle,
  style,
}: PageLayoutProps) => {
  const theme = useTheme();
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', ...style }}>
      {(title || toolbarContent) && (
        <ToolbarDiv>
          {title && (
            <Typography
              color={theme.palette.text.primary}
              variant="h4"
              style={{ fontWeight: 700, ...titleStyle }}
            >
              {title}
            </Typography>
          )}
          {toolbarContent}
        </ToolbarDiv>
      )}
      {/* <PageContentDiv style={style} $hasPaddingTop={!(title ?? toolbarContent)}> */}
      <PageContentDiv
        $hasPaddingTop={!(title ?? toolbarContent)}
        style={contentStyle}
      >
        {children}
      </PageContentDiv>
    </div>
  );
};

export default PageLayout;
