import React from 'react';
import { IImage } from './imageCard.model';
import ImageCard from './ImageCard';
import { ImageTypeEnum } from './imageTypeEnum';
import { CircularProgress } from '@material-ui/core';
import { Guid } from 'guid-typescript';

export interface IState {
    loading: boolean;
    images: IImage[];
}

export class Images extends React.Component<any, IState>{

    public state: IState = {
        loading: true,
        images: [{body:"", id: Guid.create(), fileContent:"", title: "", imageType: ImageTypeEnum.AboutPagePicture, loading: true, mimeType:""}],
    };

    _isMounted = false;

    public componentDidMount() {
      this._isMounted = true;

      fetch(process.env.REACT_APP_API_PATH+'/filedocument/images/'+this.props.imageType)
        .then((res) => { 
          if (this._isMounted && res.ok) {
            res.json().then((files: IImage[]) => {
              this.setState({loading : false, images : files})
              }
            );
          }
        });
    }

    componentWillUnmount() {
      this._isMounted = false;
    }
    
    public render() {    
      let colC = "col-md-" + (12 / (this.props.imageSettings.colCount ? this.props.imageSettings.colCount : 12));
      let imageContents = this.state.loading
        ? <CircularProgress />
        : this.state.images.map(image => (
            <div className={colC} key={'c-'+image.id.toString()}>
              <div className="card-content">
                <ImageCard image={image} key={image.id.toString()} imageSettings={this.props.imageSettings}></ImageCard>
              </div>
            </div>
        ));

      return (
        <div className="row">
          {imageContents}
        </div>
      );
    }
}

export default Images