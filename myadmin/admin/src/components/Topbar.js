import React from "react";
import { AppBar, Toolbar, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Topbar = () => {
  return (
    <AppBar position="static" style={{ background: "#fff", color: "#000", boxShadow: "none" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Dashboard</h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ background: "#f5f5f5", padding: "5px 10px", borderRadius: "5px", marginRight: "10px" }}>
            <InputBase placeholder="Search..." />
            <SearchIcon />
          </div>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
