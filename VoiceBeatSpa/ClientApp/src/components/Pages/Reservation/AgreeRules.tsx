import React from 'react';
import Agree from '../../Common/Agree/Agree';
import { Button, Container } from '@material-ui/core';

export interface IState {
    agreed: boolean;
  }

export default class AgreeRules extends React.Component<any, IState>{
  
    public state: IState = { agreed : false };

    constructor (props:any){
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({agreed: event.target.checked});
    }
    onClick(){
    }

    public render() {

      return (
        <div>
        <Container>
         <Agree text="Szabályok elfogadása" handleChange={this.handleChange}></Agree>
         <Button className="accept-rules-btn" onClick={this.props.onAcceptRules} disabled={!this.state.agreed}>OK</Button>
        </Container>
        </div>
        );
    }
}