import { Button, Card, CardContent, Typography } from '@mui/material';
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
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: '16px',
        background: '#c5d2e7ff',
        padding: '16px',
        boxSizing: 'border-box',
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
            <Button variant="contained" color="primary" onClick={onClick}>
              {buttonText}
            </Button>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
};
export default CardComponent;
