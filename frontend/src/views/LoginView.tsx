import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useUserStatus } from '../utils/useUserStatus';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../firebase';

export const LoginView = () => {
  const userStatus = useUserStatus();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = () => {
    signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    ).catch((err) => {
      console.log(err);
      setError('En feil skjedde ved innlogging');
      setPassword('');
    });
  };

  if (userStatus.type === 'AUTHENTICATED') {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <div>Logg inn</div>
      {error && <div>{error}</div>}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Epost"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passord"
      />
      <button onClick={login}>Logg inn</button>
    </div>
  );
};
