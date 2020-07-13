import React from 'react';
import { ImageTypeEnum } from '../../Common/Images/imageTypeEnum';
import { Images } from '../../Common/Images/Images';
import { IImageSettings } from '../../Common/Images/imageSettings.model';
import { FormattedMessage } from 'react-intl';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';
import LivingText from '../../Common/LivingText/LivingText';

export default class Studio extends React.Component<any>{
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
                <h4><FormattedMessage id="roomsStudio" defaultMessage={'Stúdió'}/> </h4>
              </div>
              <div className="col-md-4">
                <h4><LivingText livingTextType={LivingTextTypeEnum.StudioRoomPrice}></LivingText> </h4>
              </div>
            </div>
            <p><LivingText livingTextType={LivingTextTypeEnum.StudioRoomText}></LivingText></p>
          </>
          <><Images imageSettings={imageSettings} imageType={ImageTypeEnum.StudioPicture}></Images></>
        </div>
        );
    }
}