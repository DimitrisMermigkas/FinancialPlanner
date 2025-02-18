import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { CustomButton } from '@my-workspace/react-components';
import { CSSProperties, FC, ReactNode } from 'react';

interface CardComponentProps {
  title?: string;
  buttonText?: string;
  cardStyle?: CSSProperties;
  cardContentStyle?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
}
const CardComponent: FC<CardComponentProps> = ({
  title,
  buttonText,
  cardStyle,
  cardContentStyle,
  onClick,
  children,
}) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: '20px',
        background: 'linear-gradient(129deg, #151D27 25%, #0b0d1b4d 80%)',
        padding: '16px',
        boxSizing: 'border-box',
        color: theme.palette.common.white,
        ...cardStyle,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          padding: '0px',
          flexDirection: 'column',
          rowGap: '16px',
          ...cardContentStyle,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title && (
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 24,
                fontWeight: 'normal',
              }}
            >
              {title}
            </Typography>
          )}
          {buttonText && (
            <CustomButton variant="contained" onClick={onClick}>
              {buttonText}
            </CustomButton>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
};
export default CardComponent;
