export class userEvent{
    constructor(
      public _id:string,
      public  title:string,
      public  start:Date,
      public  end:Date,
      public  engineer:any,
      public  job:string,
      public  address:string,
      public  applicant:any,
      public  isAccepted:boolean,
    ){}
}