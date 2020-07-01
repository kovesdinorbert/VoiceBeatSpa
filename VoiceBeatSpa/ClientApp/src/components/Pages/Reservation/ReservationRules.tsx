import React from 'react';
import LivingText from '../../Common/LivingText/LivingText';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';
import AgreeRules from './AgreeRules';

export default class ReservationRules extends React.Component<any>{
    public render() {
      return (
        <div>
         <><LivingText livingTextType={LivingTextTypeEnum.ReservationRulesText}></LivingText></>
          {this.props.isUser ? <AgreeRules onAcceptRules={this.props.onAcceptRules}></AgreeRules> : <></>}
        </div>
        );
    }
}