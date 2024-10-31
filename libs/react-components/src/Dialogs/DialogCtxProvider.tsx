import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import InfoDialog from './InfoDialog';

export const DialogType = {
  CONFIRM: 'confirm',
  INFO: 'info',
} as const;

export type DialogTypeKey = (typeof DialogType)[keyof typeof DialogType];

export type DialogContextType = {
  getConfirmation: (config: DialogConfigType) => Promise<boolean>;
};

export const DialogContext = createContext<DialogContextType>(
  {} as DialogContextType
);

type DialogConfigType = {
  type: DialogTypeKey;
  title: string;
  message?: string;
  content?: ReactNode;
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      'useConfirmDialog context was used outside of its Provider'
    );
  }
  return context;
};

export function DialogCtxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    show: boolean;
    config: DialogConfigType;
  }>({
    show: false,
    config: { type: 'info', title: '', message: '', content: null },
  });

  const resolver = useRef<(value: boolean) => void>();

  const handleShow = (config: DialogConfigType): Promise<boolean> => {
    setState({ show: true, config });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  };

  const modalContext: DialogContextType = {
    getConfirmation: handleShow,
  };

  const handleOk = () => {
    if (resolver.current) resolver.current(true);
    handleClose();
  };

  const handleCancel = () => {
    if (resolver.current) resolver.current(false);
    handleClose();
  };

  const handleClose = () => setState((prev) => ({ ...prev, show: false }));

  const {
    show,
    config: { type, title, message, content },
  } = state;

  const dialog =
    type === 'info' ? (
      <InfoDialog
        open={show}
        title={title}
        contentText={message}
        onClose={handleClose}
      >
        {content}
      </InfoDialog>
    ) : (
      <ConfirmDialog
        disableEscapeKeyDown
        open={show}
        title={title}
        contentText={message}
        okFunc={handleOk}
        cancelFunc={handleCancel}
        onClose={handleCancel}
      >
        {content}
      </ConfirmDialog>
    );

  return (
    <DialogContext.Provider value={modalContext}>
      {children}
      {dialog}
    </DialogContext.Provider>
  );
}
