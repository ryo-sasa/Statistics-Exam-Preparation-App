import { LEVELS } from './levels.js';
import { topics2kyu } from './topics-2kyu.js';
import { topicMle } from './topics-mle.js';
import { topicNonparametric } from './topics-nonparametric.js';
import { topicMarkov } from './topics-markov.js';
import { topicBrownian } from './topics-brownian.js';
import { topicTimeseries } from './topics-timeseries.js';
import { topicCluster } from './topics-cluster.js';
import { topicPca } from './topics-pca.js';
import { topicFactor } from './topics-factor.js';
import { topicAnova } from './topics-anova.js';
import { topicSampling } from './topics-sampling.js';
import { topicConditional } from './topics-conditional.js';
import { topicQualreg } from './topics-qualreg.js';
import { topicSurvival } from './topics-survival.js';
import { topicMgf } from './topics-mgf.js';
import { topicPoissonProcess } from './topics-poisson-process.js';
import { topicBayes } from './topics-bayes.js';
import { topicMvnormal } from './topics-mvnormal.js';
import { topicIncomplete } from './topics-incomplete.js';
import { topicMultreg } from './topics-multreg.js';
import { topicContingency } from './topics-contingency.js';
import { topicGraphical } from './topics-graphical.js';
import { topicOtherMv } from './topics-other-mv.js';
import { topicDiscriminant } from './topics-discriminant.js';
import { topics1kyu } from './topics-1kyu.js';
import { questions2kyu } from './questions-2kyu.js';
import { questionsJun1kyu } from './questions-jun1kyu.js';
import { questions1kyu } from './questions-1kyu.js';

const topicsJun1kyu = [
  topicMle, topicNonparametric, topicMarkov, topicBrownian,
  topicTimeseries, topicCluster, topicPca, topicFactor,
  topicAnova, topicSampling, topicConditional, topicQualreg,
  topicSurvival, topicMgf, topicPoissonProcess, topicBayes,
  topicMvnormal, topicIncomplete, topicMultreg, topicContingency,
  topicGraphical, topicOtherMv, topicDiscriminant
];

export const TOPICS = {
  "2kyu": topics2kyu,
  "jun1kyu": topicsJun1kyu,
  "1kyu": topics1kyu,
};

export const QUESTIONS = {
  "2kyu": questions2kyu,
  "jun1kyu": questionsJun1kyu,
  "1kyu": questions1kyu,
};

export { LEVELS };
