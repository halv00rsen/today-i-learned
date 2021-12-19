import { useState } from 'react';
import { Redirect } from 'react-router';
import { useUserStatus } from '../utils/useUserStatus';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../firebase';
import { useTextsPrefix } from '../context/TextContext';
import { getText, Text } from '../components/Texts/Text';

export const LoginView = () => {
  const userStatus = useUserStatus();
  const texts = useTextsPrefix('LOGIN');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const login = () => {
    signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    ).catch((err) => {
      console.log(err);
      setError(true);
      setPassword('');
    });
  };

  if (userStatus.type === 'AUTHENTICATED') {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <Text value="TITLE" texts={texts} tag="h3" />
      {error && <Text value="ERROR" texts={texts} tag="div" />}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={getText({
          texts,
          value: 'EMAIL.PLACEHOLDER',
        })}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={getText({
          texts,
          value: 'PASSWORD.PLACEHOLDER',
        })}
      />
      <button onClick={login}>
        <Text value="ACTION" texts={texts} />
      </button>
    </div>
  );
};
