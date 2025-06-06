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
    .email("This is an invalid email"),
  password: yup
    .string()
    .required("This is required")
    .min(4, "Minimum length should be 4 characters"),
});

const Login = observer(() => {
  const {
    handleSubmit,
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

  // Always destructure the observables here to trigger mobx reactivity.
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.userRole;
  const isLoading = authStore.isLoading;

  // Show loading if auth state is being determined
  if (isLoading) return <div>Loading...</div>;

  // Redirect based on role if authenticated
  if (isAuthenticated) {
    if (userRole === "admin") return <Navigate to="/dashboard/admin" replace />;
    if (userRole === "manager") return <Navigate to="/dashboard/manager" replace />;
    if (userRole === "cashier") return <Navigate to="/dashboard/cashier" replace />;
    return <Navigate to="/dashboard/customers" replace />;
  }

  const onSubmit = async (data: any) => {
    try {
      await authStore.login({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      // TODO: Show error to user here, if you want
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
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
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
});

export default Login;
