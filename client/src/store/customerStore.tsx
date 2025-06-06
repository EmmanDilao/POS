import { action, makeObservable, observable } from "mobx";
import type { IRootStore } from "./rootStore";
import type { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default class CustomerStore {
  BASE_URL = import.meta.env.VITE_APP_API_URL + "v1/customers";

  rootStore: IRootStore;
  rowData: GridRowsProp[] = [];
  get columns(): GridColDef[] {
    // Hide the actions column entirely for the manager role
    const userRole = this.rootStore.authStore.userRole;
    const baseColumns: GridColDef[] = [
      { field: "id", headerName: "Id", width: 100 },
      { field: "first_name", headerName: "First Name", width: 150 },
      { field: "last_name", headerName: "Last Name", width: 150 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone_number", headerName: "Phone Number", width: 200 },
      { field: "zip_code", headerName: "Zip Code", width: 150 },
    ];
    if (userRole === "manager") {
      return baseColumns;
    }
    return [
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        sortable: false, // Disable sorting
        filterable: false, // Disable filtering
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <IconButton
              component={Link}
              to={"edit/" + params.row.id}
              color="info"
              size="medium"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => this.deleteDialog(params)}
              color="error"
              size="medium"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
      ...baseColumns,
    ];
  }

  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      rowData: observable,
      setRowData: action,
      fetchList: action,
      createData: action,
      getData: action,
      updateData: action,
    });
    this.rootStore = rootStore;
  }

  setRowData(values: GridRowsProp[]) {
    this.rowData = values;
  }

  //   Api Calls
  fetchList = async () => {
    try {
      const response = await fetch(this.BASE_URL + "/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}`,
          data
        );
        return Promise.reject(data);
      } else {
        this.setRowData(data.data.customers);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  // Create
  createData = async (postData: any) => {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  // View
  getData = async (id: number | string) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  // Update
  updateData = async (id: number | string, postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  // Delete
  deleteData = async (id: number | string) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        this.setRowData(this.rowData.filter((e: any) => e.id != id));
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  // Delete
  deleteDialog = async (params: any) => {
    this.rootStore.dialogStore.openDialog({
      confirmFn: () => this.deleteData(params.row.id),
      dialogText: "Are you sure you want to delete this item ?",
    });
  };

  //   Api Calls
  getList = async (postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + "/getList", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}`,
          data
        );
        return Promise.reject(data);
      } else {
        return Promise.resolve(data.data.customers);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };
}
