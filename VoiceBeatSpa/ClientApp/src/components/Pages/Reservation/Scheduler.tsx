import React, { RefObject } from 'react';
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import moment, { Moment } from "moment";
import '@fullcalendar/timegrid/main.css'
import './scheduler.css'
import 'rc-time-picker/assets/index.css';
import { Button } from '@material-ui/core';
import { RoomTypeEnum } from './roomTypeEnum';
import { Guid } from 'guid-typescript';
import { LanguageService } from '../../../services/language.service';
import { FormattedMessage } from 'react-intl';
import TextInput from '../../Common/TextInput/TextInput';

export interface IState {
  selectedStartStr?: string;
  selectedEndStr?: string;
  selectedStart?: Date;
  selectedEnd?: Date;
  selectedRoom: RoomTypeEnum;
  deleteEventId?: Guid;
  subject?: string,
  showReservationWarning: boolean,
}

export default class Scheduler extends React.Component<any, IState>{

  public state: IState = {selectedRoom: RoomTypeEnum.Room1, showReservationWarning: false};
  schedulerRef : RefObject<FullCalendar>;
  languageService: LanguageService = new LanguageService();

    constructor (props: any) {
        super(props);
        this.onEventSelected = this.onEventSelected.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.checkOwnEvent = this.checkOwnEvent.bind(this);
        
        this.schedulerRef = React.createRef();
    }

    componentDidMount() {
      this.setState({selectedStart: this.props.selectedDate, selectedEnd: this.props.selectedDate});
      
      let admin = this.props.isAdmin;
      if (!admin) {
        let reservationHandlingPossible = admin || moment().add(3, 'days').isSameOrBefore(this.props.selectedDate, 'day');
        this.setState({subject: this.props.userEmail, showReservationWarning: !reservationHandlingPossible});
      } 
    }

    onEventSelected(args: any) {
      if (args.resource && args.resource.id) {
        this.setState({selectedEndStr: args.endStr, selectedStartStr: args.startStr, selectedEnd: args.end, selectedStart: args.start, selectedRoom: args.resource.id, deleteEventId: undefined});
      } 
    }

    onEventClick(args: any) {
      this.setState({selectedEndStr: args.event.end.toString(), selectedStartStr: args.event.start.toString(), selectedEnd: args.event.end, selectedStart: args.event.start, selectedRoom: args.event.getResources()[0].id, deleteEventId: args.event.id}, );
    }
    
    handleSubjectChange(subj: string) {
      let cState = this.state;
      cState.subject = subj;
      this.setState(cState);
    }

    checkOwnEvent() {
      var event = this.props.onDayEvents.filter((e: any) => e.id === this.state.deleteEventId);
      if (event && event[0] && event[0].title === this.props.userEmail) {
        return true;
      }
      return false;
    }

