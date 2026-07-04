import { Injectable, InjectionToken, inject } from '@angular/core';

const FAKE_API_URL = '/fake-api';
const REAL_API_URL = '/api';

export type FeatureScope = 'default' | 'problem' | 'pipeline' | 'evaluation';

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

export interface ApiConfig {
  useFakeApi: boolean;
  realApiUrl: string;
  featureOverrides?: Partial<Record<FeatureScope, boolean>>;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  useFakeApi: false,
  realApiUrl: REAL_API_URL,
};

@Injectable({ providedIn: 'root' })
export class ConfigProvider {
  private readonly config = inject(API_CONFIG, { optional: true }) ?? DEFAULT_API_CONFIG;

  fakeApiUrl(): string {
    return FAKE_API_URL;
  }

  apiUrl(): string {
    return this.resolveUrl('default');
  }

  apiUrlForFeature(feature: FeatureScope): string {
    return this.resolveUrl(feature);
  }

  isFakeApi(): boolean {
    return this.resolveUseFake('default');
  }

  isFakeApiForFeature(feature: FeatureScope): boolean {
    return this.resolveUseFake(feature);
  }

  private resolveUseFake(feature: FeatureScope): boolean {
    const overrides = this.config.featureOverrides;
    if (overrides && feature in overrides) {
      return overrides[feature]!;
    }
    return this.config.useFakeApi;
  }

  private resolveUrl(feature: FeatureScope): string {
    return this.resolveUseFake(feature) ? this.fakeApiUrl() : this.config.realApiUrl;
  }
}
