import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  executeSeed() {
    return "seed Executed successfully"
  }
}
