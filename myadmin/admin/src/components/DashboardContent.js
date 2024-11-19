import React from "react";
import StatsCard from "./StatsCard";
import Chart from "./Chart";

const DashboardContent = () => {
  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <StatsCard title="Today's Money" value="$53,000" growth={55} />
        <StatsCard title="Today's Users" value="2,300" growth={3} />
        <StatsCard title="New Clients" value="3,462" growth={-2} />
        <StatsCard title="Sales" value="$103,430" growth={5} />
      </div>
      <div style={{ marginTop: "30px" }}>
        <h3>Sales Overview</h3>
        <Chart />
      </div>
    </div>
  );
};

export default DashboardContent;
