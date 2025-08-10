// src/pages/PreviewForm.tsx
//import React from 'react';
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
                margin="dense" 
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
