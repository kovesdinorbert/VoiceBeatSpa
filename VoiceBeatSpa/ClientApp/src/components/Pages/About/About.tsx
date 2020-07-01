import React from 'react';
import { LivingText } from '../../Common/LivingText/LivingText';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';
import { ImageTypeEnum } from '../../Common/Images/imageTypeEnum';
import { Images } from '../../Common/Images/Images';
import { IImageSettings } from '../../Common/Images/imageSettings.model';

export default class About extends React.Component<any>{
    public render() {
      let imageSettings : IImageSettings = {
        colCount: 2,
        showTitle: false,
        showBody: false,
        cssProperties: {
          width: "100%",
          height: "auto",
          marginBottom: "25px"
        }
      }

      return (
        <div>
          <><LivingText livingTextType={LivingTextTypeEnum.StartPageText}></LivingText></>
          <><Images imageType={ImageTypeEnum.AboutPagePicture} imageSettings={imageSettings}></Images></>
          <><LivingText livingTextType={LivingTextTypeEnum.PricesText}></LivingText></>
        </div>
        );
    }
}