import { Card, CardContent, Button, TextField } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useStore } from "../../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This is required")
    .email("This is a invalid email"),
  password: yup
    .string()
    .required("This is required")
    .min(4, "Minimum length should be 4 characters"),
});

const Login = () => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    rootStore: { authStore },
  } = useStore();

  const isAuthenticated = authStore.isAuthenticated;

  if (isAuthenticated) {
    return <Navigate to="/dashboard/customers" />;
  }

  const onSubmit = async (data: any) => {
    try {
      const resData = await authStore.login({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ minWidth: 450, justifyContent: "center" }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1>Login</h1>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                    {...field}
                  />
                )}
              ></Controller>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="filled"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ""}
                    {...field}
                  />
                )}
              />

              <Button
                sx={{ mt: 3 }}
                variant="outlined"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default observer(Login);
