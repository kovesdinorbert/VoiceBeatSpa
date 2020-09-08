import React, { RefObject } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { Button } from '@material-ui/core';
import { faSave  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AuthenticationService } from '../../../../services/authentication.service';
import Toastr from '../../../Common/Toastr/Toastr';
import { PageLoading } from '../../../Common/PageLoading/PageLoading';

export interface IState {
  currentText: string;
  loading: Boolean;
}

export default class Newsletter extends React.Component<any, IState>{
  public state: IState = {loading: false,
                          currentText: ''  };
  newText: string = "";
                                
  authenticationService: AuthenticationService = new AuthenticationService();
  toastrRef : RefObject<Toastr>;
    
  constructor(props: any) {
    super(props);
    
    this.saveText = this.saveText.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    
    this.toastrRef = React.createRef();
  }

  handleTextChange(content: string){
	this.newText = content;
  }

  private saveText() {
    let url = `${process.env.REACT_APP_API_PATH}/livingtext/newsletter`;
    

    this.setState({loading: true, currentText: this.newText});
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 
                 'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
      body: JSON.stringify(this.newText)
    };
    
  fetch(url, requestOptions)
    .then(async response => {
      if (!response.ok) {
        this.toastrRef.current?.openSnackbar("message.unsuccess.save", "error");
      } else {
        this.toastrRef.current?.openSnackbar("message.success.save", "success");
      }
      this.setState({loading: false, currentText: ''});
    })
    .catch(error => {
        this.toastrRef.current?.openSnackbar("message.unsuccess.save", "error");
      });
  }

  public render() {
    return (
      <div>
        <PageLoading show={this.state.loading}></PageLoading>
        <div>
          <SunEditor
            onChange={this.handleTextChange}
            autoFocus={true} 
            setOptions={{
              icons: {},
              minHeight: '300px',
              buttonList: [['undo', 'redo'],
                           ['font', 'fontSize', 'formatBlock'],
                           ['paragraphStyle', 'blockquote'], 
                           ['bold', 'underline', 'italic'], 
                           ['fontColor', 'hiliteColor', 'textStyle'],
                           ['align', 'horizontalRule', 'list', 'lineHeight'],
                           ['table', 'link', 'image', 'video'],
                           ['fullScreen', 'showBlocks', 'codeView']]
            }}
            setContents={this.state.currentText}
          >
          </SunEditor>
          <Button onClick={this.saveText} className="btn-admin-save">
            <FontAwesomeIcon className="login-brand-icon" icon={faSave} />
          </Button>
        </div>
        <Toastr ref={this.toastrRef}></Toastr>
      </div>
      );
    }
}