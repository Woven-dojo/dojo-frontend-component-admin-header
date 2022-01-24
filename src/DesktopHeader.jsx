import React from 'react';
import classNames from 'classnames';
import { BrowserRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
// Local Components
import { Menu, MenuTrigger, MenuContent } from './Menu';
import Avatar from './Avatar';
import { LinkedLogo, Logo } from './Logo';

// i18n
import messages from './Header.messages';

// Assets
import { CaretIcon } from './Icons';

const RenderMainMenu = ({ mainMenu }) => {
  const { pathname } = useLocation();

  // Nodes are accepted as a prop
  if (!Array.isArray(mainMenu)) {
    return mainMenu;
  }

  return mainMenu.map(({
    type, href, content, submenuContent,
  }) => {
    if (type === 'item') {
      return (
        <a
          href={href}
          className={classNames('nav-link', {
            'nav-link__active': pathname === href,
          })}
        >
          {content}
        </a>
      );
    }

    return (
      <Menu
        key={`${type}-${content}`}
        tag="div"
        className="nav-item"
        respondToPointerEvents
      >
        <MenuTrigger
          tag="a"
          className="nav-link d-inline-flex align-items-center"
          href={href}
        >
          {content} <CaretIcon role="img" aria-hidden focusable="false" />
        </MenuTrigger>
        <MenuContent className="pin-left pin-right shadow py-2">
          {submenuContent}
        </MenuContent>
      </Menu>
    );
  });
};

const RenderUserMenu = ({
  userMenu, avatar, username, intl,
}) => (
  <Menu transitionClassName="menu-dropdown" transitionTimeout={250}>
    <MenuTrigger
      tag="button"
      aria-label={intl.formatMessage(
        messages['header.label.account.menu.for'],
        { username },
      )}
      className="btn btn-outline-primary d-inline-flex align-items-center pl-2 pr-3"
    >
      <Avatar size="1.5em" src={avatar} alt="" className="mr-2" />
      {username} <CaretIcon role="img" aria-hidden focusable="false" />
    </MenuTrigger>
    <MenuContent className="mb-0 dropdown-menu show dropdown-menu-right pin-right shadow py-2">
      {userMenu.map(({ type, href, content }) => (
        <a
          className={`dropdown-${type}`}
          key={`${type}-${content}`}
          href={href}
        >
          {content}
        </a>
      ))}
    </MenuContent>
  </Menu>
);

const RenderLoggedOutItems = ({ loggedOutItems }) => loggedOutItems.map((item, i, arr) => (
  <a
    key={`${item.type}-${item.content}`}
    className={
        i < arr.length - 1
          ? 'btn mr-2 btn-link'
          : 'btn mr-2 btn-outline-primary'
      }
    href={item.href}
  >
    {item.content}
  </a>
));

const DesktopHeader = ({
  logo,
  logoAltText,
  logoDestination,
  loggedIn,
  intl,
  loggedOutItems,
  userMenu,
  avatar,
  username,
  mainMenu,
}) => {
  const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
  const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;
  return (
    <header className="site-header-desktop">
      <a className="nav-skip sr-only sr-only-focusable" href="#main">
        {intl.formatMessage(messages['header.label.skip.nav'])}
      </a>
      <div className={`container-fluid ${logoClasses}`}>
        <div className="nav-container position-relative d-flex align-items-center">
          {logoDestination === null ? (
            <Logo className="logo" src={logo} alt={logoAltText} />
          ) : (
            <LinkedLogo className="logo" {...logoProps} />
          )}
          <nav
            aria-label={intl.formatMessage(messages['header.label.main.nav'])}
            className="nav"
          >
            <BrowserRouter>
              <RenderMainMenu mainMenu={mainMenu} />
            </BrowserRouter>
          </nav>
          <nav
            aria-label={intl.formatMessage(
              messages['header.label.secondary.nav'],
            )}
            className="nav secondary-menu-container align-items-center ml-auto"
          >
            {loggedIn ? (
              <RenderUserMenu
                userMenu={userMenu}
                avatar={avatar}
                username={username}
                intl={intl}
              />
            ) : (
              <RenderLoggedOutItems loggedOutItems={loggedOutItems} />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

RenderUserMenu.propTypes = {
  userMenu: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['item', 'menu']),
      href: PropTypes.string,
      content: PropTypes.string,
    }),
  ),
  avatar: PropTypes.string,
  username: PropTypes.string,
  intl: intlShape.isRequired,
};

RenderUserMenu.defaultProps = {
  userMenu: [],
  avatar: null,
  username: null,
};

DesktopHeader.propTypes = {
  mainMenu: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  userMenu: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['item', 'menu']),
      href: PropTypes.string,
      content: PropTypes.string,
    }),
  ),
  loggedOutItems: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['item', 'menu']),
      href: PropTypes.string,
      content: PropTypes.string,
    }),
  ),
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  loggedIn: PropTypes.bool,

  // i18n
  intl: intlShape.isRequired,
};

DesktopHeader.defaultProps = {
  mainMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  loggedIn: false,
};

export default injectIntl(DesktopHeader);
