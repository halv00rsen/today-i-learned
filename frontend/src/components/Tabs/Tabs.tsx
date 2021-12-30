import classNames from 'classnames';
import { useState } from 'react';
import { NonEmptyArray } from '../../utils/array';
import styles from './Tabs.module.css';

interface Tab {
  id: string;
  tabTitle: string;
  content: React.ReactNode;
}

interface Props {
  tabs: NonEmptyArray<Tab>;
  defaultActiveTabId?: string;
}

export const Tabs = ({ tabs, defaultActiveTabId }: Props) => {
  const [activeTabId, setActiveTabId] = useState(
    defaultActiveTabId || tabs[0].id
  );

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <>
      <div className={styles.tabButtons}>
        {tabs.map(({ id, tabTitle }) => {
          const active = id === activeTabId;
          return (
            <button
              key={id}
              onClick={() => !active && setActiveTabId(id)}
              className={classNames(styles.tabButton, {
                [styles.active]: active,
              })}
            >
              {tabTitle}
            </button>
          );
        })}
      </div>
      {activeTab && <div>{activeTab.content}</div>}
    </>
  );
};
