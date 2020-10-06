import React, { RefObject } from 'react';

import { AuthenticationService } from '../../../../services/authentication.service';
import Toastr from '../../../Common/Toastr/Toastr';
import { PageLoading } from '../../../Common/PageLoading/PageLoading';
import { UploadForm } from '../../../Common/FileUpload/fileUpload';
import { Guid } from 'guid-typescript';

export interface IState {
    loading : boolean,
  }

export default class AAT extends React.Component<any, IState>{
  public state: IState = { loading : true };
                                
  authenticationService: AuthenticationService = new AuthenticationService();
  toastrRef : RefObject<Toastr>;

  selectedImageId: Guid = Guid.createEmpty();
    
  constructor(props: any) {
    super(props);
    
    this.uploadBegin = this.uploadBegin.bind(this);
    this.uploadEnd = this.uploadEnd.bind(this);
    this.toastrRef = React.createRef();
  }

  public componentDidMount() {
      this.setState({loading:false});
  }


  uploadBegin(){
    this.setState({loading:true});
  }

  uploadEnd(){
    this.setState({loading : false});
  }
  
  public render() {

    return (
      <div>
        <PageLoading show={this.state.loading}></PageLoading>
        <div>
          {this.state.loading
           ? <></> 
           : <div> 
                <UploadForm fileType={1} imageType={0} uploadBegin={this.uploadBegin} uploadEnd={this.uploadEnd}></UploadForm>
                <br />
          </div>}
        </div>
        <Toastr ref={this.toastrRef}></Toastr>
      </div>
      );
    }
}