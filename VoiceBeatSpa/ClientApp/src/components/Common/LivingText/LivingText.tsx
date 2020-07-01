import React, { Component } from 'react';
import { ILivingText } from './livingText.model';
import { LivingTextTypeEnum } from './livingTextTypeEnum';
import { CircularProgress } from '@material-ui/core';
import parse from 'html-react-parser';
import { LanguageService } from '../../../services/language.service';

export interface IState {
  livingText: ILivingText;
}

export class LivingText extends Component<any, ILivingText> {
  
  public state: ILivingText = { loading : true,
                                id: "",
                                subject: "",
                                livingTextType: LivingTextTypeEnum.StartPageText,
                                isHtmlEncoded: true,
                                text: "" };
  
  _isMounted = false;
  languageService: LanguageService = new LanguageService();

  public componentDidMount() {
    this._isMounted = true;
    
    fetch(process.env.REACT_APP_API_PATH+'/livingtext/type/'+this.props.livingTextType+'/'+this.languageService.instance().currentLanguageCode)
      .then((res) => {
        if (this._isMounted && res.ok) {
          res.json().then((livingText: ILivingText) => {
            livingText.loading = false; 
            this.setState(livingText)
            }
          );
        }
      });
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

  render () {
    let parsedHtml = parse(this.state.text);
    let aboutContent = this.state.loading
      ? <CircularProgress />
      : <div contentEditable={false} suppressContentEditableWarning={true}>{parsedHtml}</div>;

    return (
      <>
      {aboutContent}
      </>
    );
  }
}

export default LivingText