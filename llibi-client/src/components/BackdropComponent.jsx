import React from 'react'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export default function BackdropComponent({ open }) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
      zindex={'1700'}
      open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
