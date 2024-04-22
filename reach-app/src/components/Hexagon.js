// components/Hexagon.js
import styled from 'styled-components';

const HexagonWrapper = styled.div`
  width: 100px;
  height: 57.74px;
  background-color: #6C7A89;
  position: relative;
  display: inline-block;
  margin: 29px 5px;
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
  }
  &:before {
    bottom: 100%;
    border-bottom: 28.87px solid #6C7A89;
  }
  &:after {
    top: 100%;
    border-top: 28.87px solid #6C7A89;
  }
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  font-size: 14px;
`;

const Hexagon = ({ children }) => (
  <HexagonWrapper>
    <Content>{children}</Content>
  </HexagonWrapper>
);

export default Hexagon;
