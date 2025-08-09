// src/components/SaveFormDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { saveForm } from '../store/formsSlice';

export default function SaveFormDialog({ open, onClose }: { open: boolean; onClose: ()=>void }) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');

  function handleSave() {
    if (!name) return alert('Enter a name');
    dispatch(saveForm({ name }));
    setName('');
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Form</DialogTitle>
      <DialogContent>
        <TextField label="Form name" fullWidth value={name} onChange={e=>setName(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}