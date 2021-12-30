import classNames from 'classnames';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { isNonEmptyArray } from '../../utils/array';
import styles from './Alert.module.css';

type AlertType = 'info' | 'error';

interface Message {
  message: string;
  type: AlertType;
}

type WithId<Type> = Type & { id: string };

interface Context {
  messages: WithId<Message>[];
  addMessage: (message: Message) => void;
}

const AlertContext = createContext<Context>({
  messages: [],
  addMessage: console.log,
});

export const useMessageAlert = () => {
  const { addMessage } = useContext(AlertContext);
  return {
    showInfoMessage: (message: string) =>
      addMessage({
        message,
        type: 'info',
      }),
    showErrorMessage: (message: string) =>
      addMessage({
        message,
        type: 'error',
      }),
  };
};

export const AlertWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<WithId<Message>[]>([]);

  const addMessage = (message: Message) => {
    setMessages([
      ...messages,
      {
        ...message,
        id: Date.now().toString(),
      },
    ]);
  };

  const removeMessage = (messageId: string) => {
    setMessages([
      ...messages.filter(({ id }) => id !== messageId),
    ]);
  };

  return (
    <AlertContext.Provider
      value={{
        messages,
        addMessage,
      }}
    >
      <div className={styles.alertWrapper}>
        {children}
        {isNonEmptyArray(messages) && (
          <div className={styles.alerts}>
            {messages.map((message) => {
              return (
                <Alert
                  close={removeMessage}
                  message={message}
                  key={message.id}
                />
              );
            })}
          </div>
        )}
      </div>
    </AlertContext.Provider>
  );
};

interface Props {
  message: WithId<Message>;
  close: (messageId: string) => void;
}

export const Alert = ({ message, close }: Props) => {
  const [status, setStatus] = useState<
    'init' | 'open' | 'closing' | 'closed'
  >('init');

  useEffect(() => {
    const timeout =
      status === 'open'
        ? setTimeout(() => {
            setStatus('closing');
          }, 5000)
        : status === 'closing'
        ? setTimeout(() => {
            setStatus('closed');
          }, 700)
        : status === 'init' &&
          setTimeout(() => {
            setStatus('open');
          }, 10);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [status]);

  useEffect(() => {
    if (status === 'closed') {
      close(message.id);
    }
  }, [status, close, message.id]);

  return (
    <div
      className={classNames(styles.alert, styles[message.type], {
        [styles.open]: status === 'open',
      })}
    >
      <div className={styles.alertText}>{message.message}</div>
      <button
        aria-label="Close alert"
        className={styles.alertCloseButton}
        onClick={() => setStatus('closing')}
      >
        X
      </button>
    </div>
  );
};
