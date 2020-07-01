import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import { ITextInput } from "./textInput.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './style.css';
import { FormattedMessage } from "react-intl";

export interface IState {
  showRequired: boolean;
}

export class TextInput extends React.Component<any, IState>{

  public state: IState = { showRequired : false };

  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  handleChange (event: React.ChangeEvent<HTMLInputElement>){
    if (this.props.config.required && event.target.value == '') {
      this.setState({showRequired: true}) 
    }
    this.props.onInputValueChange(event.target.value);
  };

  keyPress(e: any){
    if(this.props.enterPressed && e.keyCode == 13){
      this.props.enterPressed();
    }
 }  

  public render() {    
      let conf : ITextInput = this.props.config;  

      return (
          <FormControl className="MuiFormControl-fullWidth">
            {conf.label !== undefined ? (
              <InputLabel
                htmlFor={conf.id}
              >
                {conf.label}
              </InputLabel>
            ) : null}
            <Input
              classes={{
              }}
              value={this.props.value}
              onChange={this.handleChange}
              onKeyUp={this.keyPress}
              id={conf.id}
              type={conf.type}
              endAdornment={conf.icon ? <FontAwesomeIcon className="login-brand-icon" icon={conf.icon.icon} /> : <></>}
              {...conf.otherProps}
            />
            {this.state.showRequired ? <FormattedMessage id="required" defaultMessage={'A mező kitöltése kötelező'}/> : <></>}
          </FormControl>
      );
    }
}

export default TextInput
