import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useStore } from "../../../store/rootStore";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const CustomerList = () => {
  const {
    rootStore: { customerStore },
  } = useStore();

  const initTable = async () => {
    try {
      await customerStore.fetchList();
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
        rows={customerStore.rowData}
        columns={customerStore.columns}   // <-- Use this directly!
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default observer(CustomerList);
