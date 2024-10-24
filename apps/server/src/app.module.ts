import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './env/env.module';
import { envSchema } from './env/env';
import { HueModule } from './hue/hue.module';
import { FirestoreModule } from './firestore/firestore.module';
import { SonosModule } from './sonos/sonos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    HueModule,
    FirestoreModule,
    SonosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
