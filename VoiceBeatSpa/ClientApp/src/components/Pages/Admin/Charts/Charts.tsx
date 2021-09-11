import React, { RefObject } from 'react';

import { AuthenticationService } from '../../../../services/authentication.service';
import Toastr from '../../../Common/Toastr/Toastr';
import { PageLoading } from '../../../Common/PageLoading/PageLoading';
import { IEvent } from '../../Reservation/event.model';
import { Pie, Bar, Line } from 'react-chartjs-2';
import moment from 'moment';
import { FormControl, InputLabel, MenuItem, Select, Button } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import { faCheck  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './charts.css';
import { RoomTypeEnum } from '../../Reservation/roomTypeEnum';

export interface IState {
    loading : boolean,
    resultsFound : boolean,
    yearSelected : number,
    selectedDate? : Date,
  }

export default class Charts extends React.Component<any, IState>{
   public state: IState = { loading : true, resultsFound : false, yearSelected : 1, selectedDate : moment().toDate() };
  everyEvents: IEvent[] = [];
                                
  authenticationService: AuthenticationService = new AuthenticationService();
  toastrRef : RefObject<Toastr>;

  pieBandPerRoom: any;
  pieHoursPerRoom: any;
  barByDay: any;
  studioByDay: any;
  lineByMonth: any;
  studioByMonth: any;
    
  constructor(props: any) {
    super(props);
    
    this.toastrRef = React.createRef();
    this.groupBy = this.groupBy.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handlePickerChange = this.handlePickerChange.bind(this);
  }

  public componentDidMount() {
    this.getReservations();
  }
  async getReservations() {
    this.setState({loading: true});

    let start;
    let end;
    if (this.state.yearSelected == 2) {
      start = moment(this.state.selectedDate).startOf('year').format('LL');
      end = moment(this.state.selectedDate).endOf('year').format('LL');
    } else {
      start = moment(this.state.selectedDate).startOf('month').format('LL');
      end = moment(this.state.selectedDate).endOf('month').format('LL');
    }

    const url = `${process.env.REACT_APP_API_PATH}/event/`+start+'/'+ end;
    const requestOptions = {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
    };

    fetch(url, requestOptions)
    .then(async response => {
      const data: IEvent[] = await response.json();
      if (!response.ok) {
          this.toastrRef.current?.openSnackbar("message.unsuccess.chart.notfound", "error");
          this.setState({loading: false, resultsFound : false});
        } else {
        this.everyEvents = data;
        
        let r1 = data.filter(event => (event.room.toString() == 'Room1' && data.filter(d => d.room.toString() == "Studio" && d.startDate == event.startDate && d.endDate == event.endDate).length == 0));
        let r2 = data.filter(event => (event.room.toString() == 'Room2' && data.filter(d => d.room.toString() == "Studio" && d.startDate == event.startDate && d.endDate == event.endDate).length == 0));
        let r3 = data.filter(event => (event.room.toString() == 'Room3' && data.filter(d => d.room.toString() == "Studio" && d.startDate == event.startDate && d.endDate == event.endDate).length == 0));

        this.pieBandPerRoom = {
            labels: [
                'Piros terem',
                'Kék terem',
                'Szürke terem',
            ],
            datasets: [{
                data: [r1.length, 
                       r2.length, 
                       r3.length],
                backgroundColor: [
                'red',
                'blue',
                'lightgray'
                ],
                hoverBackgroundColor: [
                'crimson',
                'darkblue',
                'gray'
                ],
            }]
        };
        
        this.pieHoursPerRoom = {
            labels: [
                'Piros terem',
                'Kék terem',
                'Szürke terem',
            ],
            datasets: [{
                data: [r1.reduce((acc, curr) =>  acc + (moment(curr.endDate).diff(moment(curr.startDate), 'minutes') || 0), 0) / 60, 
                       r2.reduce((acc, curr) =>  acc + (moment(curr.endDate).diff(moment(curr.startDate), 'minutes') || 0), 0) / 60, 
                       r3.reduce((acc, curr) =>  acc + (moment(curr.endDate).diff(moment(curr.startDate), 'minutes') || 0), 0) / 60],
                backgroundColor: [
                'red',
                'blue',
                'lightgray'
                ],
                hoverBackgroundColor: [
                'crimson',
                'darkblue',
                'gray'
                ],
            }]
        };
        
        let dataWithoutStudio = data.filter(event => (event.room.toString() != 'Studio' && data.filter(d => d.room.toString() == "Studio" && d.startDate == event.startDate && d.endDate == event.endDate).length == 0));
        let mapToDays = dataWithoutStudio.map(event => ((moment(event.startDate).format('dddd').toLowerCase())));
        
        this.barByDay = {
            labels: [
                'Hétfő',
                'Kedd',
                'Szerda',
                'Csütörtök',
                'Péntek',
                'Szombat',
                'Vasárnap',
            ],
            datasets: [{
                data: [mapToDays.filter(day => (day == 'monday')).length, 
                       mapToDays.filter(day => (day == 'tuesday')).length, 
                       mapToDays.filter(day => (day == 'wednesday')).length, 
                       mapToDays.filter(day => (day == 'thursday')).length, 
                       mapToDays.filter(day => (day == 'friday')).length, 
                       mapToDays.filter(day => (day == 'saturday')).length, 
                       mapToDays.filter(day => (day == 'sunday')).length], 
                       label: 'Próbák számának átlaga napokra bontva',
                       backgroundColor: 'rgba(255,99,132,0.2)',
                       borderColor: 'rgba(255,99,132,1)',
                       borderWidth: 1,
                       hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                       hoverBorderColor: 'rgba(255,99,132,1)',
            }]
        };
        
        let dataStudio = data.filter(event => (event.room.toString() == 'Studio'));
        let studioToDays = dataStudio.map(event => ((moment(event.startDate).format('dddd').toLowerCase())));
        
        this.studioByDay = {
            labels: [
                'Hétfő',
                'Kedd',
                'Szerda',
                'Csütörtök',
                'Péntek',
                'Szombat',
                'Vasárnap',
            ],
            datasets: [{
                data: [studioToDays.filter(day => (day == 'monday')).length, 
                       studioToDays.filter(day => (day == 'tuesday')).length, 
                       studioToDays.filter(day => (day == 'wednesday')).length, 
                       studioToDays.filter(day => (day == 'thursday')).length, 
                       studioToDays.filter(day => (day == 'friday')).length, 
                       studioToDays.filter(day => (day == 'saturday')).length, 
                       studioToDays.filter(day => (day == 'sunday')).length], 
                       label: 'Stúdió foglalások száma napokra bontva',
                       backgroundColor: 'rgba(255,99,132,0.2)',
                       borderColor: 'rgba(255,99,132,1)',
                       borderWidth: 1,
                       hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                       hoverBorderColor: 'rgba(255,99,132,1)',
            }]
        };

        let groupedResults = this.groupBy(dataWithoutStudio,'month');

        this.lineByMonth = {
            labels: [
                'Jan',
                'Feb',
                'Márc',
                'Máj',
                'Jún',
                'Júl',
                'Aug',
                'Szept',
                'Okt',
                'Nov',
                'Dec',
            ],
            datasets: [{
                data: [groupedResults.filter((res:any) => moment(res.date).month() == 1)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 2)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 3)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 4)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 5)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 6)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 7)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 8)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 9)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 10)[0]?.count, 
                       groupedResults.filter((res:any) => moment(res.date).month() == 11)[0]?.count,
                       groupedResults.filter((res:any) => moment(res.date).month() == 12)[0]?.count], 
                       label: 'Próbák száma hónapokra bontva',
                       fill: false,
                       lineTension: 0.1,
                       backgroundColor: 'rgba(75,192,192,0.4)',
                       borderColor: 'rgba(75,192,192,1)',
                       borderCapStyle: 'butt',
                       borderDash: [],
                       borderDashOffset: 0.0,
                       borderJoinStyle: 'miter',
                       pointBorderColor: 'rgba(75,192,192,1)',
                       pointBackgroundColor: '#fff',
                       pointBorderWidth: 1,
                       pointHoverRadius: 5,
                       pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                       pointHoverBorderColor: 'rgba(220,220,220,1)',
                       pointHoverBorderWidth: 2,
                       pointRadius: 1,
                       pointHitRadius: 10,
            }]
        };

        let groupedResultsStudio = this.groupBy(dataStudio,'month');

        this.studioByMonth = {
            labels: [
                'Jan',
                'Feb',
                'Márc',
                'Máj',
                'Jún',
                'Júl',
                'Aug',
                'Szept',
                'Okt',
                'Nov',
                'Dec',
            ],
            datasets: [{
                data: [groupedResultsStudio.filter((res:any) => moment(res.date).month() == 1)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 2)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 3)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 4)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 5)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 6)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 7)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 8)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 9)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 10)[0]?.count, 
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 11)[0]?.count,
                       groupedResultsStudio.filter((res:any) => moment(res.date).month() == 12)[0]?.count], 
                       label: 'Stúdió foglalások száma hónapokra bontva',
                       fill: false,
                       lineTension: 0.1,
                       backgroundColor: 'rgba(75,192,192,0.4)',
                       borderColor: 'rgba(75,192,192,1)',
                       borderCapStyle: 'butt',
                       borderDash: [],
                       borderDashOffset: 0.0,
                       borderJoinStyle: 'miter',
                       pointBorderColor: 'rgba(75,192,192,1)',
                       pointBackgroundColor: '#fff',
                       pointBorderWidth: 1,
                       pointHoverRadius: 5,
                       pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                       pointHoverBorderColor: 'rgba(220,220,220,1)',
                       pointHoverBorderWidth: 2,
                       pointRadius: 1,
                       pointHitRadius: 10,
            }]
        };
        
        this.setState({loading: false, resultsFound : true});
        }
      })
      .catch(error => {
        this.toastrRef.current?.openSnackbar("message.unsuccess.chart.error", "error");
        this.setState({loading: false, resultsFound : false});
      });
  }

  private groupBy(elements: any, duration: any) {
    const formatted = elements.map((elem:any) => {
      return { date: moment(elem.startDate).startOf(duration).format('YYYY-MM-DD'), count: 1 }
    })
  
    const dates = formatted.map((elem:any) => elem.date)
    const uniqueDates = dates.filter((date:any, index:any) => dates.indexOf(date) === index)
  
    return uniqueDates.map((date:any) => {
      const count = formatted.filter((elem:any) => elem.date === date).reduce((count:any, elem:any) => count + elem.count, 0)
      return { date, count }
    })
  }

  private handleIntervalChange = (event: any) => {
    event.preventDefault();
    
    this.setState({yearSelected: event.target.value});
  }

  private handlePickerChange = (event: any) => {
    this.setState({selectedDate: event});
  }
  
  public render() {

    return (
      <div>
        <PageLoading show={this.state.loading}></PageLoading>
        
        <FormControl variant="filled">
          <InputLabel htmlFor="text-type-select">Típus</InputLabel>
          <Select value={this.state.yearSelected} onChange={this.handleIntervalChange} inputProps={{ name: 'interval-select', id: 'interval-type-select' }}>
            <MenuItem value={1}>Hónap</MenuItem>
            <MenuItem value={2}>Év</MenuItem>
          </Select>
        </FormControl>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
          className="chart-date-picker"
          views={this.state.yearSelected == 2 ? ["year"]:["month"]}
          label={this.state.yearSelected == 2 ? 'Év':'Hónap'}
          value={this.state.selectedDate}
          onChange={this.handlePickerChange}
          format={this.state.yearSelected == 2 ? "YYYY":"MMMM"}
          animateYearScrolling
          />
        </MuiPickersUtilsProvider>

        <Button onClick={_ => this.getReservations()}>
          <FontAwesomeIcon className="login-brand-icon" icon={faCheck} />
        </Button>
        
        <br />
        <br />
        {this.state.loading || !this.state.resultsFound
            ? <></>
            : <div>
                <div className="row">
                  <div className="col-md-6">
                    Próbák száma termenként
                    <Pie data={this.pieBandPerRoom}  />
                  </div>
                  <div className="col-md-6">
                    Órák száma termenként
                    <Pie data={this.pieHoursPerRoom} />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-6">
                    <Bar data={this.barByDay}  />
                  </div>
                  <div className="col-md-6">
                    <Bar data={this.studioByDay}  />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    {this.state.yearSelected == 2 && <Line data={this.lineByMonth}  />}
                  </div>
                  <div className="col-md-6">
                    {this.state.yearSelected == 2 && <Line data={this.studioByMonth}  />}
                  </div>
                </div>
            </div>}
        <Toastr ref={this.toastrRef}></Toastr>
      </div>
      );
    }
}