// src/components/FieldList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import type { FieldSchema } from '../types';
import { useAppDispatch } from '../store/hooks';
import { deleteField, reorderField } from '../store/formsSlice';

export default function FieldList({ fields }: { fields: FieldSchema[] }) {
  const dispatch = useAppDispatch();

  return (
    <List>
      {fields.map((f, idx) => (
        <ListItem key={f.id} secondaryAction={
          <>
            <IconButton onClick={() => dispatch(reorderField({ from: idx, to: Math.max(0, idx-1) }))}><ArrowUpwardIcon/></IconButton>
            <IconButton onClick={() => dispatch(reorderField({ from: idx, to: Math.min(fields.length-1, idx+1) }))}><ArrowDownwardIcon/></IconButton>
            <IconButton onClick={() => dispatch(deleteField(f.id))}><DeleteIcon/></IconButton>
          </>
        }>
          <ListItemText primary={`${f.label} (${f.type})`} secondary={f.derived ? `Derived from: ${f.derived.parentKeys.join(', ')}` : f.options?.join(', ')} />
        </ListItem>
      ))}
    </List>
  );
}