import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '../theme';
import { MetaMaskButton } from 'rimble-ui';
import { MainStore } from '../Store/mainStore';
import { observer } from 'mobx-react-lite';
import { CONFIG } from '../config';
import copy from 'copy-text-to-clipboard';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import menu from '../assets/menu.png';

export const Navbar: React.FC = observer(() => {
  const mainStore = MainStore.getInstance();
  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Bar>
      {isMobile && (
        <Menuicon src={menu} onClick={() => setMenuOpen(!menuOpen)} />
      )}
      {!isMobile || menuOpen ? (
        <>
          <Logo to="/">profini</Logo>
          <MenuLink
            href={`${CONFIG.OPENSEA_URL}/collection/${CONFIG.OPENSEA_SLUG}`}
            target="_blank"
          >
            Marketplace
          </MenuLink>
          <MenuItem to="/collection">Collection</MenuItem>
          <MenuItem to="/booster">Booster</MenuItem>
          <MetaMaskButton
            className="meta-mask-button"
            onClick={
              !mainStore.ethAddress
                ? () => mainStore.loginMetamask()
                : () => {
                    copy(mainStore.ethAddress!);
                    toast.success('Wallet address copied to clipboard');
                  }
            }
          >
            {mainStore.ethAddress
              ? mainStore.ethAddress.substr(0, 6) +
                '...' +
                mainStore.ethAddress?.substring(mainStore.ethAddress.length - 4)
              : 'connect metamask'}
          </MetaMaskButton>
        </>
      ) : undefined}
    </Bar>
  );
});

const Bar = styled.div`
  width: 100%;
  background-color: #000;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: 1fr auto auto auto auto auto;
  grid-gap: 20px;
  padding: 10px;
  align-items: center;
  border-bottom: 1px solid #ffffff;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const MenuLink = styled.a`
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  text-transform: lowercase;
  transition: color 200ms ease;
  cursor: pointer;

  :hover {
    color: ${colors.lightAccent};
  }

  @media screen and (max-width: 1000px) {
    padding: 10px 0;
  }
`;

const MenuItem = styled(Link)`
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  text-transform: lowercase;
  transition: color 200ms ease;

  :hover {
    color: ${colors.lightAccent};
  }

  @media screen and (max-width: 1000px) {
    padding: 10px 0;
  }
`;

const Logo = styled(MenuItem)`
  font-size: 22px;
`;

const MenuButton = styled.div`
  position: absolute;
  font-size: 20px;
  color: #fff;
  top: 0;
  right: 0;
`;

const Menuicon = styled.img`
  width: 35px;
  margin: 0 auto;
  :hover {
    opacity: 0.8;
  }
`;
