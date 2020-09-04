import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import { map } from "rxjs/operators";


@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {

  ordersDetails: any[] = [];
  public noOfItems: number;
  public currency: {};
  orderlist: AngularFireList<any>;

  options = [
    {
      status: "Pending",
      value: "Pending"
    },
    {
      status: "Cooking",
      value: "Cooking"
    },
    {
      status: "Ready",
      value: "Ready"
    },

    {
      status: "Cancelled",
      value: "Cancelled"
    }

  ];

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
    
  ) {
    this.currency = JSON.parse(localStorage.getItem('currency'));
    if (this.af.auth.currentUser) {
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present().then(() => {
        let userID = this.af.auth.currentUser.uid;
        this.db
        .object("/users/" + userID).valueChanges().subscribe((res: any) => {

            if(res!=null){
              console.log("Res:" +res.role);
              if(res.role=='User'){
              this.orderlist =  this.db.list("/orders",ref => ref.orderByChild("userId").equalTo(userID)); 
             }
             else{
                
                this.orderlist =  this.db.list("/orders"); 
                
             }
          
        this.orderlist.snapshotChanges()
          .pipe(
            map(changes =>
              changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
            )
          ).subscribe((res: any) => {
            this.ordersDetails = res;
            console.log("order Detail" + JSON.stringify(this.ordersDetails));
          })

            }
 
        })
        
        

        // .subscribe(
        //   (res: any) => {
        //     this.ordersDetails = [];
        //     res.forEach(item => {
        //       let temp = item.payload.val();
        //       temp["$key"] = item.payload.key;
        //       this.ordersDetails.push(temp);
        //       // console.log("orders-" + JSON.stringify(this.ordersDetails));
        //     });
        loader.dismiss();
      },
        error => {
          console.error(error);
          loader.dismiss();
        }
      );

    }
  }

  ionViewWillEnter() {
    let cart: Array<any> = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = cart != null ? cart.length : null;


  }

  isOrders(): boolean {
    return this.ordersDetails.length == 0 ? false : true;
  }

  orders(orderId, key) {
    console.log(key);
    this.navCtrl.push("OrdersPage", { orderId: orderId, orderKey: key });
  }

  isUser() {
  console.log("logged in user ="+localStorage.getItem("role"));
   // console.log(this.role);
    return localStorage.getItem("role") != 'Admin';
  }

  changeStatus(val,key,id){
   
   console.log("Status Selected:" +val);
   console.log("Key Selected:" +key);
   console.log("Id Selected:" +id);
    this.db.object("/orders/" + key).update({
          status: val
      });
   
   
  }



}
