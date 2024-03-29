import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  createStyles,
  makeStyles,
  Theme,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Container,
  useTheme,
} from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment'
import { useSnackbar } from 'notistack'
import React, { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Device from 'lib/types/Device'
import { IDetailsDialogProps } from 'lib/types/device.dialog'
import Status from 'lib/types/device.status'
import { DialogMode } from 'pages/technik/index'
import CustomSelect from './CustomSelect'
import { db } from 'lib/app'
import { mutate } from 'swr'
import { useConfirm } from 'material-ui-confirm'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    indicator: {
      marginLeft: '2rem',
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },

      '& .Mui-disabled': {
        color: 'black',
      },
      '& #list': {
        flexGrow: 1,
      },
    },
    noEdit: {
      '& .Mui-disabled': {
        color: 'gray',
      },
    },
  })
)

const DeviceDetailsDialog: FC<IDetailsDialogProps> = (
  props: IDetailsDialogProps
) => {
  const { devices, activeDevice, mode, show, options, handleClose } = props
  const isReadOnly = mode === DialogMode.ReadOnly
  const isCreateNew = mode === DialogMode.Create
  const displayAddButton = isCreateNew

  const confirm = useConfirm()
  const theme = useTheme()

  const { handleSubmit, control, reset, watch, formState } = useForm({
    defaultValues: activeDevice || undefined,
    mode: 'onChange',
  })

  const { isDirty, isSubmitting } = formState

  const buttonAdd = (
    <Button
      onClick={handleSubmit(
        async (data) => handlePost(data, actionEnum.add),
        console.error
      )}
      color="primary"
      disabled={isSubmitting}
    >
      Add Device
    </Button>
  )

  const buttonSubmit = (
    <Button
      onClick={handleSubmit(
        async (data) => handlePost(data, actionEnum.edit),
        console.error
      )}
      color="primary"
      disabled={!isDirty || isSubmitting}
    >
      Submit Change
    </Button>
  )

  const associatedID = watch('associated')

  const associatedDevices = devices.filter(
    (device: Device) =>
      (associatedID ?? 1) === (device.associated ?? 2) &&
      device !== activeDevice
  )

  useEffect(() => {
    reset(activeDevice || undefined)
  }, [activeDevice])

  const classes = useStyles()

  // used to show notifications
  const { enqueueSnackbar } = useSnackbar()

  enum actionEnum {
    add = 'add',
    edit = 'edit',
  }

  const handlePost = (data: Device, action: actionEnum) => {
    const successCallback = () => {
      enqueueSnackbar(`Successfully ${action}ed Device ${data.description}.`, {
        variant: 'success',
      })
      reset(data)
      mutate('devices-all')
      handleClose()
    }

    const failureCallback = () =>
      enqueueSnackbar(`Failed to ${action} device ${data.description}`, {
        variant: 'error',
      })

    if (action === actionEnum.add) {
      db.collection('devices')
        .add({
          ...data,
          amount: Math.max(data.amount, 1),
          buyDate: data.buyDate || '',
          lastEdit: new Date().toISOString(),
        })
        .then(successCallback, failureCallback)
    } else if (action === actionEnum.edit) {
      db.collection('devices')
        .doc(data.id)
        .update({
          ...data,
          buyDate: data.buyDate || '',
          amount: Math.max(data.amount, 1),
          lastEdit: new Date().toISOString(),
        })
        .then(successCallback, failureCallback)
    }
  }

  return (
    <Dialog
      disableEscapeKeyDown={isCreateNew}
      fullWidth={true}
      maxWidth={'md'}
      open={show}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' && (isCreateNew || isDirty)) {
          return
        } else {
          handleClose()
        }
      }}
      aria-labelledby="details-dialog-title"
    >
      <DialogTitle id="details-dialog-title">
        {isCreateNew
          ? 'Add a new device'
          : `Details for ${activeDevice?.description} (${activeDevice?.id})`}

        {(isReadOnly || isCreateNew) && (
          <Typography
            variant="caption"
            component="small"
            className={classes.indicator}
          >
            {isCreateNew ? '[Only available for Admins]' : '[Read-Only]'}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        <Container>
          <form className={classes.root} autoComplete="off">
            <Typography variant="h4" component="h2">
              General Information
            </Typography>

            <Grid container spacing={1}>
              <Grid item>
                <TextField
                  id="id"
                  label="ID (read-only)"
                  value={activeDevice?.id}
                  className={classes.noEdit}
                  InputProps={{
                    readOnly: true,
                    disabled: true,
                  }}
                />
              </Grid>
              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="lastEdit"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      id="lastEdit"
                      label="Last edit:"
                      type="datetime"
                      value={value}
                      onChange={onChange}
                      className={classes.noEdit}
                      InputProps={{
                        disabled: true,
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="description"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      id="description"
                      label="Name"
                      required
                      value={value}
                      error={!!error}
                      onChange={onChange}
                      InputProps={{
                        disabled: isReadOnly,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="brand"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      readOnly={isReadOnly}
                      value={value}
                      onChange={onChange}
                      options={options}
                      attr="brand"
                    />
                  )}
                />
              </Grid>

              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      multiSelect
                      readOnly={isReadOnly}
                      value={value}
                      onChange={onChange}
                      options={options}
                      attr="category"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="comments"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      multiline
                      id="comments"
                      label="comments"
                      value={value}
                      onChange={onChange}
                      InputProps={{
                        disabled: isReadOnly,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="amount"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      id="amount"
                      label="amount"
                      required
                      type="number"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      InputProps={{
                        disabled: isReadOnly,
                        'aria-valuemin': 1,
                        'aria-valuemax': 9999,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="store"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      id="store"
                      label="Store"
                      value={value}
                      onChange={onChange}
                      InputProps={{
                        disabled: isReadOnly,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="price"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      id="price"
                      label="price"
                      /*  required */
                      type="number"
                      value={value}
                      onChange={onChange}
                      InputProps={{
                        disabled: isReadOnly,
                        startAdornment: (
                          <InputAdornment position="start">€</InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="buyDate"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      id="buyDate"
                      label="Date of Purchase"
                      type="date"
                      value={value}
                      onChange={onChange}
                      InputProps={{
                        disabled: isReadOnly,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Typography variant="h4" component="h2">
              Location
            </Typography>

            <Grid container spacing={1}>
              <Grid item>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="status"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <CustomSelect
                      required
                      readOnly={isReadOnly}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      options={{ ...options, status: Object.values(Status) }}
                      attr="status"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="location"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <CustomSelect
                      required
                      readOnly={isReadOnly}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      options={options}
                      attr="location"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="location_prec"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      readOnly={isReadOnly}
                      value={value}
                      onChange={onChange}
                      options={options}
                      attr="location_prec"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="container"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      readOnly={isReadOnly}
                      value={value}
                      onChange={onChange}
                      options={options}
                      attr="container"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Typography variant="h4" component="h2">
              Associated Devices
            </Typography>

            <Grid container spacing={1}>
              <Grid item>
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="associated"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      id="associated"
                      label="Associated Devices:"
                      type="number"
                      value={value}
                      onChange={onChange}
                      InputProps={{
                        disabled: isReadOnly,
                      }}
                    />
                  )}
                />
              </Grid>

              {associatedID !== -1 &&
                associatedID &&
                associatedDevices.length > 0 && (
                  <Grid item id="list">
                    <Paper>
                      <List dense>
                        {associatedDevices.map(
                          (device: Device, index: number) => (
                            <ListItem key={index}>
                              <ListItemText primary={device.description} />
                            </ListItem>
                          )
                        )}
                      </List>
                    </Paper>
                  </Grid>
                )}
            </Grid>
          </form>
        </Container>
      </DialogContent>

      <DialogActions>
        {!isReadOnly && !isCreateNew
          ? buttonSubmit
          : displayAddButton && buttonAdd}

        <Button
          onClick={() => {
            if (isDirty) {
              confirm({
                title: 'You have unsaved changes.',
                description:
                  'Do you want to discard your changes and close this modal? (ENTER)',
                confirmationText: 'Discard & Close',
                confirmationButtonProps: {
                  autoFocus: true,
                  style: { color: theme.palette.warning.main },
                },
                cancellationText: 'Go back to editing',
              })
                .then(() => {
                  reset(activeDevice || undefined)
                  handleClose()
                })
                .catch()
            }
          }}
          color="secondary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeviceDetailsDialog
