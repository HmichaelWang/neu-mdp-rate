import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MdpRateComponent } from './mdp-rate';


@NgModule({
  declarations: [
    MdpRateComponent,
  ],
  imports: [
    IonicModule
  ],
  exports:[MdpRateComponent]
})
export class MdpRateModule {}
