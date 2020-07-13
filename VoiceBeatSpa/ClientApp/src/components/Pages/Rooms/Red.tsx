import React from 'react';
import { ImageTypeEnum } from '../../Common/Images/imageTypeEnum';
import { Images } from '../../Common/Images/Images';
import { IImageSettings } from '../../Common/Images/imageSettings.model';
import { FormattedMessage } from 'react-intl';
import LivingText from '../../Common/LivingText/LivingText';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';

export default class Red extends React.Component<any>{
    public render() {
      let imageSettings : IImageSettings = {
        colCount: 2,
        showTitle: false,
        showBody: false,
        width:"100%",
        height:"450px",
        cssProperties: {
          width: "100%",
          height: "auto",
          marginBottom: "25px"
        },
        useCarousel: true
      }

      return (
        <div>
          <>
            <div className="row">
              <div className="col-md-8">
                <h4><FormattedMessage id="roomsRed" defaultMessage={'Piros terem'}/> - 30 &#13217; </h4>
              </div>
              <div className="col-md-4">
                <h4><LivingText livingTextType={LivingTextTypeEnum.RedRoomPrice}></LivingText></h4>
              </div>
            </div>
            <p><LivingText livingTextType={LivingTextTypeEnum.RedRoomText}></LivingText></p>
          </>
          <><Images imageSettings={imageSettings} imageType={ImageTypeEnum.RedRoomPicture}></Images></>
        </div>
        );
    }
}