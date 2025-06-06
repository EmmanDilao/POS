import React, { useState } from 'react'
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../store/rootStore';
import AddNewItemForm from './addNewItemForm';
import AllItemsList from './allItemsList';
import ServerSideAutoComplete from '../../../components/ui/ServerSideAutocomplete/ServerSideAutoComplete';

// Main component
const Create = () => {
  const { rootStore: { orderStore, customerStore, authStore } } = useStore();
  const userRole = authStore.userRole; // Get the current user's role
  const navigate = useNavigate();

  // Validation schema: no discount field at order level
  const validationSchema = Yup.object().shape({
    customer: Yup.object().shape({
      id: Yup.string().required('Customer is required'),
      label: Yup.string().required('Customer is required'),
    }).required('Customer is required'),
  });

  const hookFromObj = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customer: { id: "", label: "" },
    }
  });

  const { control, handleSubmit, formState: { errors }, reset, setError } = hookFromObj
  const [productsErrorMessage, setProductsErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setProductsErrorMessage(null);
      const resData = await orderStore.createData(data)
      if (resData) {
        reset({
          customer: { id: "", label: "" },
        })
        orderStore.setCartItems([]);
        navigate('..')
      }
    } catch (error: any) {
      Object.keys(error?.data || {}).forEach((e: any) => {
        setError(e, {
          type: 'manual',
          message: error?.data[e],
        });
      })
      setProductsErrorMessage("Please select one products");
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <h4>Create</h4>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <ServerSideAutoComplete
                  label="Select a customer"
                  ajaxCallFn={customerStore.getList}
                  onOptionSelect={(option) => field.onChange(option)}
                  error={errors.customer?.id ?? errors.customer}
                  field={field}
                />
              )}
            />
          </Grid>
          {/* Discount field removed */}
        </Grid>
        <AddNewItemForm />
        {productsErrorMessage ? (
          <Box sx={{ color: 'error.main', my: 2 }}>{productsErrorMessage}</Box>
        ) : ""}
        <AllItemsList editMode={true} />
        <Button sx={{ mt: 2 }} type="submit" variant="contained" color="success">
          Save
        </Button>
        <Button sx={{ mt: 2, ml: 2 }} variant="contained" onClick={() => navigate(-1)}>
          Back
        </Button>
      </form>
    </Box>
  )
}

export default observer(Create)
