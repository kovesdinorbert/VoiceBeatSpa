import React, { RefObject } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';
import BlockUi from 'react-block-ui';
import * as signalR from '@aspnet/signalr';

import { IEvent }from "./event.model";

import './main.scss'
import Scheduler from './Scheduler';
import { RoomTypeEnum } from './roomTypeEnum';
import moment from 'moment';
import { AuthenticationService } from '../../../services/authentication.service';
import { Guid } from 'guid-typescript';
import Toastr from '../../Common/Toastr/Toastr';
import { PageLoading } from '../../Common/PageLoading/PageLoading';
import { LanguageService } from '../../../services/language.service';

export interface IState {
    showScheduler: boolean;
    blocking: boolean;
    selectedDate?: Date;
    selectedDateStr?: string;
    selectedStartStr?: string;
    selectedEndStr?: string;
    selectedRoom?: RoomTypeEnum;
    events?: any;
    onDayEvents?: IEvent[];
  }

export default class Reservation extends React.Component<any, IState>{
    
  public state: IState = { 
      showScheduler : false, 
      blocking : false, 
      selectedDate : undefined ,
      selectedDateStr : undefined 
  };

  everyEvents: IEvent[] = [];

  authenticationService: AuthenticationService = new AuthenticationService();
  languageService: LanguageService = new LanguageService();
  calendarRef : RefObject<FullCalendar>;
  toastrRef : RefObject<Toastr>;

  connection: signalR.HubConnection; 

  constructor (props: any) {
      super(props);

      this.handleDateClick = this.handleDateClick.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.submitReservation = this.submitReservation.bind(this);
      this.getReservations = this.getReservations.bind(this);
      this.mapToCalendarEvents = this.mapToCalendarEvents.bind(this);

      this.calendarRef = React.createRef();
      this.toastrRef = React.createRef();

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("/eventhub", { accessTokenFactory: () => this.authenticationService.instance().currentUserSubject.getValue().token })
        .build();
  }
  
  componentDidMount() {
    this.getReservations();
    
    if (this.authenticationService.instance().currentUserSubject.getValue().token) {
      this.connection.start();
      this.connection.on('sendToAll', (e) => {
        this.getReservations();
      });
    }
  }
  
  async getReservations() {
    if (!this.calendarRef?.current)  return;

    this.setState({showScheduler: false, blocking: true, selectedDate : undefined, selectedDateStr : undefined });
    
    let start = moment(this.calendarRef?.current?.getApi().view.activeStart).toISOString();
    let end = moment(this.calendarRef?.current?.getApi().view.activeEnd).toISOString();

    const url = `${process.env.REACT_APP_API_PATH}/event/`+start+'/'+ end;
    const requestOptions = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
    };
    
