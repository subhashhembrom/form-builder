// src/pages/MyForms.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { deleteSavedForm } from '../store/formsSlice';

export default function MyForms() {
  const saved = useAppSelector(s => s.forms.savedForms);
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2>Saved forms</h2>
      <List>
        {saved.map(f => (
          <ListItem key={f.id} secondaryAction={<IconButton onClick={() => dispatch(deleteSavedForm(f.id))}><DeleteIcon/></IconButton>}>
            <ListItemText primary={f.name} secondary={new Date(f.createdAt || '').toLocaleString()} onClick={() => nav(`/preview/${f.id}`)} style={{ cursor: 'pointer' }} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}