import React from 'react';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';
import LivingText from '../../Common/LivingText/LivingText';

import './news.scss';

export default class News extends React.Component<any>{
    public render() {

      return (
        <div className="news-container">
          <LivingText livingTextType={LivingTextTypeEnum.DiscountsText}></LivingText>
        </div>
        );
    }
}