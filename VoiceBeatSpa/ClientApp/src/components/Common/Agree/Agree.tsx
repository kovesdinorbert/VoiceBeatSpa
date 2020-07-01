import React, { Component } from 'react';
import { Checkbox } from '@material-ui/core';

export class Agree extends Component<any> {
    constructor(props:any){
        super(props);

        this.handleChange=this.handleChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>){
        this.props.handleChange(event);
    }

  render () {
    return (
      <>
        <Checkbox onChange={this.handleChange}></Checkbox>
        {this.props.text}
      </>
    );
  }
}

export default Agree