import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { IToastrSettings } from './toastr.settings';
import { FormattedMessage } from 'react-intl';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class Toastr extends Component<any, IToastrSettings> {
    public state: IToastrSettings = { message: "",
                                      open: false,
                                      severity: "warning" };

    constructor(props: any) {
      super(props);
      
       this.handleClose = this.handleClose.bind(this);
       this.openSnackbar = this.openSnackbar.bind(this);
    }
    
    handleClose = () => {
        this.setState({
        open: false,
        message: 'id'
        });
    };

    openSnackbar = ( message: string, severity: 'success' | 'info' | 'warning' | 'error' ) => {
        this.setState({ open: true, message: message, severity: severity });
    };


  render () {
  return (
    <div>
      <Snackbar open={this.state.open} autoHideDuration={5000} onClose={this.handleClose}>
        <Alert onClose={this.handleClose} severity={this.state.severity}>
          <FormattedMessage id={this.state.message} defaultMessage={this.state.message}/>
        </Alert>
      </Snackbar>
    </div>
  )};
};
export default Toastr;