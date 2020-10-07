import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import './footer.css';

export interface IState {
}

export default class Footer extends Component<any, IState> {

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
        <div>
            <div className="text-light aat-div" onClick={this.download}><FormattedMessage id="aat" defaultMessage={'Adatvédelmi szabályzat'}/></div>
        </div>
      </footer>
    );
  }
}
