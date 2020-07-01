import React, { RefObject } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { Button } from '@material-ui/core';
import { IUser } from './user.model';
import { AuthenticationService } from '../../../../services/authentication.service';
import Toastr from '../../../Common/Toastr/Toastr';
import moment from 'moment';
import { PageLoading } from '../../../Common/PageLoading/PageLoading';
import ConfirmDialog from '../../../Common/ConfirmDialog/ConfirmDialog';
 

export interface IState {
    loading: boolean;
    deleteDialogOpen: boolean;
    users?: IUser[];
  }

export default class Users extends React.Component<any, IState> {
    
  public state: IState = { 
    loading : true, 
    deleteDialogOpen : false, 
  };

  users: IUser[] = [];
  authenticationService: AuthenticationService = new AuthenticationService();
  toastrRef : RefObject<Toastr>;
  selectedRow? : any;
  
 
   columns: IDataTableColumn<IUser>[] = [
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
      center: true,
    },
    {
      name: 'Utolsó bejelentkezés',
      selector: 'lastLogin',
      format: (row: any) => moment(row.lastLogin).format('YYYY.MM.DD hh:mm:ss'),
      sortable: true,
      center: true,
    },
    {
      name: 'Telefonszám',
      selector: 'phoneNumber',
      sortable: true,
      center: true,
    },
    {
      name: 'Hírlevél',
      selector: 'newsletter',
      sortable: true,
      center: true,
      format: (row: any) => <p>{row.newsletter ? "igen" : "nem" }</p>
    },
    {
      name: 'Foglalási szabályok elfogadva',
      selector: 'reservationRuleAccepted',
      sortable: true,
      center: true,
      format: (row: any) => <p>{row.reservationRuleAccepted ? "igen" : "nem" }</p>
    },
    {
        name: '',
        ignoreOnRowClick: true,
        allowOverflow: true,
        button: true,
        cell:(row: any) => <Button onClick={_ => this.onUserDeleteClick(row.id)}>Törlés</Button>
    },
  ];
    
  constructor (props: any) {
    super(props);
    
    this.toastrRef = React.createRef();
    this.onUserDeleteClick = this.onUserDeleteClick.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.doDelete = this.doDelete.bind(this);
    this.setDeleteDialogOpen = this.setDeleteDialogOpen.bind(this);
  }
    
    componentDidMount() {
      this.getUsers();
    }

    getUsers() {
      const url = `${process.env.REACT_APP_API_PATH}/user`;
      const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token },
      };
      
    fetch(url, requestOptions)
      .then(async response => {
        const data: IUser[] = await response.json();
        if (!response.ok) {
            this.toastrRef.current?.openSnackbar("Nem sikerült a felhasználók lekérése! Kérjük próbálja meg újra később!", "error");
          } else {
          }
          this.setState({loading: false, users: data });
        })
        .catch(error => {
          this.toastrRef.current?.openSnackbar("Nem sikerült az felhasználók lekérése! Kérjük próbálja meg újra később!", "error");
        });
    }

    onUserDeleteClick(args: any){
      this.selectedRow = args;
      this.setState({deleteDialogOpen: true});
    }

    setDeleteDialogOpen(open: boolean){
      this.setState({deleteDialogOpen: open});
    }

    doDelete(){
      if (this.selectedRow){
        this.setState({loading: true});
          
        const requestOptions = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 
                     'Authorization': 'Bearer ' + this.authenticationService.instance().currentUserSubject.getValue().token }
        };
          
        fetch(process.env.REACT_APP_API_PATH+'/user/'+this.selectedRow.toString(), requestOptions)
          .then(async response => {
            if (!response.ok) {
              this.toastrRef.current?.openSnackbar("Sikertelen törlés! Kérjük próbálja meg újra később!", "error");
            } else {
              this.getUsers();
              this.toastrRef.current?.openSnackbar("Sikeres törlés!", "success");
            }
            this.setState({loading: false});
          })
          .catch(error => {
              this.toastrRef.current?.openSnackbar("Sikertelen törlés! Kérjük próbálja meg újra később!", "error");
            });
      }
    }

  render() {
    return (
      <div>
        <PageLoading show={this.state.loading}></PageLoading>
        <DataTable
          title="Felhasználók"
          responsive={true}
          columns={this.columns}
          data={this.state.users as []}
          keyField="id"
          striped={true}
          highlightOnHover={true}
          pointerOnHover={true}
          pagination={true}
          fixedHeader={true}
          progressPending={this.state.loading}
          progressComponent={<></>}
          paginationComponentOptions={{rowsPerPageText: "találat oldalanként: ", rangeSeparatorText: "az összesből: "}}
        />
        <ConfirmDialog
          title="Megerősítés"
          open={this.state.deleteDialogOpen}
          setOpen={this.setDeleteDialogOpen}
          onConfirm={this.doDelete}
        >
          Biztos, hogy törli a felhasználót? Minden adata véglegesen elvész!
        </ConfirmDialog>
        <Toastr ref={this.toastrRef}></Toastr>
      </div>
    )
  }
};