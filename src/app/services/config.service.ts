import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ConfigService {

  conifgAPIURL = "http://localhost:3000/_/";

  constructor () {}

}