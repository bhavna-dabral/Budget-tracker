import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { MainLayout } from "../styles/Layouts";
import bg from "../img/bg.png";
import Navigation from "../Components/Navigation/Navigation";
import Orb from "../Components/Orb/Orb";
import Dashboard from "../Components/Dashboard/Dashboard";
import Income from "../Components/Income/Income";
import Expenses from "../Components/Expenses/Expenses";
import Transactions from "../Components/Transactions/Transactions";

function DashboardLayout() {
  const [active, setActive] = useState(1);

  // Optional optimization (orb)
  const orbMemo = useMemo(() => <Orb />, []);

  // Switch between pages
  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Income />;
      case 3:
        return <Expenses />;
      case 4:
        return <Transactions />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppStyled bg={bg}>
      {orbMemo}
      <MainLayout>
        {/* ✅ Passing active + setActive to Navigation */}
        <Navigation active={active} setActive={setActive} />
        <main>{displayData()}</main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  position: relative;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center;
  overflow-y: auto;

  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    padding: 2rem;
    overflow-y: auto;
  }
`;

export default DashboardLayout;
