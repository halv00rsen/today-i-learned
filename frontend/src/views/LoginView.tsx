import { useState } from 'react';
import { Redirect } from 'react-router';
import { useUserStatus } from '../utils/useUserStatus';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../firebase';
import { useTextsPrefix } from '../context/TextContext';
import { getText, Text } from '../components/Texts/Text';
import { Button } from '../components/Button/Button';

const inputStyle: React.CSSProperties = {
  margin: '0 0 1em',
  padding: '0.5em',
};

export const LoginView = () => {
  const userStatus = useUserStatus();
  const texts = useTextsPrefix('LOGIN');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [logError, setLogError] = useState('');

  const login = () => {
    signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    ).catch((err) => {
      setLogError(err.message || err.status || Object.keys(err));
      console.log(err);
      setError(true);
      setPassword('');
    });
  };

  if (userStatus.type === 'AUTHENTICATED') {
    return <Redirect to="/" />;
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Text value="TITLE" texts={texts} tag="h3" />
      {error && <Text value="ERROR" texts={texts} tag="div" />}
      {logError && <div>{logError}</div>}
      <input
        type="text"
        name="email"
        value={email}
        style={inputStyle}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={getText({
          texts,
          value: 'EMAIL.PLACEHOLDER',
        })}
      />
      <input
        type="password"
        name="password"
        value={password}
        style={inputStyle}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={getText({
          texts,
          value: 'PASSWORD.PLACEHOLDER',
        })}
      />
      <Button onClick={login} name="submit">
        <Text value="ACTION" texts={texts} />
      </Button>
    </div>
  );
};
