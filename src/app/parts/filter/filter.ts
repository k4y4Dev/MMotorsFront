import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { FilterFormModel } from '../../_models/form-models';
import { CarService } from '../../_services/car-service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter implements OnInit, OnDestroy {

  private carService = inject(CarService);
  private filterChange$ = new Subject<FilterFormModel>();

  filterFormModel = signal<FilterFormModel>({ km: 200000, price: 200000 });

  ngOnInit(): void {
    this.filterChange$
      .pipe(debounceTime(400))
      .subscribe(filters => this.carService.applyFilters(filters));
  }

  ngOnDestroy(): void {
    this.filterChange$.complete();
  }

  onFilterChange(key: keyof FilterFormModel, event: Event): void {
    this.filterFormModel.update(f => ({
      ...f,
      [key]: +(event.target as HTMLInputElement).value
    }));
    this.filterChange$.next(this.filterFormModel()); // ← émet, le debounce gère le reste
  }
}