import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Spinner } from '../components/Spinner/Spinner';
import { Text } from '../components/Texts/Text';
import { useTextsPrefix } from '../context/TextContext';
import {
  AdminUserList,
  getAllUsers,
  updateUser,
} from '../utils/admin';
import { FetchError } from '../utils/fetchApi';
import {
  AuthenticatedUser,
  isAdmin,
} from '../utils/useUserStatus';
import styles from './Admin.module.css';

type FetchingStatus =
  | {
      status: 'empty';
    }
  | {
      status: 'fetching';
    }
  | {
      status: 'error';
      error: FetchError;
    }
  | {
      status: 'ok';
      users: AdminUserList[];
    };

interface Props {
  userStatus: AuthenticatedUser;
}

export const AdminView = ({ userStatus }: Props) => {
  const [userFetch, setUserFetch] = useState<FetchingStatus>({
    status: 'empty',
  });

  const texts = useTextsPrefix('ADMIN');

  useEffect(() => {
    const { status } = userFetch;
    if (status === 'empty') {
      setUserFetch({
        status: 'fetching',
      });
      getAllUsers(userStatus)
        .then((users) => {
          setUserFetch({
            status: 'ok',
            users,
          });
        })
        .catch((error) => {
          console.log(error);
          setUserFetch({
            status: 'error',
            error,
          });
        });
    }
  }, [userStatus, userFetch]);

  if (!isAdmin(userStatus)) {
    return <Redirect to="/" />;
  }
  const { status } = userFetch;
  return (
    <div>
      <Text value="TITLE" texts={texts} tag="h3" />
      {status === 'fetching' ? (
        <Spinner />
      ) : status === 'error' ? (
        <div>En feil skjedde: {userFetch.error.statusText}</div>
      ) : status === 'ok' ? (
        <Users userStatus={userStatus} users={userFetch.users} />
      ) : (
        <></>
      )}
    </div>
  );
};

interface UserProps {
  userStatus: AuthenticatedUser;
  users: AdminUserList[];
}

const Users = ({ userStatus, users }: UserProps) => {
  const [localUsers, setLocalUsers] = useState([...users]);

  const updateUsersLocal = (user: AdminUserList) => {
    const newUsers = [...localUsers];
    const oldUser = newUsers.find((usr) => usr.id === user.id);
    if (oldUser) {
      const index = newUsers.indexOf(oldUser);
      newUsers[index] = user;
      setLocalUsers(newUsers);
    }
  };

  return (
    <div className={styles.grid}>
      <div className={styles.entry}>ID</div>
      <div className={styles.entry}>Email</div>
      <div className={styles.entry}>Admin</div>
      {localUsers.map((user) => {
        return (
          <UserEntry
            key={user.id}
            user={user}
            userStatus={userStatus}
            updateUserLocal={updateUsersLocal}
          />
        );
      })}
    </div>
  );
};

const UserEntry = ({
  user,
  userStatus,
  updateUserLocal,
}: {
  user: AdminUserList;
  userStatus: AuthenticatedUser;
  updateUserLocal: (user: AdminUserList) => void;
}) => {
  const isAdmin = user.roles.includes('admin');

  return (
    <>
      <div className={styles.entry}>{user.id}</div>
      <div className={styles.entry}>{user.username}</div>
      <div className={styles.entry}>
        <select
          value={isAdmin ? 'yes' : 'no'}
          disabled={user.id === userStatus.user.uid}
          onChange={async (event) => {
            const value = event.target.value;
            const newUser = await updateUser(userStatus, {
              ...user,
              roles: value === 'yes' ? ['admin'] : [],
            });
            updateUserLocal(newUser);
          }}
        >
          <option value={'yes'}>Yes</option>
          <option value={'no'}>No</option>
        </select>
      </div>
    </>
  );
};
