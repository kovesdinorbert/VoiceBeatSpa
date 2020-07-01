import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { CircularProgress } from '@material-ui/core';
import BlockUi from 'react-block-ui';

export const PageLoading = (props:any) => 
<Dialog open={props.show} aria-labelledby="form-dialog-title">
  <BlockUi tag="div" blocking={props.show}>
    <DialogContent>
      <CircularProgress />
    </DialogContent>
  </BlockUi>
</Dialog>