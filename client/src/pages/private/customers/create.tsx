import React from "react";
import { observer } from "mobx-react-lite";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store/rootStore";

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone_number: Yup.string()
    .required("Phone number is required")
    .min(11, "Phone number must be 10 character")
    .max(11, "Phone number must be 10 character"),
  zip_code: Yup.string()
    .required("Zipcode is required")
    .min(4, "Zipcode must be at least 4 characters")
    .max(6, "Zipcode must be at most 6 characters"),
});

const CustomerCreate = () => {
  const {
    rootStore: { customerStore },
  } = useStore();
  const { createData } = customerStore;

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      zip_code: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const resData = await createData(data);
      if (resData) {
        reset();
        navigate("..");
      }
    } catch (error: any) {
      Object.keys(error?.data).map((e: any) => {
        setError(e, {
          type: "manual", // Use 'manual' for manually triggered errors
          message: error?.data[e],
        });
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h2>Create</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid sx={{ flex: "1 1 50%" }}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="first_name"
                  label="First name"
                  variant="outlined"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              )}
            />
          </Grid>
          <Grid sx={{ flex: "1 1 50%" }}>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="last_name"
                  label="Last name"
                  variant="outlined"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              )}
            />
          </Grid>
          <Grid sx={{ flex: "1 1 50%" }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid sx={{ flex: "1 1 50%" }}>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="phone_number"
                  label="Phone number"
                  variant="outlined"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                />
              )}
            />
          </Grid>
          <Grid sx={{ flex: "1 1 50%" }}>
            <Controller
              name="zip_code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="zip_code"
                  label="Zip code"
                  variant="outlined"
                  error={!!errors.zip_code}
                  helperText={errors.zip_code?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button
          sx={{ mt: 2 }}
          type="submit"
          variant="contained"
          color="success"
        >
          Save
        </Button>
        <Button
          sx={{ mt: 2, ml: 2 }}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </form>
    </Box>
  );
};

export default observer(CustomerCreate);
