export class vehicleEvent{
    constructor(
  public _id:string,
  public title:String,
  public start:Date,
  public end:Date,
  public vehicle:any,
  public driver:any,
  public destination:String,
  public applicant:any,
  public isAccepted:Boolean,
    ){}
}