    public render() {
      return (
        <div>
          <div id={this.props.isAdmin ? "admin-calendar-scheduler" : "calendar-scheduler"}>
          <FullCalendar 
            ref={this.schedulerRef} 
            schedulerLicenseKey="GPL-My-Project-Is-Open-Source" 
            defaultDate={this.props.selectedDate}
            plugins={[ resourceTimeGridPlugin, interactionPlugin ]} 
            defaultView="resourceTimeGridDay"
            editable={false}
            selectable={true}
            eventLimit={false}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit'
            }}
            displayEventTime={true}
            displayEventEnd={true}
            locale={this.languageService.instance().currentLanguageCode}
            timeZone='local'
            eventOverlap={false}
            selectOverlap={false}
            allDaySlot={false}
            minTime="00:00:00"
            maxTime="24:00:00"
            unselectAuto={false}
            selectLongPressDelay={500}
            selectMirror={true}
            height={"parent"}
            header={{
                left: '',
                center: 'title',
                right: ''
              }}
            views={{
                agendaTwoDay:{
                    type: "agenda",
                    duration:{days: 2},
            }}}
            resources={ this.props.isAdmin
              ? [{ id: RoomTypeEnum.Room1.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Red room' : 'Piros terem', eventColor: '#F44336', eventClassName:"red-room" },
                { id: RoomTypeEnum.Room2.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Blue room' : 'Kék terem', eventColor: '#2196F3', eventClassName:"blue-room" },
                // { id: RoomTypeEnum.Room3.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Gray room': 'Szürke terem', eventColor: '#9E9E9E', eventClassName:"gray-room" },
                { id: RoomTypeEnum.Studio.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Studio': 'Stúdió', eventColor: 'aquamarine', eventClassName:"studio-room" },]
              : [{ id: RoomTypeEnum.Room1.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Red room' : 'Piros terem', eventColor: '#F44336', eventClassName:"red-room" },
              { id: RoomTypeEnum.Room2.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Blue room' : 'Kék terem', eventColor: '#2196F3', eventClassName:"blue-room" },
              // { id: RoomTypeEnum.Room3.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Gray room': 'Szürke terem', eventColor: '#9E9E9E', eventClassName:"gray-room" },
            ]}
            events={this.props.onDayEvents}
            select={this.onEventSelected}
            eventClick={this.onEventClick}
          /></div>
          <div className="pull-right">
            <div className="row">
              {this.props.isAdmin 
              ? <TextInput config={{
                   label: <FormattedMessage id="reserveToName" defaultMessage={'Foglalási név'}/>,
                   id: "aSubject",
                   error: false,
                   success: false,
                   required: true,
                   white: false,
                   type: 'text',
                   }} value={this.state.subject} onInputValueChange={this.handleSubjectChange}>
                </TextInput>
              : this.state.showReservationWarning ? <div className="reservation-alert-message"><br /><FormattedMessage id="reservationPossible" defaultMessage={'Foglalás és időpont törlés csak minimum 2 nappal korábban lehetséges! Kérünk keress meg telefonon!'}/><br /></div>
                  : <></>}
              { !this.props.isAdmin && this.props.userPhone === ""
                && <div className="reservation-alert-message"><br /><FormattedMessage id="reservationMissingPhoneNumber" defaultMessage={'Teremfoglalás előtt meg kell adnia a profilján a telefonszámát!'}/><br /></div>}
            </div>

            <div className="row reservation-action-button">
              {!this.state.showReservationWarning && this.state.deleteEventId 
              ? (this.checkOwnEvent() || this.props.isAdmin) && <Button onClick={e => this.props.submitReservation(e, 
                                                                 this.state.selectedStartStr, 
                                                                 this.state.selectedEndStr, 
                                                                 this.state.selectedRoom, 
                                                                 this.state.subject,
                                                                 this.state.deleteEventId )} 
                      color="primary" disabled={!this.props.isAdmin 
                                                && moment().add(2, 'days').isSameOrAfter(this.state.selectedStart, 'day')}>
                <FormattedMessage id="delete" defaultMessage={'Törlés'}/>
              </Button>
              : !this.state.showReservationWarning 
                ? <Button onClick={e => this.props.submitReservation(e, 
                                                                     this.state.selectedStartStr, 
                                                                     this.state.selectedEndStr, 
                                                                     this.state.selectedRoom, 
                                                                     this.state.subject,
                                                                     this.state.deleteEventId )} 
                          color="primary"  disabled={(this.props.isAdmin && !this.state.subject) || (!this.props.isAdmin && ( moment().add(2, 'days').isSameOrAfter(this.state.selectedStart, 'day') || this.props.userPhone === ""))}>
                    <FormattedMessage id="reservation" defaultMessage={'Foglalás'}/>
                  </Button>
                : <></>}
              <Button onClick={this.props.handleClose} color="primary">
                <FormattedMessage id="cancel" defaultMessage={'Mégse'}/>
              </Button>
            </div>

           </div>
        </div>
        );
    }
}