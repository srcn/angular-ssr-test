import { JsonPipe } from '@angular/common';
import { Component, computed, resource, signal } from '@angular/core';

@Component({
  selector  : 'app-root',
  standalone: true,
  template  : `
    <div>
      <button (click)="updatePage()">Get data</button>
    </div>
    <div>
      Page number {{ page() }}
    </div>
    <div>
      Data:
      @if (resource.isLoading()){
        Loading...
      } @else {
<pre>{{ data() | json }}</pre>
      }
    </div>
  `,
  imports   : [
    JsonPipe,
  ],
})
export class AppComponent {
  page = signal<number>(1);
  data = computed(()=> this.resource.value());

  resource = resource({
    request: () => ({
      page: this.page()
    }),
    loader: ({request, abortSignal, previous})=> {
      return fetch(`api/users?page=${request.page}`, {
        signal: abortSignal,
        headers: new Headers([['accept', 'application/json']])
      }).then(res => res.json());
    }
  });

  updatePage() {
    this.page.update(value => value + 1);
  }
}
