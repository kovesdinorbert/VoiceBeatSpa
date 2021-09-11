import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { VersionService } from '../../../services/version.service';
import './footer.css';

export interface IState {
}

export default class Footer extends Component<any, IState> {
  versionService = new VersionService();

  constructor (props: any) {
    super(props);
    
    this.download = this.download.bind(this);
  }
  
  public componentDidMount() {
  }

  download() {
    window.open(process.env.REACT_APP_API_PATH+'/filedocument/files/1', '_blank' );
  }

  render () { 
    return (
      <footer>
        <div className="fb-g-1"></div>
        <div className="text-light aat-div fb-g-2 text-alig-c" onClick={this.download}><FormattedMessage id="aat" defaultMessage={'Adatvédelmi szabályzat'}/></div>
        <div className="text-light version-number fb-g-1 text-alig-r">{this.versionService.getCurrentVersionNumber()}</div>
      </footer>
    );
  }
}
