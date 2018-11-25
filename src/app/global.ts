import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Http, Response, Headers, RequestOptions, ResponseContentType, RequestMethod  } from '@angular/http';

@Injectable()
export class Global {

    public databaseURL : string = "http://localhost:8084";

    public sessionWarningMinutes : number = 1;

    //Regx Patterns for Validations
    public emailPattern : string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"; 
    public phonePattern : string = "^[6-9]{1}[0-9]{9}$";

    public putOptions = new RequestOptions({
        headers: new Headers({'Content-Type':'application/json'}),
        method: RequestMethod.Put,
        responseType: ResponseContentType.Json,
        withCredentials: false
    });
    
    public postOptions = new RequestOptions({
        headers: new Headers({'Content-Type':'application/json'}),
        method: RequestMethod.Post,
        responseType: ResponseContentType.Json,
        withCredentials: false
    });

    public httpOptions = {
        headers: new HttpHeaders({ 
          'Access-Control-Allow-Origin':'*',
          'Authorization':'authkey',
          'Access-Control-Allow-Headers':'X-Requested-With,content-type',
          'Content-Type':'application/json; charset=utf-8'
        })
    };

    //Method for converting JSON format from Java interface to Angular accepted form 
    public jsonFormating(data): JSON{
        return JSON.parse(JSON.stringify(data).replace(/\\r\\n/g, "").replace(/\\"/g, '"').replace(/\\t/g,"").replace(/\s\s+/g, " ").replace(/"{/g,"{").replace(/}"/g,"}"));
    }

    //Method to convert object to array
    public generateArray(obj){
        return Object.keys(obj).map((key)=>{ return obj[key]});
    }

}