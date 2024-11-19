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
      {/* Center logo and title */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img 
          src={`${process.env.PUBLIC_URL}/logo.png`} 
          alt="Raphacares Logo" 
          style={{ width: "80px", height: "80px", marginBottom: "10px" }} 
        />
        <h2 style={{ fontSize: "16px", color: "#333", marginBottom: 40 }}>
          Raphacares Admin Dashboard
        </h2>
      </div>
      
      {/* Sidebar menu */}
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
