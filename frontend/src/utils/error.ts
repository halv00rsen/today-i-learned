import { FirestoreErrorCode } from 'firebase/firestore';

export const getFirestoreError = (
  code: FirestoreErrorCode
): string => {
  switch (code) {
    case 'unauthenticated':
      return 'Du er ikke logget inn';
    case 'permission-denied':
      return 'Du har ikke tilgang til denne handlingen';
    case 'aborted':
    case 'already-exists':
    case 'cancelled':
    case 'data-loss':
    case 'deadline-exceeded':
    case 'failed-precondition':
    case 'internal':
    case 'invalid-argument':
    case 'not-found':
    case 'out-of-range':
    case 'resource-exhausted':
    case 'unavailable':
    case 'unimplemented':
    case 'unknown':
    default:
      return 'En feil har skjedd!';
  }
};
