import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Select, MenuItem, Button, Box } from '@mui/material';
import FieldEditor from '../components/FieldEditor';
import FieldList from '../components/FieldList';
import SaveFormDialog from '../components/SaveFormDialog';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addField } from '../store/formsSlice';
import type { FieldType, FieldData } from '../types';

const fieldOptions: FieldType[] = ['text','number','textarea','select','radio','checkbox','date'];

export default function CreateForm() {
  const dispatch = useAppDispatch();
  const current = useAppSelector(s => s.forms.currentForm);
  const [selectedType, setSelectedType] = useState<FieldType>('text');
  const [editorOpen, setEditorOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  function handleSaveField(field: FieldData) {
    dispatch(addField(field));
    setEditorOpen(false);
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={2}>
       {/*} <Grid item xs={12} md={4}>*/}
          <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Add field</Typography>
            <Select fullWidth value={selectedType} onChange={e => setSelectedType(e.target.value as FieldType)}>
              {fieldOptions.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => setEditorOpen(true)}>Configure & Add</Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => setSaveOpen(true)}>Save Form</Button>
            </Box>
          </Paper>
        </Grid>

        {/*<Grid item xs={12} md={8}>*/}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Fields</Typography>
            <FieldList fields={current.fields} />
          </Paper>
        </Grid>
      </Grid>

      <FieldEditor
        open={editorOpen}
        type={selectedType}
        fields={current.fields}
        onSave={handleSaveField}
        onClose={() => setEditorOpen(false)}
      />
      <SaveFormDialog open={saveOpen} onClose={() => setSaveOpen(false)} />
    </Container>
  );
}


//2nd edit
/*import React, { useState } from 'react';
import Grid from '@mui/material/Grid'; // ✅ Grid v2 import
import { Container, Paper, Typography, Select, MenuItem, Button, Box } from '@mui/material';
import FieldEditor from '../components/FieldEditor';
import FieldList from '../components/FieldList';
import SaveFormDialog from '../components/SaveFormDialog';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addField } from '../store/formsSlice';
import type { FieldType } from '../types';

const fieldOptions: FieldType[] = ['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'];

export default function CreateForm() {
  const dispatch = useAppDispatch();
  const current = useAppSelector(s => s.forms.currentForm);
  const [selectedType, setSelectedType] = useState<FieldType>('text');
  const [editorOpen, setEditorOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  function handleAdd() {
    setEditorOpen(true);
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        
        {/* Left column 
        {/*<Grid xs={12} md={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Add field</Typography>
            <Select
              fullWidth
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as FieldType)}
            >
              {fieldOptions.map(f => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </Select>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleAdd}>
                Configure & Add
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => setSaveOpen(true)}>
                Save Form
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right column 
        {/*<Grid xs={12} md={8}>
          <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Fields</Typography>
            <FieldList fields={current.fields} />
          </Paper>
        </Grid>

      </Grid>

      {/* Dialogs 
      <FieldEditor open={editorOpen} type={selectedType} onClose={() => setEditorOpen(false)} />
      <SaveFormDialog open={saveOpen} onClose={() => setSaveOpen(false)} />
    </Container>
  );
}*/

//1st edit
// src/pages/CreateForm.tsx
/* import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Select, MenuItem, Button, Box } from '@mui/material';
import FieldEditor from '../components/FieldEditor';
import FieldList from '../components/FieldList';
import SaveFormDialog from '../components/SaveFormDialog';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addField } from '../store/formsSlice';
import type { FieldType } from '../types';

const fieldOptions: FieldType[] = ['text','number','textarea','select','radio','checkbox','date'];

export default function CreateForm() {
  const dispatch = useAppDispatch();
  const current = useAppSelector(s => s.forms.currentForm);
  const [selectedType, setSelectedType] = useState<FieldType>('text');
  const [editorOpen, setEditorOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  function handleAdd() {
    // open editor with default payload
    setEditorOpen(true);
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Add field</Typography>
            <Select fullWidth value={selectedType} onChange={e => setSelectedType(e.target.value as FieldType)}>
              {fieldOptions.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => setEditorOpen(true)}>Configure & Add</Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => setSaveOpen(true)}>Save Form</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Fields</Typography>
            <FieldList fields={current.fields} />
          </Paper>
        </Grid>
      </Grid>

      <FieldEditor open={editorOpen} type={selectedType} onClose={() => setEditorOpen(false)} />
      <SaveFormDialog open={saveOpen} onClose={() => setSaveOpen(false)} />
    </Container>
  );
}
 */



