import vector from '../assets/headerBackground.svg';
import styled from 'styled-components';

export const VectorBackground: React.FC = ({ children }) => {
  return (
    <Outer>
      <Inner>{children}</Inner>
    </Outer>
  );
};

const Outer = styled.div`
  height: inherit;
  width: inherit;
  background-image: url(${vector});
  background-repeat: no-repeat;
  background-size: contain;
  padding: 100px 0 0 0;
`;

const Inner = styled.div`
  background-color: #fff;
  width: 1000px;
  min-height: 1000px;
  border-radius: 40px;
  margin: 0 auto;
  padding: 50px;
`;
