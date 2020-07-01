import React from "react";

import MomentUtils from '@date-io/moment';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import moment from "moment";

export interface IState {
  selectedValue: moment.Moment;
}


export class ResTimePicker extends React.Component<any, IState>{
    
  public state: IState = { 
    selectedValue : moment(undefined), 
  };

  constructor(props: any) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.setState({selectedValue: moment()})
  }

  handleDateChange(date: any) {
    this.setState({ selectedValue: moment(date) });
  };

  public render() {    
      console.log(this.props.time.toString());
      return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
        <TimePicker
        id="time"
        label={this.props.label}
        minutesStep={30}
        okLabel="OK"
        cancelLabel="Mégse"
        type="time"
        value={moment(this.props.time)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 1800,
        }}
        onChange={this.handleDateChange}
      />
      </MuiPickersUtilsProvider>
      );
    }
}

export default ResTimePicker
