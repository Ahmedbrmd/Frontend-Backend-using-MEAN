export class roomEvent{
    constructor(
  public _id:string,
  public title:String,
  public start:Date,
  public end:Date,
  public room:any,
  public applicant:any,
  public isAccepted:Boolean,
    ){}
}