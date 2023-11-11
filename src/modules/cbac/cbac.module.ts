import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import {
  CbacModuleAsyncOptions,
  CbacModuleFactory,
  CbacModuleOptions,
} from './interfaces/cbac-options.interface';
import { CBAC_MODULE_OPTIONS } from './constants/cbac-module.constants';
import { CbacService } from './cbac.service';
import { CbacAsyncLocalStorage } from './cbac-async-local-storage.provider';

@Global()
@Module({})
export class CbacModule {
  public static forRoot<C, P>(options: CbacModuleOptions<C, P>): DynamicModule {
    return {
      module: CbacModule,
      providers: [
        { provide: CBAC_MODULE_OPTIONS, useValue: options },
        CbacAsyncLocalStorage,
        CbacService,
      ],
      exports: [CbacService],
    };
  }

  public static forRootAsync<C, P>(
    options: CbacModuleAsyncOptions<C, P>,
  ): DynamicModule {
    return {
      module: CbacModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        CbacService,
        CbacAsyncLocalStorage,
      ],
      exports: [CbacService],
    };
  }

  private static createAsyncProviders<C, P>(
    options: CbacModuleAsyncOptions<C, P>,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<CbacModuleFactory<C, P>>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider<C, P>(
    options: CbacModuleAsyncOptions<C, P>,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CBAC_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<
        CbacModuleFactory<C, P>
      >,
    ];

    return {
      provide: CBAC_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CbacModuleFactory<C, P>) =>
        await optionsFactory.createCbacProvider(),
      inject,
    };
  }
}
