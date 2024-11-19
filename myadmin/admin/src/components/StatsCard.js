import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatsCard = ({ title, value, growth }) => {
  return (
    <Card style={{ minWidth: "150px", margin: "10px" }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>{value}</Typography>
        <Typography variant="body2" color={growth > 0 ? "green" : "red"}>
          {growth > 0 ? `+${growth}%` : `${growth}%`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
