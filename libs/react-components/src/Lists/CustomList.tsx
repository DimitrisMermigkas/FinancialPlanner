import React from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

interface ListItemData {
  primary: string;
  secondary?: string;
  icon?: React.ReactNode;
}

interface CustomListProps {
  title?: string;
  containerStyle?: React.CSSProperties;
  listItemStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  listStyle?: React.CSSProperties;
  items: ListItemData[];
  dense?: boolean;
  buttonIcon?: React.ReactNode; // Icon button passed individually
  iconPosition?: 'start' | 'end'; // Position of the icon
  handleIconClick?: (item: ListItemData) => void; // Function to open dialog
}
/**
 * CustomList is a component that displays a list of items with optional icons,
 * titles, and action buttons. Icons and buttons can be positioned according
 * to the specified props.
 *
 * @param {string} title - Optional. The title text displayed at the top of the list, used for contextualizing the list items.
 * @param {React.CSSProperties} titleStyle - Optional. Custom styles applied to the title, allowing adjustments to font size, color, and other typography attributes.
 * @param {ListItemData[]} items - Required. An array of objects defining the content for each list item. Each item contains:
 *    - `primary`: The main text for the item.
 *    - `secondary` (optional): Additional text shown below the primary text.
 *    - `icon` (optional): An icon to display with the item.
 * @param {React.CSSProperties} containerStyle - Optional. Styles applied to the outer wrapper of the list container, allowing customization of padding, margin, and layout positioning.
 * @param {React.CSSProperties} listStyle - Optional. Custom styles for the `<List>` component, affecting properties like background color and spacing.
 * @param {React.CSSProperties} listItemStyle - Optional. Styles for each individual list item, providing control over padding, color, and background on a per-item basis.
 * @param {boolean} dense - Optional. If true, applies a more compact styling to the list, reducing padding between items. Default is `false`.
 * @param {React.ReactNode} buttonIcon - Optional. Icon displayed as an action button at the end of each list item, useful for actions like settings or delete.
 * @param {'start' | 'end'} iconPosition - Optional. Specifies where the `icon` will appear within each item, either at the start or end. Default is `'start'`.
 * @param {(item: ListItemData) => void} handleIconClick - Optional. Callback function invoked when `buttonIcon` is clicked, passing the associated item as a parameter for specific actions, like opening a dialog.
 * @returns {JSX.Element} The rendered CustomList component.
 */
export const CustomList: React.FC<CustomListProps> = ({
  title,
  titleStyle,
  items,
  containerStyle,
  listStyle,
  listItemStyle,
  dense = false,
  buttonIcon,
  iconPosition = 'start', // Default position is start
  handleIconClick,
}) => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', ...containerStyle }}
    >
      <Typography style={titleStyle}>{title}</Typography>
      <List dense={dense} style={listStyle}>
        {items.map((item, index) => (
          <ListItem style={listItemStyle} key={'listItem' + index}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {iconPosition === 'start' && item.icon && (
                  <div style={{ display: 'flex', marginRight: '6px' }}>
                    {item.icon}
                  </div>
                )}
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary ? item.secondary : null}
                />
                {iconPosition === 'end' && item.icon && item.icon}
              </div>
              {buttonIcon && (
                <IconButton
                  edge="end"
                  onClick={() => handleIconClick && handleIconClick(item)}
                >
                  {buttonIcon}
                </IconButton>
              )}
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CustomList;
