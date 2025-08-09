// src/components/FieldEditor.tsx
/*import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Checkbox } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addField } from '../store/formsSlice';
import { FieldType } from '../types';
import { v4 as uuid } from 'uuid';

interface Props { open: boolean; onClose: ()=>void; type: FieldType; }

export default function FieldEditor({ open, onClose, type }: Props) {
  const dispatch = useAppDispatch();
  const fields = useAppSelector(s => s.forms.currentForm.fields);
  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState('');
  const [options, setOptions] = useState(''); // comma separated
  const [notEmpty, setNotEmpty] = useState(false);
  const [minLength, setMinLength] = useState<number|''>('');
  const [maxLength, setMaxLength] = useState<number|''>('');
  const [email, setEmail] = useState(false);
  const [passwordMin, setPasswordMin] = useState<number|''>('');
  const [passwordRequireNumber, setPasswordRequireNumber] = useState(false);
  // derived
  const [derivedParents, setDerivedParents] = useState<string[]>([]);
  const [expression, setExpression] = useState('');

  function clearAll() {
    setLabel('');
    setRequired(false);
    setDefaultValue('');
    setOptions('');
    setNotEmpty(false);
    setMinLength('');
    setMaxLength('');
    setEmail(false);
    setPasswordMin('');
    setPasswordRequireNumber(false);
    setDerivedParents([]);
    setExpression('');
  }

  function handleSave() {
    const key = `field_${uuid().slice(0,8)}`;
    const field = {
      key,
      type,
      label: label || key,
      required,
      defaultValue: defaultValue || undefined,
      options: options ? options.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
      validations: {
        notEmpty: notEmpty || undefined,
        minLength: minLength === '' ? undefined : Number(minLength),
        maxLength: maxLength === '' ? undefined : Number(maxLength),
        email: email || undefined,
        passwordRule: passwordMin ? { minLength: Number(passwordMin), requireNumber: passwordRequireNumber } : undefined
      },
      derived: derivedParents.length ? { parentKeys: derivedParents, expression: expression } : null
    };
    dispatch(addField(field as any)); // addField will add id
    clearAll();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Configure {type} field</DialogTitle>
      <DialogContent>
        <TextField label="Label" fullWidth value={label} onChange={e=>setLabel(e.target.value)} sx={{mt:1}} />
        <FormControlLabel control={<Switch checked={required} onChange={(_,v)=>setRequired(v)} />} label="Required" />
        <TextField label="Default value" fullWidth value={defaultValue} onChange={e=>setDefaultValue(e.target.value)} sx={{mt:1}} />
        {(type === 'select' || type === 'radio' || type === 'checkbox') && (
          <TextField label="Options (comma separated)" fullWidth value={options} onChange={e=>setOptions(e.target.value)} sx={{mt:1}} />
        )}

        <div style={{ marginTop: 12 }}>
          <FormControlLabel control={<Checkbox checked={notEmpty} onChange={(_,v)=>setNotEmpty(v)} />} label="Validation: Not empty" />
        </div>
        <TextField label="Min length" type="number" fullWidth value={minLength} onChange={e=>setMinLength(e.target.value ? Number(e.target.value) : '')} sx={{mt:1}} />
        <TextField label="Max length" type="number" fullWidth value={maxLength} onChange={e=>setMaxLength(e.target.value ? Number(e.target.value) : '')} sx={{mt:1}} />
        <FormControlLabel control={<Checkbox checked={email} onChange={(_,v)=>setEmail(v)} />} label="Email format" />
        <div style={{ marginTop: 8 }}>
          <TextField label="Password min length" type="number" fullWidth value={passwordMin} onChange={e=>setPasswordMin(e.target.value ? Number(e.target.value) : '')} />
          <FormControlLabel control={<Checkbox checked={passwordRequireNumber} onChange={(_,v)=>setPasswordRequireNumber(v)} />} label="Password must contain number" />
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Derived field (optional)</h4>
          <FormControl fullWidth>
            <InputLabel>Parent fields</InputLabel>
            <Select multiple value={derivedParents} onChange={e => setDerivedParents(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])} renderValue={(selected)=> (selected as string[]).join(', ')}>
              {fields.map(f => <MenuItem key={f.id} value={f.key}>{f.label} ({f.key})</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Expression (JS) — refer to parent keys" multiline rows={3} fullWidth value={expression} onChange={e=>setExpression(e.target.value)} helperText={'Example (dob parent): Math.floor((Date.now() - new Date(dob).getTime())/(1000*60*60*24*365.25))'} sx={{mt:1}} />
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => { clearAll(); onClose(); }}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Add field</Button>
      </DialogActions>
    </Dialog>
  );
} */

  // src/components/FieldEditor.tsx (2nd edit)
