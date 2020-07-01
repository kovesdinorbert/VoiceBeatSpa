import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormattedMessage } from 'react-intl';

const ConfirmDialog = (props: any) => {
  const { title, children, open, setOpen, onConfirm } = props;
  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => {setOpen(false); onConfirm();}} color="default">
          <FormattedMessage id="ok" defaultMessage={'Ok'}/>
        </Button>
        <Button variant="contained" onClick={() => setOpen(false)} color="secondary">
          <FormattedMessage id="cancel" defaultMessage={'Mégse'}/>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;