import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet } from "react-router-dom";

const Products = () => {
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <h2>Products</h2>
      </Box>
      <Outlet />
    </div>
  );
};

export default observer(Products);