/*import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Switch, FormControlLabel, Select, MenuItem, InputLabel,
  FormControl, Checkbox
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addField } from '../store/formsSlice';
import type { FieldType } from '../types';
import { v4 as uuid } from 'uuid';

interface Props { open: boolean; onClose: ()=>void; type: FieldType; }

export default function FieldEditor({ open, onClose, type }: Props) {
  const dispatch = useAppDispatch();
  const fields = useAppSelector(s => s.forms.currentForm.fields);

  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState('');
  const [options, setOptions] = useState('');
  const [notEmpty, setNotEmpty] = useState(false);
  const [minLength, setMinLength] = useState<number|''>('');
  const [maxLength, setMaxLength] = useState<number|''>('');
  const [email, setEmail] = useState(false);
  const [passwordMin, setPasswordMin] = useState<number|''>('');
  const [passwordRequireNumber, setPasswordRequireNumber] = useState(false);
  const [derivedParents, setDerivedParents] = useState<string[]>([]);
  const [expression, setExpression] = useState('');

  // 🔹 Auto-fill expression if parent is DOB
  useEffect(() => {
    if (derivedParents.length === 1) {
      const parentKey = derivedParents[0];
      const parentField = fields.find(f => f.key === parentKey);
      if (
        parentKey.toLowerCase() === 'dob' ||
        parentField?.label.toLowerCase().includes('date of birth')
      ) {
        setExpression(
          `Math.floor((Date.now() - new Date(dob).getTime()) / (1000*60*60*24*365.25))`
        );
      }
    }
  }, [derivedParents, fields]);

  useEffect(() => {
    if (open) {
      setLabel('');
      setRequired(false);
      setDefaultValue('');
      setOptions('');
      setNotEmpty(false);
      setMinLength('');
      setMaxLength('');
      setEmail(false);
      setPasswordMin('');
      setPasswordRequireNumber(false);
      setDerivedParents([]);
      setExpression('');
    }
  }, [open]);

  function handleSave() {
    const key = `field_${uuid().slice(0,8)}`;
    const field = {
      key,
      type,
      label: label || key,
      required,
      defaultValue: defaultValue || undefined,
      options: options ? options.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
      validations: {
        notEmpty: notEmpty || undefined,
        minLength: minLength === '' ? undefined : Number(minLength),
        maxLength: maxLength === '' ? undefined : Number(maxLength),
        email: email || undefined,
        passwordRule: passwordMin ? { minLength: Number(passwordMin), requireNumber: passwordRequireNumber } : undefined
      },
      derived: derivedParents.length ? { parentKeys: derivedParents, expression: expression } : null
    } as any;
    dispatch(addField(field));
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Configure {type} field</DialogTitle>
      <DialogContent>
        {/* ... other inputs ... 

        <div style={{ marginTop: 12 }}>
          <h4>Derived field (optional)</h4>
          <FormControl fullWidth>
            <InputLabel>Parent fields</InputLabel>
            <Select
              multiple
              value={derivedParents}
              onChange={e => setDerivedParents(
                typeof e.target.value === 'string'
                  ? e.target.value.split(',')
                  : e.target.value as string[]
              )}
              renderValue={(selected)=> (selected as string[]).join(', ')}
            >
              {fields.map(f => (
                <MenuItem key={f.id} value={f.key}>
                  {f.label} ({f.key})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Expression (JS) — refer to parent keys"
            multiline
            rows={3}
            fullWidth
            value={expression}
            onChange={e=>setExpression(e.target.value)}
            helperText={'Example (dob parent): Math.floor((Date.now() - new Date(dob).getTime())/(1000*60*60*24*365.25))'}
            sx={{mt:1}}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Add field</Button>
      </DialogActions>
    </Dialog>
  );
} */
// 3rd edit
/*import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { addField } from '../store/formsSlice';
import type { FieldType, FieldSchema, ValidationRules } from '../types';

interface FieldEditorProps {
  open: boolean;
  type: FieldType;
  onClose: () => void;
}

export default function FieldEditor({ open, type, onClose }: FieldEditorProps) {
  const dispatch = useAppDispatch();

  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [minLength, setMinLength] = useState<number | undefined>(undefined);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);

  const handleSave = () => {
    const validation: ValidationRules = {
      required,
      ...(minLength !== undefined && { minLength }),
      ...(maxLength !== undefined && { maxLength })
    };

    const newField: FieldSchema = {
      id: Date.now().toString(),
      type,
      label,
      validation
    };

    dispatch(addField(newField));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Configure Field</DialogTitle>
      <DialogContent>
        {/* Field label 
        <TextField
          fullWidth
          label="Field Label"
          value={label}
          onChange={e => setLabel(e.target.value)}
          margin="normal"
        />

        {/* Validation options 
        <FormControlLabel
          control={
            <Checkbox checked={required} onChange={e => setRequired(e.target.checked)} />
          }
          label="Required"
        />

        <TextField
          fullWidth
          type="number"
          label="Minimum Length"
          value={minLength ?? ''}
          onChange={e => setMinLength(e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
        />

        <TextField
          fullWidth
          type="number"
          label="Maximum Length"
          value={maxLength ?? ''}
          onChange={e => setMaxLength(e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Field
        </Button>
      </DialogActions>
    </Dialog>
  );
} */

  // 4th edit
  /* import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { addField } from '../store/formsSlice';
import type { FieldType, FieldSchema, ValidationRules } from '../types';

interface FieldEditorProps {
  open: boolean;
  type: FieldType;
  onClose: () => void;
  fields: FieldSchema[]; // All existing fields so we can choose a parent
}

export default function FieldEditor({ open, type, onClose, fields }: FieldEditorProps) {
  const dispatch = useAppDispatch();

  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [minLength, setMinLength] = useState<number | undefined>(undefined);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [derivedFrom, setDerivedFrom] = useState<string>(''); // parent field key
  const [expression, setExpression] = useState('');

  // Auto-fill expression if derived from DOB
  useEffect(() => {
    if (derivedFrom) {
      const parentField = fields.find(f => f.id === derivedFrom);
      if (
        parentField &&
        (parentField.label.toLowerCase() === 'dob' ||
          parentField.label.toLowerCase().includes('date of birth'))
      ) {
        setExpression(
          `Math.floor((Date.now() - new Date(dob).getTime()) / (1000*60*60*24*365.25))`
        );
      }
    }
  }, [derivedFrom, fields]);

  const handleSave = () => {
    const validation: ValidationRules = {
      required,
      ...(minLength !== undefined && { minLength }),
      ...(maxLength !== undefined && { maxLength })
    };

    const newField: FieldSchema = {
      id: Date.now().toString(),
      type,
      label,
      validation,
      derivedFrom,
      expression
    };

    dispatch(addField(newField));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Configure Field</DialogTitle>
      <DialogContent>
        {/* Field label 
        <TextField
          fullWidth
          label="Field Label"
          value={label}
          onChange={e => setLabel(e.target.value)}
          margin="normal"
        />

        {/* Select parent field for derived fields 
        {type === 'derived' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Derived From</InputLabel>
            <Select
              value={derivedFrom}
              onChange={e => setDerivedFrom(e.target.value)}
            >
              {fields.map(f => (
                <MenuItem key={f.id} value={f.id}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Show expression for derived fields 
        {type === 'derived' && (
          <TextField
            fullWidth
            label="Expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            margin="normal"
          />
        )}

        {/* Validation 
        <FormControlLabel
          control={
            <Checkbox checked={required} onChange={e => setRequired(e.target.checked)} />
          }
          label="Required"
        />

        <TextField
          fullWidth
          type="number"
          label="Minimum Length"
          value={minLength ?? ''}
          onChange={e => setMinLength(e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
        />

        <TextField
          fullWidth
          type="number"
          label="Maximum Length"
          value={maxLength ?? ''}
          onChange={e => setMaxLength(e.target.value ? parseInt(e.target.value) : undefined)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Field
        </Button>
      </DialogActions>
    </Dialog>
  );
} */

