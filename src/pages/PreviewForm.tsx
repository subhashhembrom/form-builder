// src/pages/PreviewForm.tsx
/* import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Button } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useForm } from 'react-hook-form';
import FieldRenderer from '../components/FieldRenderer';
import { evaluateFormula } from '../utils/evaluateFormula';
import { setCurrentForm } from '../store/formsSlice';

export default function PreviewForm() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const savedForms = useAppSelector(s => s.forms.savedForms);
  const currentForm = useAppSelector(s => s.forms.currentForm);

  useEffect(() => {
    if (id) {
      const f = savedForms.find(x => x.id === id);
      if (f) dispatch(setCurrentForm(f));
    }
  }, [id]);

  const form = useAppSelector(s => s.forms.currentForm);
  const defaultValues = form.fields.reduce((acc: any, f) => { acc[f.key] = f.defaultValue ?? ''; return acc; }, {});
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({ defaultValues });

  // Watch all parents used in derived fields
  useEffect(() => {
    // Build a list of derived fields
    const derivedFields = form.fields.filter(f => f.derived);
    if (!derivedFields.length) return;
    // subscribe to all inputs — simpler: watch whole form values
    const subscription = watch((values) => {
      derivedFields.forEach(df => {
        if (!df.derived) return;
        const parentKeys = df.derived.parentKeys;
        const parentVals = parentKeys.map(k => values[k]);
        try {
          const computed = evaluateFormula(df.derived.expression, parentKeys, parentVals);
          // set value silently
          setValue(df.key, computed, { shouldValidate: true, shouldDirty: true });
        } catch {}
      });
    });
    return () => subscription.unsubscribe();
  }, [form.fields, watch, setValue]);

  function onSubmit(values: any) {
    alert('Form submitted (we do not persist values):\n' + JSON.stringify(values, null, 2));
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Preview: {form.name || 'Untitled'}</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {form.fields.map(f => (
            <FieldRenderer key={f.id} field={f} register={register} errors={errors} />
          ))}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit</Button>
        </form>
      </Paper>
    </Container>
  );
} */

 // src/components/PreviewForm.tsx (2nd edit)
/*import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Typography, TextField, FormControlLabel, Checkbox, RadioGroup, Radio, Select, MenuItem, Box } from '@mui/material';

export default function PreviewForm() {
  const fields = useAppSelector(state => state.forms.currentForm.fields);

  if (!fields.length) {
    return <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>No fields to preview.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Form Preview</Typography>
      {fields.map(field => {
        const { key, label, type, defaultValue, options, required } = field;

        // Render based on type
        switch (type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
            return (
              <TextField
                key={key}
                label={label + (required ? ' *' : '')}
                type={type === 'text' ? 'text' : type}
                defaultValue={defaultValue}
                margin="normal"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            );

          case 'checkbox':
            return (
              <Box key={key} sx={{ mb: 2 }}>
                <Typography>{label + (required ? ' *' : '')}</Typography>
                {options?.map(option => (
                  <FormControlLabel
                    key={option}
                    control={<Checkbox defaultChecked={defaultValue === option} disabled />}
                    label={option}
                  />
                ))}
              </Box>
            );

          case 'radio':
            return (
              <Box key={key} sx={{ mb: 2 }}>
                <Typography>{label + (required ? ' *' : '')}</Typography>
                <RadioGroup defaultValue={defaultValue}>
                  {options?.map(option => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio disabled />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </Box>
            );

          case 'select':
            return (
              <Select
                key={key}
                label={label + (required ? ' *' : '')}
                defaultValue={defaultValue || ''}
                fullWidth
                disabled
                margin="normal"
                displayEmpty
                renderValue={selected => selected || 'Select an option'}
                sx={{ mt: 2, mb: 2 }}
              >
                {options?.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            );

          default:
            return (
              <Typography key={key} color="textSecondary" sx={{ mb: 2 }}>
                Unsupported field type: {type}
              </Typography>
            );
        }
      })}
    </Box>
  );
}
 */

import React from 'react';
import { useAppSelector } from '../store/hooks';
import {
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Box
} from '@mui/material';

export default function PreviewForm() {
  const fields = useAppSelector(state => state.forms.currentForm.fields);

  if (!fields.length) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
        No fields to preview.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2
      }}
    >
      <Typography variant="h4" gutterBottom>
        Form Preview
      </Typography>

      {fields.map((field, fieldIndex) => {
        const { key, label, type, defaultValue, options, required } = field;

        switch (type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
            return (
              <TextField
                key={key || `field-${fieldIndex}`}
                label={label + (required ? ' *' : '')}
                type={type === 'text' ? 'text' : type}
                defaultValue={defaultValue}
                margin="normal"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            );

            case 'textarea':
              return (
                <TextField
                 key={key || `field-${fieldIndex}`}
                 label={label + (required ? ' *' : '')}
                 defaultValue={defaultValue}
                 margin="normal"
                 fullWidth
                 multiline
                 minRows={3}
                InputProps={{ readOnly: true }}
              />
             );

           case 'date':
              return (
             <TextField
              key={key || `field-${fieldIndex}`}
             label={label + (required ? ' *' : '')}
            type="date"
            defaultValue={defaultValue}
            margin="normal"
            fullWidth
            InputLabelProps={{
            shrink: true, // keeps label above the input
          }}
          InputProps={{ readOnly: true }}
        />
      );
  


          case 'checkbox':
            return (
              <Box key={key || `field-${fieldIndex}`} sx={{ mb: 2 }}>
                <Typography>{label + (required ? ' *' : '')}</Typography>
                {options?.map((option, optionIndex) => (
                  <FormControlLabel
                    key={`${key || fieldIndex}-checkbox-${optionIndex}`}
                    control={
                      <Checkbox
                        defaultChecked={defaultValue === option}
                        disabled
                      />
                    }
                    label={option}
                  />
                ))}
              </Box>
            );

          case 'radio':
            return (
              <Box key={key || `field-${fieldIndex}`} sx={{ mb: 2 }}>
                <Typography>{label + (required ? ' *' : '')}</Typography>
                <RadioGroup defaultValue={defaultValue}>
                  {options?.map((option, optionIndex) => (
                    <FormControlLabel
                      key={`${key || fieldIndex}-radio-${optionIndex}`}
                      value={option}
                      control={<Radio disabled />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </Box>
            );

          case 'select':
            return (
              <Select
                key={key || `field-${fieldIndex}`}
                defaultValue={defaultValue || ''}
                fullWidth
                disabled
                margin="normal"
                displayEmpty
                renderValue={selected => selected || 'Select an option'}
                sx={{ mt: 2, mb: 2 }}
              >
                {options?.map((option, optionIndex) => (
                  <MenuItem
                    key={`${key || fieldIndex}-select-${optionIndex}`}
                    value={option}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            );

          default:
            return (
              <Typography
                key={key || `field-${fieldIndex}`}
                color="textSecondary"
                sx={{ mb: 2 }}
              >
                Unsupported field type: {type}
              </Typography>
            );
        }
      })}
    </Box>
  );
}
