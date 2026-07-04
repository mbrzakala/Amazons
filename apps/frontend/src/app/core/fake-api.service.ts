import { Injectable } from '@angular/core';

// All fake-data methods have been removed — the frontend now uses real API data.
// The class shell remains to avoid breaking any stale DI references during transition.
// Safe to delete entirely once no imports remain.
@Injectable({ providedIn: 'root' })
export class FakeApiService {
}
