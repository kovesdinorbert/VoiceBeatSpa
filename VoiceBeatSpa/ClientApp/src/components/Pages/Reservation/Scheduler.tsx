import React, { RefObject } from 'react';
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import TimePicker from 'rc-time-picker';
import moment, { Moment } from "moment";
import '@fullcalendar/timegrid/main.css'
import './scheduler.css'
import 'rc-time-picker/assets/index.css';
import { Button, Select, MenuItem } from '@material-ui/core';
import { RoomTypeEnum } from './roomTypeEnum';
import { Guid } from 'guid-typescript';
import { LanguageService } from '../../../services/language.service';
import { FormattedMessage } from 'react-intl';
import { AuthenticationService } from '../../../services/authentication.service';
import TextInput from '../../Common/TextInput/TextInput';

export interface IState {
  selectedStartStr?: string;
  selectedEndStr?: string;
  selectedStart?: Date;
  selectedEnd?: Date;
  selectedRoom: RoomTypeEnum;
  deleteEventId?: Guid;
  subject?: string,
  isAdmin: boolean,
  showReservationWarning: boolean,
}

export default class Scheduler extends React.Component<any, IState>{

  public state: IState = {selectedRoom: RoomTypeEnum.Room1, isAdmin: false, showReservationWarning: false};
  schedulerRef : RefObject<FullCalendar>;
  languageService: LanguageService = new LanguageService();
  authenticationService: AuthenticationService = new AuthenticationService();

    constructor (props: any) {
        super(props);
        this.onEventSelected = this.onEventSelected.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.startPickerChange = this.startPickerChange.bind(this);
        this.endPickerChange = this.endPickerChange.bind(this);
        this.handleRoomChange = this.handleRoomChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        
        this.schedulerRef = React.createRef();
    }

    componentDidMount() {
      this.setState({selectedStart: this.props.selectedDate, selectedEnd: this.props.selectedDate});
      
      let admin = this.authenticationService.instance().isAdmin( this.authenticationService.instance().currentUserSubject.getValue().token);
      if (!admin) {
        let reservationHandlingPossible = admin || moment().add(3, 'days').isSameOrBefore(this.props.selectedDate, 'day');
        this.setState({subject: this.authenticationService.instance().currentUserSubject.getValue().email, isAdmin: admin, showReservationWarning: !reservationHandlingPossible});
      } else {
        this.setState({isAdmin: admin});
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

    formatTime(time: Date): string {
      if (!time) return "";
      let hours = time.getHours() > 9  ? time.getHours().toString() : "0" + time.getHours();
      let minutes = time.getMinutes() > 9  ? time.getMinutes().toString() : "0" + time.getMinutes();
      return hours + ":" + minutes;
    }

    startPickerChange(newValue: any) {
      if (newValue) {
        this.schedulerRef?.current?.getApi().select({start: newValue.toDate(), end: this.state.selectedEnd , allDay: false , resourceId: this.state.selectedRoom?.toString() });
      }
    }

    endPickerChange(newValue: any) {
      if (newValue) {
        this.schedulerRef?.current?.getApi().select({start: this.state.selectedStart, end: newValue.toDate(), allDay: false , resourceId: this.state.selectedRoom?.toString() });
      }
    }

    handleRoomChange = (event: any) => {
      event.preventDefault();
      this.schedulerRef?.current?.getApi().select({start: this.state.selectedStart, end: this.state.selectedEnd , allDay: false , resourceId: event.target.value == 0 ? "0" : event.target.value });
    }
    
    handleSubjectChange(subj: string) {
      let cState = this.state;
      cState.subject = subj;
      this.setState(cState);
    }

    public render() {
      return (
        <div>
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
            // height={1150}
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
            resources={ [
                { id: RoomTypeEnum.Room1.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Red room' : 'Piros terem', eventColor: 'crimson' },
                { id: RoomTypeEnum.Room2.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Blue room' : 'Kék terem', eventColor: 'blue' },
                { id: RoomTypeEnum.Room3.toString(), title: this.languageService.instance().currentLanguageCode == 'en' ? 'Gray room': 'Szürke terem', eventColor: 'gainsboro' },
            ]}
            events={this.props.onDayEvents}
            select={this.onEventSelected}
            eventClick={this.onEventClick}
          />
          <div className="pull-right">
            <div className="row">
              <> 
                <TimePicker value={moment(this.state.selectedStart)} showSecond={false} minuteStep={30} disabled={true} onChange={this.startPickerChange}/>
                <div style={{marginLeft:"25px",marginRight:"25px"}}>-</div>
                <TimePicker  value={moment(this.state.selectedEnd)} showSecond={false} minuteStep={30} disabled={true} onChange={this.endPickerChange}/>
                <div style={{marginLeft:"25px",marginRight:"25px"}}>-</div>
                <div>       
                  <Select value={this.state.selectedRoom ? this.state.selectedRoom : RoomTypeEnum.Room1} disabled={true} onChange={this.handleRoomChange}>
                    <MenuItem value={RoomTypeEnum.Room1}><FormattedMessage id="roomsRed" defaultMessage={'Piros terem'}/></MenuItem>
                    <MenuItem value={RoomTypeEnum.Room2}><FormattedMessage id="roomsBlue" defaultMessage={'Kék terem'}/></MenuItem>
                    <MenuItem value={RoomTypeEnum.Room3}><FormattedMessage id="roomsGray" defaultMessage={'Szürke terem'}/></MenuItem>
                  </Select>
                </div>
              </>
            </div>
            
            <div className="row">
              {this.state.isAdmin 
              ? <TextInput config={{
                   label: <FormattedMessage id="x" defaultMessage={'Foglalási név'}/>,
                   id: "aSubject",
                   error: false,
                   success: false,
                   white: false,
                   type: 'text',
                   }} value={this.state.subject} onInputValueChange={this.handleSubjectChange}>
                </TextInput>
              : this.state.showReservationWarning ? <FormattedMessage id="reservationPossible" defaultMessage={'Foglalás és időpont törlés csak minimum 2 nappal korábban lehetséges!'}/>
                                                  : <></>}
            </div>

            <div className="row">
              {this.state.deleteEventId 
              ?<Button onClick={e => this.props.submitReservation(e, 
                                                                 this.state.selectedStartStr, 
                                                                 this.state.selectedEndStr, 
                                                                 this.state.selectedRoom, 
                                                                 this.state.subject,
                                                                 this.state.deleteEventId )} 
                      color="primary" disabled={!this.state.isAdmin && moment().add(2, 'days').isSameOrAfter(this.state.selectedStart, 'day')}>
                <p><FormattedMessage id="delete" defaultMessage={'Törlés'}/></p>
              </Button>
              : <Button onClick={e => this.props.submitReservation(e, 
                                                                 this.state.selectedStartStr, 
                                                                 this.state.selectedEndStr, 
                                                                 this.state.selectedRoom, 
                                                                 this.state.subject,
                                                                 this.state.deleteEventId )} 
                      color="primary"  disabled={!this.state.isAdmin && moment().add(2, 'days').isSameOrAfter(this.state.selectedStart, 'day')}>
                <p><FormattedMessage id="reservation" defaultMessage={'Foglalás'}/></p>
              </Button>}
              <Button onClick={this.props.handleClose} color="primary">
                <p><FormattedMessage id="cancel" defaultMessage={'Mégse'}/></p>
              </Button>
            </div>

           </div>
        </div>
        );
    }
}