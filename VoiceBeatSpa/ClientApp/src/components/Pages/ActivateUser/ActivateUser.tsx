import React, { RefObject } from 'react';
import Toastr from '../../Common/Toastr/Toastr';
import { PageLoading } from '../../Common/PageLoading/PageLoading';
import About from '../About/About';

export interface IState {
    blocking : boolean, 
  }

export default class ActivateUser extends React.Component<any>{
    public state: IState = {
      blocking : true, 
    };
    
    toastrRef : RefObject<Toastr>;

    constructor(props: any) {
      super(props);
      
      this.toastrRef = React.createRef();
    }

    public componentDidMount() {
        let url = `${process.env.REACT_APP_API_PATH}/user/activateuser`;
        
        this.setState({blocking: true });
        
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.props.location.search.toString().replace('?',''))
        };
          
        fetch(url, requestOptions)
          .then(async response => {
            if (!response.ok) {
              this.toastrRef.current?.openSnackbar("Sikertelen aktiválás!", "error");
              } else {
                this.toastrRef.current?.openSnackbar("Sikeres aktiválás, most már bejelentkezhet!", "success");
              }
              this.setState({blocking: false });
            })
            .catch(error => {
              this.setState({blocking: false});
              this.toastrRef.current?.openSnackbar("Sikertelen aktiválás!", "error");
            });
    }

    public render() {
      return (
        <div>
          <PageLoading show={this.state.blocking}></PageLoading>
          <About></About>
          <Toastr ref={this.toastrRef}></Toastr>
        </div>
        );
    }
}