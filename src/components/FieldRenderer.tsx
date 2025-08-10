
// 2nd edit 
 import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addField } from "../store/formsSlice";
import type { FieldType, FieldSchema, ValidationRules } from "../types";
import { v4 as uuid } from "uuid";

interface Props {
  open: boolean;
  type: FieldType;
  onClose: () => void;
}

export default function FieldEditor({ open, type, onClose }: Props) {
  const dispatch = useAppDispatch();
  const allFields = useAppSelector((s) => s.forms.currentForm.fields);

  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [validations, setValidations] = useState<ValidationRules>({});
  const [derivedEnabled, setDerivedEnabled] = useState(false);
  const [parentKeys, setParentKeys] = useState<string[]>([]);
  const [expression, setExpression] = useState("");

  function handleSave() {
    const newField: FieldSchema = {
      id: uuid(),
      key: label.toLowerCase().replace(/\s+/g, "_"),
      type,
      label,
      required,
      defaultValue,
      validations: validations,
      derived: derivedEnabled
        ? { parentKeys, expression }
        : null,
    };

    dispatch(addField(newField));
    onClose();
  }

  function toggleValidation(name: keyof ValidationRules) {
    setValidations((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure {type} Field</DialogTitle>
      <DialogContent dividers>
        {/* Label */}
        <TextField
          label="Field Label"
          fullWidth
          margin="normal"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        {/* Required */}
        <FormControlLabel
          control={
            <Switch
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          }
          label="Required"
        />

        {/* Default Value */}
        <TextField
          label="Default Value"
          fullWidth
          margin="normal"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
        />

        {/* Validation Rules */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Validation Rules
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!validations.notEmpty}
                onChange={() => toggleValidation("notEmpty")}
              />
            }
            label="Not Empty"
          />
          <TextField
            label="Minimum Length"
            type="number"
            fullWidth
            margin="dense"
            value={validations.minLength ?? ""}
            onChange={(e) =>
              setValidations((prev) => ({
                ...prev,
                minLength: Number(e.target.value) || undefined,
              }))
            }
          />
          <TextField
            label="Maximum Length"
            type="number"
            fullWidth
            margin="dense"
            value={validations.maxLength ?? ""}
            onChange={(e) =>
              setValidations((prev) => ({
                ...prev,
                maxLength: Number(e.target.value) || undefined,
              }))
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!validations.email}
                onChange={() => toggleValidation("email")}
              />
            }
            label="Email Format"
          />
          {/* Password Rule */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Password Rule
          </Typography>
          <TextField
            label="Password Min Length"
            type="number"
            fullWidth
            margin="dense"
            value={validations.passwordRule?.minLength ?? ""}
            onChange={(e) =>
              setValidations((prev) => ({
                ...prev,
                passwordRule: {
                  ...prev.passwordRule,
                  minLength: Number(e.target.value) || undefined,
                },
              }))
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!validations.passwordRule?.requireNumber}
                onChange={() =>
                  setValidations((prev) => ({
                    ...prev,
                    passwordRule: {
                      ...prev.passwordRule,
                      requireNumber: !prev.passwordRule?.requireNumber,
                    },
                  }))
                }
              />
            }
            label="Require Number"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!validations.passwordRule?.requireSpecial}
                onChange={() =>
                  setValidations((prev) => ({
                    ...prev,
                    passwordRule: {
                      ...prev.passwordRule,
                      requireSpecial: !prev.passwordRule?.requireSpecial,
                    },
                  }))
                }
              />
            }
            label="Require Special Character"
          />
        </FormGroup>

        {/* Derived Field */}
        <Typography variant="subtitle1" sx={{ mt: 3 }}>
          Derived Field
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={derivedEnabled}
              onChange={(e) => setDerivedEnabled(e.target.checked)}
            />
          }
          label="Enable Derived Field"
        />
        {derivedEnabled && (
          <>
            <FormControl fullWidth margin="dense">
              <InputLabel>Parent Fields</InputLabel>
              <Select
                multiple
                value={parentKeys}
                onChange={(e) => setParentKeys(e.target.value as string[])}
              >
                {allFields
                  .filter((f) => f.key !== label.toLowerCase().replace(/\s+/g, "_"))
                  .map((f) => (
                    <MenuItem key={f.key} value={f.key}>
                      {f.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Formula (JS Expression)"
              fullWidth
              margin="dense"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="Example: parseInt(a) + parseInt(b)"
            />
          </>
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
