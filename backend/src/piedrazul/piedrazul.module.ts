import { Module } from '@nestjs/common';
import { PiedrazulStore } from './piedrazul.store';

@Module({
  providers: [PiedrazulStore],
  exports: [PiedrazulStore],
})
export class PiedrazulModule {}
