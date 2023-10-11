import { Dialog, DialogContent, styled } from '@mui/material';
import { PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  open: boolean;
  box?: HTMLDivElement | null;
  isFirst?: boolean;
  isLast?: boolean;
  detailMode?: boolean;
  onClose?: () => void;
}>;
const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiDialogContent-root': {
    padding: 0,
  },
}));

const ModalContainer = ({ children, open, onClose }: ModalProps) => {
  return (
    <BootstrapDialog
      PaperProps={{
        style: {
          backgroundColor: '#181818',
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '950px',
            overflowY: 'auto',
            margin:0,
            marginTop:'32px'
          },
        },
      }}
      scroll="body"
      onClose={onClose}
      open={open}
    >
      <DialogContent sx={{ overflow: 'hidden' }}>{children}</DialogContent>
    </BootstrapDialog>
  );
};

export default ModalContainer;