//5th edit
/*import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import type { FieldType, FieldData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FieldEditorProps {
  open: boolean;
  type: FieldType;
  fields: FieldData[];
  onSave: (field: FieldData) => void;
  onClose: () => void;
}

export default function FieldEditor({ open, type, fields, onSave, onClose }: FieldEditorProps) {
  const [label, setLabel] = useState('');
  const [derivedFrom, setDerivedFrom] = useState('');
  const [expression, setExpression] = useState('');

  useEffect(() => {
    // Auto-fill expression if derived from DOB
    if (derivedFrom) {
      const parentField = fields.find(f => f.key === derivedFrom);
      if (
        parentField &&
        (parentField.label.toLowerCase() === 'dob' ||
         parentField.label.toLowerCase().includes('date of birth'))
      ) {
        setExpression(
          `Math.floor((Date.now() - new Date(dob).getTime()) / (1000*60*60*24*365.25))`
        );
      }
    }
  }, [derivedFrom, fields]);

  function handleSave() {
    const newField: FieldData = {
      key: uuidv4(),
      type,
      label,
      derivedFrom,
      expression: expression || undefined
    };
    onSave(newField);
    setLabel('');
    setDerivedFrom('');
    setExpression('');
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Configure Field</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Field Label"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Derived From (optional)</InputLabel>
          <Select
            value={derivedFrom}
            onChange={e => setDerivedFrom(e.target.value)}
            label="Derived From"
          >
            <MenuItem value="">None</MenuItem>
            {fields.map(f => (
              <MenuItem key={f.key} value={f.key}>{f.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {derivedFrom && (
          <TextField
            fullWidth
            margin="normal"
            label="Expression"
            value={expression}
            onChange={e => setExpression(e.target.value)}
            multiline
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
} */

