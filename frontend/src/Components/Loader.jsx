import styled, { keyframes } from "styled-components";

function Loader() {
  return (
    <Wrap>
      <div className="spinner"></div>
      <p>Loading analytics...</p>
    </Wrap>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #eee;
    border-top: 4px solid #6c63ff;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }

  p { margin-top: 10px; color: #888; }
`;

export default Loader;