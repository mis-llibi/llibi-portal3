import React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import { useLaboratoryStore } from '@/store/useLaboratoryStore'
import { useUtulizationStore } from '@/store/useUtulizationStore'
import { Divider } from '@mui/material'
import { useModalUtilAndLabStore } from '@/store/useModalUtilAndLabStore'

export default function ShowSelectedUtilAndLab() {
  const { setShowModal } = useModalUtilAndLabStore()
  const { selectedUtil } = useUtulizationStore()
  const { selectedLab } = useLaboratoryStore()

  return (
    <Dialog
      fullWidth
      open={true}
      onClose={() => setShowModal(false)}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description">
      <DialogTitle
        className="font-bold font-[poppins] text-fav-black uppercase"
        id="scroll-dialog-title">
        Selected Utilization & Laboratory
      </DialogTitle>
      <DialogContent dividers="paper">
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          {/* 
            short code for loop to given array
            it is like array.from({length: number}) but in shorter code
          */}
          {/* {[...new Array(10)]
            .map(
              () => `Cras mattis consectetur purus sit amet fermentum.
                    Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                    Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
            )
            .join('\n')} */}
          <div className="font-[poppins]  text-fav-subtitle mb-3">
            <h1 className="text-lg font-bold">Utilization</h1>
            {selectedUtil?.map(item => {
              return (
                <>
                  <p key={item.id} className="text-sm">
                    - {item.diagname}
                  </p>
                </>
              )
            })}
          </div>

          <Divider />

          <div className="font-[poppins]  text-fav-subtitle mb-3">
            <h1 className="text-lg font-bold">Laboratory</h1>
            {selectedLab?.map(item => {
              return (
                <>
                  <p key={item.id} className="text-sm">
                    - {item.laboratory}
                  </p>
                </>
              )
            })}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          className="font-[poppins] text-xs"
          onClick={() => setShowModal(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
