import React from 'react';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';
import LivingText from '../../Common/LivingText/LivingText';

// import './news.scss';

export default class Services extends React.Component<any>{
    public render() {

      return (
        <><LivingText livingTextType={LivingTextTypeEnum.Services}></LivingText></>
        );
    }
}