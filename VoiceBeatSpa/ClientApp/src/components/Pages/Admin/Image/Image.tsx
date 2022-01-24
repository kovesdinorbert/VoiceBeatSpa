import React, { RefObject } from 'react';
import { Button, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';

import { AuthenticationService } from '../../../../services/authentication.service';
import Toastr from '../../../Common/Toastr/Toastr';
import { PageLoading } from '../../../Common/PageLoading/PageLoading';
import { ImageTypeEnum } from '../../../Common/Images/imageTypeEnum';
import { IImageSettings } from '../../../Common/Images/imageSettings.model';
import { IImage } from '../../../Common/Images/imageCard.model';
import ImageCard from '../../../Common/Images/ImageCard';
import { UploadForm } from '../../../Common/FileUpload/fileUpload';
import { Guid } from 'guid-typescript';
import ConfirmDialog from '../../../Common/ConfirmDialog/ConfirmDialog';

export interface IState {
    loading : boolean,
    imageType?: ImageTypeEnum,
    images?: IImage[],
    deleteDialogOpen: boolean
  }
  
  const imageSettings : IImageSettings = {
    colCount: 3,
    showTitle: false,
    showBody: false,
    cssProperties: {
      width: "300px",
      height: "auto",
      marginBottom: "25px"
    }
  };

export default class Image extends React.Component<any, IState>{
  public state: IState = { loading : true, deleteDialogOpen: false };
                                
  authenticationService: AuthenticationService = new AuthenticationService();
  toastrRef : RefObject<Toastr>;

  selectedImageId: Guid = Guid.createEmpty();
    
  constructor(props: any) {
    super(props);
    
    this.getImages = this.getImages.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.uploadBegin = this.uploadBegin.bind(this);
    this.uploadEnd = this.uploadEnd.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.setDeleteDialogOpen = this.setDeleteDialogOpen.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    
    this.toastrRef = React.createRef();
  }

  public componentDidMount() {
      this.setState({loading:false});
  }

  private handleTypeChange = (event: any) => {
    event.preventDefault();
    if (event.target.value !== "-1"){
      this.setState({loading:true});
      this.getImages(event.target.value == 0 ? "0" : event.target.value);
    } else {
      this.setState({loading:false, images: undefined, imageType: undefined});
    }
  }

  private getImages(type: ImageTypeEnum) {
    fetch(process.env.REACT_APP_API_PATH+'/filedocument/images/'+type)
      .then((res) => { 
        if (res.ok) {
          res.json().then((files: IImage[]) => {
            this.setState({loading : false, imageType: type, images : files})
            }
          );
        } else {
          this.setState({loading : false, imageType: type, images : undefined})
          this.toastrRef.current?.openSnackbar("message.unsuccess.load", "error");
        }
      });
  }

  private deleteImage() {
    let id = this.selectedImageId;
    let type = this.state.imageType;
    if (type){
      this.setState({loading: true});
     
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 
                   'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token }
      };
     
      fetch(process.env.REACT_APP_API_PATH+'/filedocument/'+id, requestOptions)
        .then(async response => {
          if (!response.ok) {
            this.toastrRef.current?.openSnackbar("message.unsuccess.delete", "error");
          } else {
            this.getImages(type ?? ImageTypeEnum.AboutPagePicture);
            this.toastrRef.current?.openSnackbar("message.success.delete", "success");
          }
          this.setState({loading: false});
        })
        .catch(error => {
            this.toastrRef.current?.openSnackbar("message.unsuccess.delete", "error");
          });
    }
  }

  uploadBegin(){
    this.setState({loading:true});
  }

  uploadEnd(type: ImageTypeEnum){
    this.getImages(type);
  }

  onDeleteClick(id: Guid){
    if (id != Guid.createEmpty()){
      this.selectedImageId = id;
      this.setState({deleteDialogOpen: true});
  }
  }

  setDeleteDialogOpen(open: boolean){
    this.setState({deleteDialogOpen: open});
  }
  
  public render() {

    return (
      <div>
        <PageLoading show={this.state.loading}></PageLoading>
        <div>
          <FormControl variant="filled">
            <InputLabel htmlFor="text-type-select">Típus</InputLabel>
            <Select value={this.state.imageType ?? "-1"} onChange={this.handleTypeChange} inputProps={{ name: 'Típus', id: 'text-type-select' }}>
              <MenuItem value="-1">nincs kiválasztva</MenuItem>
              <MenuItem value={ImageTypeEnum.AboutPagePicture}>Startlap</MenuItem>
              <MenuItem value={ImageTypeEnum.BlueRoomPicture}>Kék terem</MenuItem>
              <MenuItem value={ImageTypeEnum.GrayRoomPicture}>Szürke terem</MenuItem>
              <MenuItem value={ImageTypeEnum.RedRoomPicture}>Piros terem</MenuItem>
              <MenuItem value={ImageTypeEnum.StudioPicture}>Stúdió</MenuItem>
            </Select>
          </FormControl>
          {this.state.loading
           ? <></> 
           : <div> 
                <UploadForm fileType={0} imageType={this.state.imageType} uploadBegin={this.uploadBegin} uploadEnd={this.uploadEnd}></UploadForm>
                <br />
                {this.state.images == null ? <></> : this.state.images.map(image => (
                  <div key={'c-'+image.id.toString()}>
                    <div className="row">
                      <div className="col-6">
                        <div className="card-content">
                          <ImageCard image={image} key={image.id.toString()} imageSettings={imageSettings}></ImageCard>
                        </div>
                      </div>
                      <div className="col-6">
                        <Button onClick={_ => this.onDeleteClick(image.id)}>Törlés
                        </Button>
                      </div>
                    </div> 
                  </div>
                ))}
          </div>}
        </div>
        <ConfirmDialog
          title="Megerősítés"
          open={this.state.deleteDialogOpen}
          setOpen={this.setDeleteDialogOpen}
          onConfirm={this.deleteImage}
        >
          Biztos, hogy törli a képet?
        </ConfirmDialog>
        <Toastr ref={this.toastrRef}></Toastr>
      </div>
      );
    }
}