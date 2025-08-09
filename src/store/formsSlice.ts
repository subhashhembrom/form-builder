// src/store/formsSlice.ts
//import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import { FormSchema, FieldSchema } from '../types.ts';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormSchema, FieldSchema } from '../types';

import { v4 as uuid } from 'uuid';

const LS_KEY = 'upliance_forms_v1';

interface State {
  currentForm: FormSchema;
  savedForms: FormSchema[];
}

const loadSaved = (): FormSchema[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FormSchema[];
  } catch {
    return [];
  }
};

const initialForm: FormSchema = { id: 'current', name: 'Untitled', createdAt: new Date().toISOString(), fields: [] };

const initialState: State = {
  currentForm: initialForm,
  savedForms: loadSaved(),
};

const slice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<Omit<FieldSchema, 'id'>>) {
      const field: FieldSchema = { id: uuid(), ...action.payload };
      state.currentForm.fields.push(field);
    },
    updateField(state, action: PayloadAction<{ id: string; patch: Partial<FieldSchema> }>) {
      const idx = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
      if (idx >= 0) state.currentForm.fields[idx] = { ...state.currentForm.fields[idx], ...action.payload.patch };
    },
    deleteField(state, action: PayloadAction<string>) {
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
    },
    reorderField(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const arr = state.currentForm.fields;
      if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
    },
    setCurrentForm(state, action: PayloadAction<FormSchema>) {
      state.currentForm = action.payload;
    },
    resetCurrentForm(state) {
      state.currentForm = initialForm;
    },
    saveForm(state, action: PayloadAction<{ name: string }>) {
      const formToSave: FormSchema = {
        ...state.currentForm,
        id: uuid(),
        name: action.payload.name,
        createdAt: new Date().toISOString(),
      };
      state.savedForms.unshift(formToSave);
      // persist
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(state.savedForms));
      } catch {}
    },
    deleteSavedForm(state, action: PayloadAction<string>) {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
      localStorage.setItem(LS_KEY, JSON.stringify(state.savedForms));
    }
  },
});

export const { addField, updateField, deleteField, reorderField, setCurrentForm, resetCurrentForm, saveForm, deleteSavedForm } = slice.actions;
export default slice.reducer;