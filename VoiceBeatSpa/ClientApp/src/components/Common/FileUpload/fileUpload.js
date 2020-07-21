import React from 'react'
import { post } from 'axios';
import { AuthenticationService } from '../../../services/authentication.service';

export class UploadForm extends React.Component {
  authenticationService = new AuthenticationService();
  constructor(props) {
    super(props);
    this.state = {
      id: 'up-id',
      file: null,
    };
  }
  async submit(e) {
    this.props.uploadBegin();
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_PATH}/filedocument/`;
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('fileType', this.props.fileType);
    formData.append('imageType', this.props.imageType);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token
      },
    };
    try {
      await post(url, formData, config);;
      this.props.uploadEnd(this.props.imageType);
    } catch (error) {
    }
  }
  setFile(e) {
    this.setState({ file: e.target.files[0] });
  }

  render() {
    return (
      <form onSubmit={e => this.submit(e)}>
        <h1>Fájl feltöltés</h1>
        <input type="file" onChange={e => this.setFile(e)} />
        <button type="submit">Feltöltés</button>
      </form>
    );
  }
}