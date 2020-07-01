import React, { Component } from 'react';
import { IImage } from "./imageCard.model";
    
export class ImageCard extends Component<any, IImage> {
    render () {

      return (
         <div className="card">
             {this.props.imageSettings.showTitle ?? <div className="title">{this.props.image.title}</div>}
             {this.props.image.fileContent &&
                 <div className="image">
                     <img src={'data:'+this.props.image.mimeType+';base64,' + this.props.image.fileContent} alt={this.props.title}  style={this.props.imageSettings.cssProperties}/>
                 </div>
             }
             {this.props.imageSettings.showBody ?? <div className="body">{this.props.image.body}</div>}
         </div>
      );
    }
  }
  
  export default ImageCard
  