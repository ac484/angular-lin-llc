import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-shared-fluid',
  standalone: true,
  imports: [FluidModule],
  templateUrl: './fluid.component.html',
  styleUrls: ['./fluid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedFluidComponent {} 