import { Request, https } from 'firebase-functions';
import { auth, initializeApp } from 'firebase-admin';

interface User extends auth.DecodedIdToken {
  roles?: string[];
}

initializeApp();

const toApiUser = (user: auth.UserRecord) => ({
  id: user.uid,
  username: user.email,
  roles: user.customClaims?.roles || [],
});

const getAllUsers = async () => {
  const users = await auth().listUsers();
  return users.users.map(toApiUser);
};

const isAdmin = (userToken: User): boolean => {
  return !!userToken.roles?.includes('admin');
};

const getUserToken = async (
  request: Request
): Promise<User | undefined> => {
  const authToken =
    request.headers.authorization?.split('Bearer ')[1];
  if (authToken) {
    try {
      return (await auth().verifyIdToken(authToken)) as User;
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }
  return;
};

const getUserRecord = async (uid: string) => {
  try {
    return await auth().getUser(uid);
  } catch {
    return undefined;
  }
};

exports.user = https.onRequest(async (request, response) => {
  const userToken = await getUserToken(request);
  if (userToken) {
    if (!isAdmin(userToken)) {
      response.status(403);
      response.json({
        error: 403,
        message: 'Access forbidden',
      });
      return;
    }

    if (request.method === 'GET') {
      response.json(await getAllUsers());
    } else if (request.method === 'PUT') {
      const body = JSON.parse(request.body);

      const userRecord = await getUserRecord(body.id);
      if (userRecord) {
        const claims = userRecord.customClaims || { roles: [] };
        const roles = body.roles || (claims.roles as string[]);
        const newClaims = {
          ...claims,
          roles,
        };
        console.log('new claims', newClaims);
        console.log('user id ', userRecord.uid);
        try {
          await auth().setCustomUserClaims(
            userRecord.uid,
            newClaims
          );
          await auth().revokeRefreshTokens(userRecord.uid);
          console.log('CLAIMS SET');
          response.status(200);
          response.json(
            toApiUser({
              ...userRecord,
              customClaims: newClaims,
              toJSON: async () => '',
            })
          );
        } catch (error) {
          response.status(500);
          response.json({
            error: 500,
            message: 'Unable to update user',
          });
        }
      } else {
        response.status(404);
        response.json({
          error: 404,
          message: 'User not found',
        });
      }
    } else {
      response.status(405);
      response.json({
        error: 405,
        message: 'Method not allowed',
      });
    }
  } else {
    response.status(401);
    response.json({
      error: 401,
      message: 'Not authorized',
    });
  }
});

// exports.validatePost = firestore
//   .document('post/{postId}')
//   .onCreate(async (snapshot) => {
//     console.log('creating new post');
//     console.log(snapshot.data());
//   });
