import { questions } from './questions';

// Identity F question counts — used for normalizing the Ft vs Fp sub-score
const FT_COUNT = questions.filter(q => q.direction === 'Ft').length; // 3
const FP_COUNT = questions.filter(q => q.direction === 'Fp').length; // 2

export function calculateResult(responses) {
  const scores = {
    mentalHealth: { E: 0, W: 0 },
    socialStatus: { D: 0, M: 0 },
    identity: { G: 0, Ft: 0, Fp: 0 },
    connection: { C: 0, L: 0 },
  };

  questions.forEach(q => {
    const response = responses[q.id];
    if (response == null) return;

    if (q.category === 'identity') {
      scores.identity[q.direction] += response;
    } else {
      scores[q.category][q.direction] += response;
    }
  });

  const mh = scores.mentalHealth.E >= scores.mentalHealth.W ? 'E' : 'W';
  const ss = scores.socialStatus.D >= scores.socialStatus.M ? 'D' : 'M';
  const cn = scores.connection.C >= scores.connection.L ? 'C' : 'L';

  // G vs total F
  const gScore = scores.identity.G;
  const fScore = scores.identity.Ft + scores.identity.Fp;
  const identityMain = gScore >= fScore ? 'G' : 'F';

  // If F, normalize Ft and Fp by question count to fairly compare
  const ftAvg = scores.identity.Ft / FT_COUNT;
  const fpAvg = scores.identity.Fp / FP_COUNT;
  const fSubtype = ftAvg >= fpAvg ? 'Ft' : 'Fp';

  return {
    code: `${mh}${ss}${identityMain}${cn}`,
    fSubtype: identityMain === 'F' ? fSubtype : null,
    scores,
  };
}