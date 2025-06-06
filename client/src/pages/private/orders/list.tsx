import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useStore } from "../../../store/rootStore";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const OrderList = () => {
  const {
    rootStore: { orderStore },
  } = useStore();

  const initTable = async () => {
    try {
      const resData = await orderStore.fetchList();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initTable();
  }, []);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Button variant="contained" component={Link} to="create">
          Create
        </Button>
      </Box>
      <DataGrid
        autoHeight
        rows={orderStore.rowData}
        columns={orderStore.columns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default observer(OrderList);
