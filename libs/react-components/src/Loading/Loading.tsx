import { Backdrop, CircularProgress, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    zIndex: 2000,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    // backgroundColor: theme.palette.background.defaultDark + '99', // add opacity to background color
    WebkitTapHighlightColor: 'transparent',
  },
}));

interface LoadingProps {
  isLoading: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Loading is a wrapper component that displays a backdrop and a loading spinner
 * when `isLoading` is set to true. It overlays the provided `children` content.
 *
 * @param {LoadingProps} props - The props for the Loading component.
 * @returns {JSX.Element} The rendered Loading component.
 */

export const Loading = ({ isLoading, style, children }: LoadingProps) => {
  const classes = useStyles();

  return (
    <div style={{ position: 'relative', height: '100%', ...style }}>
      {children}
      <Backdrop open={isLoading || false} classes={classes}>
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
};

export default Loading;
