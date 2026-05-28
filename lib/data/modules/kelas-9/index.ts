import type { GradeModule } from "../types";
import { mDailyCommunication } from "./01-daily-communication";
import { mAskingInfo } from "./02-asking-information";
import { mOpinion } from "./03-opinion";
import { mDescriptiveK9 } from "./04-descriptive";
import { mFunctionalText } from "./05-functional-text";
import { mRecount } from "./06-recount";
import { mTenses } from "./07-tenses";
import { mPublicPlaces } from "./08-public-places";
import { mShoppingK9 } from "./09-shopping";
import { mProcedure } from "./10-procedure";

export const KELAS_9_MODULES: GradeModule[] = [
  mDailyCommunication,
  mAskingInfo,
  mOpinion,
  mDescriptiveK9,
  mFunctionalText,
  mRecount,
  mTenses,
  mPublicPlaces,
  mShoppingK9,
  mProcedure,
];
