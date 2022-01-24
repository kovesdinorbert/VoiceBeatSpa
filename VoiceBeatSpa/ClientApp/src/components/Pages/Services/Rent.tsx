import React from 'react';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';
import LivingText from '../../Common/LivingText/LivingText';
import { Images } from '../../Common/Images/Images';
import { IImageSettings } from '../../Common/Images/imageSettings.model';
import { ImageTypeEnum } from '../../Common/Images/imageTypeEnum';

export default class ServicesRent extends React.Component<any>{
    public render() {
      let imageSettings : IImageSettings = {
        colCount: 2,
        showTitle: false,
        showBody: false,
        width:"auto",
        cssProperties: {
          width: "100%",
          maxHeight: "auto"
        },
        useCarousel: true
      }

      return (
        <div>
          <><LivingText livingTextType={LivingTextTypeEnum.ServicesRent}></LivingText></>
          <><Images imageSettings={imageSettings} imageType={ImageTypeEnum.RentsPicture}></Images></>
        </div>
        );
    }
}