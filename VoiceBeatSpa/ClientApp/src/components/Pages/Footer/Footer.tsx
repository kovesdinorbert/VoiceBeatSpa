import React, { Component } from 'react';
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
            <a className="text-light" onClick={this.download} href={''} target='_blank'>Adatvédelmi szabályzat</a>
        </div>
      </footer>
    );
  }
}
