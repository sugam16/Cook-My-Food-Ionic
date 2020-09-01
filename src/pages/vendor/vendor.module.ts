import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { VendorPage } from "./vendor";
import { PipesModule } from "../../app/pipes.module";

@NgModule({
  declarations: [VendorPage],
  imports: [IonicPageModule.forChild(VendorPage), PipesModule],
  exports: [VendorPage]
})
export class VendorPageModule {}
