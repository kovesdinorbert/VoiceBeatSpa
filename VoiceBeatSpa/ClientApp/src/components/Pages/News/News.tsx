import React from 'react';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';
import LivingText from '../../Common/LivingText/LivingText';

export default class News extends React.Component<any>{
    public render() {

      return (
        <><LivingText livingTextType={LivingTextTypeEnum.DiscountsText}></LivingText></>
        );
    }
}