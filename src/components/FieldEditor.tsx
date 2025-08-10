
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
  //MenuItem,
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
 
