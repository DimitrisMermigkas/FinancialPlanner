import { Button, Card, CardContent, Typography, useTheme } from '@mui/material';
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
        borderRadius: '16px',
        background: theme.palette.background.paper,
        padding: '16px',
        boxSizing: 'border-box',
        boxShadow: '5px 5px 8px 0px #2b2d32',
        ...cardStyle,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
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
          {title && <Typography variant="h6">{title}</Typography>}
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