//6th edit
// src/components/FieldEditor.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { addField } from "../store/formsSlice";
import type { FieldType, ValidationRules } from "../types";

interface FieldEditorProps {
  open: boolean;
  onClose: () => void;
  type: FieldType;
}

export default function FieldEditor({ open, onClose, type }: FieldEditorProps) {
  const dispatch = useAppDispatch();

  const [label, setLabel] = useState("");
  const [keyName, setKeyName] = useState("");
  const [validations, setValidations] = useState<ValidationRules>({});
  const [isDerived, setIsDerived] = useState(false);
  const [derivedParents, setDerivedParents] = useState<string[]>([]);
  const [expression, setExpression] = useState("");

  // Auto-fill expression if derived from DOB
  useEffect(() => {
    if (derivedParents.length === 1) {
      const parentKey = derivedParents[0];
      if (parentKey.toLowerCase() === "dob" || label.toLowerCase().includes("date of birth")) {
        setExpression(
          `Math.floor((Date.now() - new Date(dob).getTime()) / (1000*60*60*24*365.25))`
        );
      }
    }
  }, [derivedParents, label]);

  const handleSave = () => {
    const newField = {
      type,
      label,
      key: keyName || label.toLowerCase().replace(/\s+/g, "_"),
      validations: isDerived ? {} : validations,
      derived: isDerived,
      derivedParents: isDerived ? derivedParents : [],
      expression: isDerived ? expression : undefined,
    };

    dispatch(addField(newField));
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setLabel("");
    setKeyName("");
    setValidations({});
    setIsDerived(false);
    setDerivedParents([]);
    setExpression("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure Field</DialogTitle>
      <DialogContent>
        {/* Field label */}
        <TextField
          fullWidth
          label="Field Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Field key */}
        <TextField
          fullWidth
          label="Field Key"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Derived toggle */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isDerived}
              onChange={(e) => setIsDerived(e.target.checked)}
            />
          }
          label="This is a derived field"
          sx={{ mt: 2 }}
        />

        {/* Derived field configuration */}
        {isDerived && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Parent Field Keys (comma separated)"
              value={derivedParents.join(", ")}
              onChange={(e) =>
                setDerivedParents(
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              label="Expression"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              helperText="Write a JavaScript expression using parent keys"
            />
          </Box>
        )}

        {/* Validation options - only show if NOT derived */}
        {!isDerived && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Validation Rules</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!validations.notEmpty}
                  onChange={(e) =>
                    setValidations({
                      ...validations,
                      notEmpty: e.target.checked,
                    })
                  }
                />
              }
              label="Required"
            />
            <TextField
              type="number"
              label="Min Length"
              value={validations.minLength || ""}
              onChange={(e) =>
                setValidations({
                  ...validations,
                  minLength: e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined,
                })
              }
              sx={{ mt: 2 }}
              fullWidth
            />
            <TextField
              type="number"
              label="Max Length"
              value={validations.maxLength || ""}
              onChange={(e) =>
                setValidations({
                  ...validations,
                  maxLength: e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined,
                })
              }
              sx={{ mt: 2 }}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Field
        </Button>
      </DialogActions>
    </Dialog>
  );
}


//8th edit
 
