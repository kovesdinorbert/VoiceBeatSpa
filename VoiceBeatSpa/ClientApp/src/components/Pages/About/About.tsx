import React from 'react';
import { LivingText } from '../../Common/LivingText/LivingText';
import { LivingTextTypeEnum } from '../../Common/LivingText/livingTextTypeEnum';
import { ImageTypeEnum } from '../../Common/Images/imageTypeEnum';
import { Images } from '../../Common/Images/Images';
import { IImageSettings } from '../../Common/Images/imageSettings.model';
import Card from '@material-ui/core/Card';
import { CardContent, Typography, CardHeader, Divider } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import './about.scss';

export default class About extends React.Component<any>{
    public render() {
      let imageSettings : IImageSettings = {
        colCount: 2,
        showTitle: false,
        showBody: false,
        cssProperties: {
          width: "100%",
          height: "auto",
        }
      }

      return (
        <div className="about-container">
          <><LivingText livingTextType={LivingTextTypeEnum.StartPageText}></LivingText></>
          <><Images imageType={ImageTypeEnum.AboutPagePicture} imageSettings={imageSettings}></Images></>
          <br />
          <><LivingText livingTextType={LivingTextTypeEnum.PricesText}></LivingText></>
          <div className="row">
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="rehearsalRoom" defaultMessage={'Próbaterem'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.RedRoomPrice}></LivingText>
                  </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="roomsStudio" defaultMessage={'Stúdió'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.StudioPrice}></LivingText>
                  </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="mastering" defaultMessage={'Mastering'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.MasterPrice}></LivingText>
                  </CardContent>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="rehearsalRecord" defaultMessage={'Próbák felvétele'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.RehearsalRecord}></LivingText>
                  </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="onemanRehearsal" defaultMessage={'Egyszemélyes próba'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.OnemanRehearsal}></LivingText>
                  </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="monthlyRoom" defaultMessage={'Havi díjas próbaterem'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.MonthlyRoom}></LivingText>
                  </CardContent>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="newEvent" defaultMessage={'Rendezényszervezés'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.NewEvent}></LivingText>
                  </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="customEvent" defaultMessage={'Magánrendezvény'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.CustomEvent}></LivingText>
                  </CardContent>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="price-card">
                <CardHeader title={<FormattedMessage id="rentAndShipInstrument" defaultMessage={'Hangszer bérlés és szállítás'}/>}>
                </CardHeader>
                <Divider></Divider>
                  <CardContent>
                    <LivingText livingTextType={LivingTextTypeEnum.RentAndShipInstrument}></LivingText>
                  </CardContent>
              </Card>
            </div>
          </div>
        </div>
        );
    }
}