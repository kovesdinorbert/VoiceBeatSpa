import React from 'react'
import { post } from 'axios';
export class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'get-id-from-somewhere',
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