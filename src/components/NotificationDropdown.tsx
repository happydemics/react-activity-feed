import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UR } from 'getstream';

import { DefaultAT, DefaultUT, Feed, useFeedContext } from '../context';
import { ElementOrComponentOrLiteralType, PropsWithElementAttributes, smartRender } from '../utils';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { NotificationFeed, NotificationFeedProps } from './NotificationFeed';
import { DropdownPanel, DropdownPanelProps } from './DropdownPanel';
import { IconBadge } from './IconBadge';

export type NotificationDropdownProps<
  UT extends DefaultUT = DefaultUT,
  AT extends DefaultAT = DefaultAT,
  CT extends UR = UR,
  RT extends UR = UR,
  CRT extends UR = UR,
  PT extends UR = UR
> = PropsWithElementAttributes<
  {
    Icon?: ElementOrComponentOrLiteralType;
    width?: number;
  } & Pick<DropdownPanelProps, 'Footer' | 'Header' | 'right'> &
    NotificationFeedProps<UT, AT, CT, RT, CRT, PT>
>;

const NotificationDropdownInner = <
  UT extends DefaultUT = DefaultUT,
  AT extends DefaultAT = DefaultAT,
  CT extends UR = UR,
  RT extends UR = UR,
  CRT extends UR = UR,
  PT extends UR = UR
>({
  width,
  Footer,
  Header,
  Icon,
  right,
  className,
  style,
  ...feedProps
}: NotificationDropdownProps<UT, AT, CT, RT, CRT, PT>) => {
  const feed = useFeedContext<UT, AT, CT, RT, CRT, PT>();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onMarkAsSeen = async () => {
    await feed.refresh();
    feed.refreshUnreadUnseen();
  };

  useOnClickOutside(
    dropdownRef,
    () => {
      setOpen(false);
      onMarkAsSeen();
    },
    open,
  );

  useEffect(() => {
    feed.refreshUnreadUnseen();
  }, []);

  const onIconBadgeClick = () => {
    setOpen((open) => !open);
    if (!open) {
      onMarkAsSeen();
    }
  };

  return (
    <div ref={dropdownRef} className={classNames('raf-notification-dropdown', className)} style={style}>
      <IconBadge showNumber unseen={feed.unseen} hidden={!feedProps.notify} onClick={onIconBadgeClick}>
        {Icon && smartRender(Icon)}
      </IconBadge>

      <div
        style={{ maxWidth: width }}
        className={`raf-notification-dropdown__panel${open ? ' raf-notification-dropdown__panel--open' : ''}${
          right ? ' raf-notification-dropdown__panel--right' : ''
        }`}
      >
        {open && (
          <DropdownPanel arrow right={right} Header={Header} Footer={Footer}>
            <NotificationFeed
              closeNotificationDropdown={() => setOpen(false)}
              onMarkAsSeen={onMarkAsSeen}
              {...feedProps}
            />
          </DropdownPanel>
        )}
      </div>
    </div>
  );
};

/**
 * IMPORTANT: Changing most of the props below doesn't result in the desired effect.
 * These settings related to feed management should be changed in the `sharedFeeds` prop of the [`StreamApp`](#streamapp) component.
 */
export const NotificationDropdown = <
  UT extends DefaultUT = DefaultUT,
  AT extends DefaultAT = DefaultAT,
  CT extends UR = UR,
  RT extends UR = UR,
  CRT extends UR = UR,
  PT extends UR = UR
>({
  width = 475,
  Footer,
  Header,
  Icon,
  right,
  feedGroup = 'notification',
  options,
  ...feedProps
}: NotificationDropdownProps<UT, AT, CT, RT, CRT, PT>) => {
  const optionsWithDefaults = { ...options, mark_seen: options?.mark_seen ?? true };

  return (
    <Feed<UT, AT, CT, RT, CRT, PT> {...feedProps} feedGroup={feedGroup} options={{ ...options, mark_seen: false }}>
      <NotificationDropdownInner<UT, AT, CT, RT, CRT, PT>
        width={width}
        Footer={Footer}
        Header={Header}
        Icon={Icon}
        right={right}
        {...feedProps}
        feedGroup={feedGroup}
        options={optionsWithDefaults}
      />
    </Feed>
  );
};
