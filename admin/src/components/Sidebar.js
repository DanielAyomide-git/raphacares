import React from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableChartIcon from "@mui/icons-material/TableChart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ProfileIcon from "@mui/icons-material/Person";

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Tables", icon: <TableChartIcon /> },
    { text: "Billing", icon: <CreditCardIcon /> },
    { text: "Profile", icon: <ProfileIcon /> },
  ];

  return (
    <div style={{ width: "250px", background: "#f5f5f5", height: "100vh", padding: "20px" }}>
      <h2>Raphacares Admin Dashboard</h2>
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
