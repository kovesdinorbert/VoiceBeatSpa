import React from 'react';
import { ImageTypeEnum } from '../../Common/Images/imageTypeEnum';
import { Images } from '../../Common/Images/Images';
import { IImageSettings } from '../../Common/Images/imageSettings.model';
import { FormattedMessage } from 'react-intl';
import LivingText from '../../Common/LivingText/LivingText';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';

export default class Gray extends React.Component<any>{
    public render() {
      let imageSettings : IImageSettings = {
        colCount: 2,
        showTitle: false,
        showBody: false,
        width:"auto",
        height:"450px",
        cssProperties: {
          width: "auto",
          height: "450px"
        },
        useCarousel: true
      }

      return (
        <div>
          <>
            <div className="row">
              <div className="col-md-8">
                <h4><FormattedMessage id="roomsGray" defaultMessage={'Szürke terem'}/> - 20 &#13217; </h4>
              </div>
              <div className="col-md-4">
                <h4><LivingText livingTextType={LivingTextTypeEnum.GrayRoomPrice}></LivingText></h4>
              </div>
            </div>
            <p><LivingText livingTextType={LivingTextTypeEnum.GrayRoomText}></LivingText></p>
          </>
          <><Images imageSettings={imageSettings} imageType={ImageTypeEnum.GrayRoomPicture}></Images></>
        </div>
        );
    }
}