  fetch(url, requestOptions)
    .then(async response => {
      const data: IEvent[] = await response.json();
      if (!response.ok) {
        if (response.status == 401) {
          this.toastrRef.current?.openSnackbar("message.success.reservation.reserve", "success");
          this.authenticationService.instance().logout();
          } 
          this.toastrRef.current?.openSnackbar("message.unsuccess.reservation.getevents", "error");
        } else {
        }

        this.everyEvents = data;

        this.setState({showScheduler: false, blocking: false, selectedDate : undefined, selectedDateStr : undefined, events: this.mapToCalendarEvents(data, false) });
      })
      .catch(error => {
        this.toastrRef.current?.openSnackbar("message.unsuccess.reservation.getevents", "error");
        this.authenticationService.instance().logout();
      });
  }

  handleDateClick(args: any){
    var filtered = this.everyEvents.filter(
      event => moment(event.startDate).utc(true).toDate() >= moment(args.date).utc(true).toDate()
              && moment(event.startDate).utc(true).toDate() <= moment(args.date).utc(true).add(1, 'days').toDate());

      this.setState({showScheduler: true, selectedDate: args.date, selectedDateStr: args.dateStr, onDayEvents: filtered});
  } 
  
  handleClose() {
    if (!this.state.blocking) {
      this.setState({showScheduler: false, blocking: false, selectedDate : undefined, selectedDateStr : undefined });
    }
  };
  
  async submitReservation(e: any, start: any, end: any, selectedRoom: RoomTypeEnum, subject: string, deleteEventId?: Guid) {
    e.preventDefault();

    let url = `${process.env.REACT_APP_API_PATH}/event`+'/'+this.languageService.instance().currentLanguageCode;
    this.setState({showScheduler: true, blocking: true, selectedDate : undefined, selectedDateStr : undefined });
  
    if (!deleteEventId) {
      let newEvent: IEvent = {
        subject: subject,
        description: 'description',
        startDate: moment(start).utc(true).toDate(),
        endDate: moment(end).utc(true).toDate(),
        room: selectedRoom
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
                   'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
        body: JSON.stringify(newEvent)
      };
    

      this.connection
      .invoke('sendToAll', JSON.stringify(newEvent))
      .catch(err => console.error(err));

      fetch(url, requestOptions)
        .then(async response => {
          if (!response.ok) {
            this.toastrRef.current?.openSnackbar("message.unsuccess.reservation.reserve", "error");
          } else {
            this.toastrRef.current?.openSnackbar("message.success.reservation.reserve", "success");
            this.connection.invoke('sendToAll', "add").catch();
          }
          this.setState({showScheduler: false, blocking: false, selectedDate : undefined, selectedDateStr : undefined });
        })
        .catch(error => {
            this.toastrRef.current?.openSnackbar("message.unsuccess.reservation.reserve", "error");
          });
    } else {
      url += '/' + deleteEventId.toString();
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
      };
    
      fetch(url, requestOptions)
        .then(async response => {
          if (!response.ok) {
            this.toastrRef.current?.openSnackbar("message.unsuccess.reservation.delete", "error");
          } else {
            this.toastrRef.current?.openSnackbar("message.success.reservation.delete", "success");

            this.connection.invoke('sendToAll', "delete").catch();
          }
          this.setState({showScheduler: false, blocking: false, selectedDate : undefined, selectedDateStr : undefined });
        })
        .catch(error => {
          this.toastrRef.current?.openSnackbar("message.unsuccess.reservation.delete", "error");
        });
    }
  }

  mapToCalendarEvents(events?: IEvent[], isScheduler?: boolean) {
    return events == null || events.length == 0 
      ? {} 
      : events.map((event: any) =>( { id: event.id,
                                      title: isScheduler ? event.subject : '\n' + event.subject,
                                      start: event.startDate,
                                      end: event.endDate,
                                      className: isScheduler ? '' : 'room-class-' + event.room.toString().toLowerCase(),
                                      resourceId: RoomTypeEnum[event.room] }));
  }

  public render() {
    const currentUser = this.authenticationService.instance().currentUserSubject.getValue();
    return (
      <div>
        <><PageLoading show={this.state.blocking}></PageLoading>
            <FullCalendar
              ref={this.calendarRef} 
              locale={this.languageService.instance().currentLanguageCode}
              defaultView="dayGridMonth"
              header={{
                left: 'prev,next',
                center: 'title',
                right: ''
              }}
              select={this.handleDateClick} 
              buttonText={{
                  today: this.languageService.instance().currentLanguageCode=='en' ? "Today" : "Ma"
              }}
              editable={false}
              firstDay={1}
              dateClick={this.handleDateClick} 
              plugins={[ dayGridPlugin, interactionPlugin  ]}
              events={this.state.events}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit'
              }}
              displayEventTime={true}
              displayEventEnd={true}
              eventLimit={4}
              eventLimitText={"további"}
              height="auto"
              datesRender={this.getReservations}
            />
          </>
         <Dialog open={this.state.showScheduler} onClose={this.handleClose} aria-labelledby="form-dialog-title" maxWidth={"md"} fullWidth={true} className="reservation-dialog">
         <BlockUi tag="div" blocking={this.state.blocking}>
           <DialogContent>
             {this.state.blocking
             ? <CircularProgress />
             : <Scheduler isAdmin={this.authenticationService.instance().isAdmin(currentUser.token)} userEmail={currentUser.email} userPhone={currentUser.phoneNumber}
                          selectedDate={this.state.selectedDate}
                          onDayEvents={this.mapToCalendarEvents(this.state.onDayEvents, true)}
                          submitReservation={this.submitReservation}
                          handleClose={this.handleClose}>
               </Scheduler>
             }
            </DialogContent>
         </BlockUi>
       </Dialog>
        <Toastr ref={this.toastrRef}></Toastr>
      </div>
      );
  }
}