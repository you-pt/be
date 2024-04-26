import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class MessageService {
  constructor(
    private readonly config: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    const firebase_params = {
      type: this.config.get<string>('FIREBASE_TYPE'),
      projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
      privateKeyId: this.config.get<string>('FIREBASE_PRIVATE_KEY_ID'),
      privateKey: this.config.get<string>('FIREBASE_PRIVATE_KEY'),
      clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
      clientId: this.config.get<string>('FIREBASE_CLIENT_ID'),
      authUri: this.config.get<string>('FIREBASE_AUTH_URI'),
      tokenUri: this.config.get<string>('FIREBASE_TOKEN_URI'),
      authProviderX509CertUrl: this.config.get<string>(
        'FIREBASE_AUTH_CERT_URL',
      ),
      clientC509CertUrl: this.config.get<string>('FIREBASE_CLIENT_CERT_URL'),
    };
    admin.initializeApp({
      credential: admin.credential.cert(firebase_params),
    });
  }

  async fcm(token: string, title: string, message: string) {
    const payload = {
      token: token,
      notification: {
        title: title,
        body: message,
      },
      data: {
        body: message,
      },
    };
    console.log(payload);
    const result = await admin
      .messaging()
      .send(payload)
      .then((response) => {
        return { sent_message: response };
      })
      .catch((error) => {
        return { error: error.code };
      });

    return result;
  }

  async addCronJob(
    token: string,
    title: string,
    message: string,
    ptTime: Date,
    id: string,
  ) {
    const job = new CronJob(new Date(`${ptTime}`), async () => {
      const payload = {
        token: token,
        notification: {
          title: title,
          body: message,
        },
        data: {
          body: message,
        },
      };
      console.log(payload);
      const result = await admin
        .messaging()
        .send(payload)
        .then((response) => {
          return { sent_message: response };
        })
        .catch((error) => {
          return { error: error.code };
        });
    });

    this.schedulerRegistry.addCronJob(id, job);
    job.start();
  }
}
