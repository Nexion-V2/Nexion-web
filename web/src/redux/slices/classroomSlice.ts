import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import type { Classroom, Assignment } from "@/types/classroom";
import type { RootState } from "@/redux/store";

// -------------------- ASYNC THUNKS --------------------


// Create new classroom
export const createClassroom = createAsyncThunk<
  Classroom,
  Partial<Classroom>,
  { rejectValue: string }
>("classroom/createClassroom", async (newClassroom, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classroom/classes`,
      newClassroom,
      { withCredentials: true }
    );
    return res.data.classroom ?? res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create classroom"
    );
  }
});

// Join classroom
export const joinClassroom = createAsyncThunk<
  Classroom,
  string,
  { rejectValue: string }
>("classroom/joinClassroom", async (joinCode, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classroom/classes/join`,
      { joinCode },
      { withCredentials: true }
    );
    return res.data.classroom ?? res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to join classroom"
    );
  }
});

// Fetch all classrooms
export const fetchClassrooms = createAsyncThunk<
  Classroom[],
  void,
  { rejectValue: string }
>("classroom/fetchClassrooms", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classroom/classes`,
      { withCredentials: true }
    );
    return res.data.classrooms ?? res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch classrooms"
    );
  }
});

// Add assignment
export const addAssignment = createAsyncThunk<
  Assignment,
  { classroomId: string; assignment: Partial<Assignment> },
  { rejectValue: string }
>("classroom/addAssignment", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classroom/classes/${data.classroomId}/assignments`,
      data.assignment,
      { withCredentials: true }
    );
    return res.data.assignment ?? res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add assignment"
    );
  }
});

// Delete assignment
export const deleteAssignment = createAsyncThunk<
  { assignmentId: string; classroomId: string },
  { assignmentId: string; classroomId: string },
  { rejectValue: string }
>("classroom/deleteAssignment", async (data, { rejectWithValue }) => {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classroom/classes/${data.classroomId}/assignments/${data.assignmentId}`,
      { withCredentials: true }
    );
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete assignment"
    );
  }
});

// -------------------- Submit Assignment --------------------
export const submitAssignment = createAsyncThunk<
  {
    classroomId: string;
    assignmentId: string;
    submission: {
      _id: string;
      // studentId: string;
      content: string;
      submittedAt: string;
    };
  },
  {
    classroomId: string;
    assignmentId: string;
    submission: { 
      _id: string;
      // studentId: string;
      content: string;
      submittedAt: string;
    };
  },
  { rejectValue: string }
>(
  "classroom/submitAssignment",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classroom/classes/${data.classroomId}/assignments/${data.assignmentId}/submissions`,
        data.submission,
        { withCredentials: true }
      );
      return {
        classroomId: data.classroomId,
        assignmentId: data.assignmentId,
        submission: res.data.submission ?? res.data,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit assignment"
      );
    }
  }
);

// -------------------- Unsubmit Assignment --------------------
export const unsubmitAssignment = createAsyncThunk<
  { classroomId: string; assignmentId: string; studentId: string }, // ReturnedType
  { classroomId: string; assignmentId: string; studentId: string }, // ArgumentType
  { rejectValue: string } // ThunkApiConfig
>(
  "classroom/unsubmitAssignment",
  async (data, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classroom/classes/${data.classroomId}/assignments/${data.assignmentId}/submissions/${data.studentId}`,
        { withCredentials: true }
      );
      return {
        classroomId: data.classroomId,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unsubmit assignment"
      );
    }
  }
);


// -------------------- STATE --------------------

interface AsyncStatus {
  loading: boolean;
  error: string | null;
}

interface ClassroomState {
  entities: Record<string, Classroom>;
  ids: string[];
  selectedId: string | null;

  fetchList: AsyncStatus;
  create: AsyncStatus;
  addAssignmentStatus: AsyncStatus;
  deleteAssignmentStatus: AsyncStatus;
  createClassroom: AsyncStatus;
  joinClassroom: AsyncStatus;
}

const initialState: ClassroomState = {
  entities: {},
  ids: [],
  selectedId: null,

  fetchList: { loading: false, error: null },
  create: { loading: false, error: null },
  addAssignmentStatus: { loading: false, error: null },
  deleteAssignmentStatus: { loading: false, error: null },
  createClassroom: { loading: false, error: null },
  joinClassroom: { loading: false, error: null },
};

// -------------------- SLICE --------------------

const classroomSlice = createSlice({
  name: "classroom",
  initialState,
  reducers: {
    selectClassroom: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },

    updateClassroom: (state, action: PayloadAction<Classroom>) => {
      state.entities[action.payload._id] = action.payload;
      if (!state.ids.includes(action.payload._id))
        state.ids.push(action.payload._id);
    },

    updateAssignment: (
      state,
      action: PayloadAction<{
        classroomId: string;
        assignmentId: string;
        updatedFields: Partial<Assignment>;
      }>
    ) => {
      const classroom = state.entities[action.payload.classroomId];
      if (!classroom || !classroom.assignments) return;

      const idx = classroom.assignments.findIndex(
        (a) => a._id === action.payload.assignmentId
      );
      if (idx !== -1) {
        classroom.assignments[idx] = {
          ...classroom.assignments[idx],
          ...action.payload.updatedFields,
        };
      }
    },
  },

  extraReducers: (builder) => {
    // Fetch list
    builder.addCase(fetchClassrooms.pending, (state) => {
      state.fetchList.loading = true;
      state.fetchList.error = null;
    });

    builder.addCase(fetchClassrooms.fulfilled, (state, action) => {
      state.fetchList.loading = false;

      state.ids = action.payload.map((c) => c._id);
      state.entities = action.payload.reduce((acc, c) => {
        acc[c._id] = c;
        return acc;
      }, {} as Record<string, Classroom>);
    });

    builder.addCase(fetchClassrooms.rejected, (state, action) => {
      state.fetchList.loading = false;
      state.fetchList.error = action.payload ?? "Failed to fetch classrooms";
    });

    // Create classroom
    builder.addCase(createClassroom.pending, (state) => {
      state.createClassroom.loading = true;
      state.createClassroom.error = null;
    });

    builder.addCase(createClassroom.fulfilled, (state, action) => {
      state.createClassroom.loading = false;
      state.entities[action.payload._id] = action.payload;
      if (!state.ids.includes(action.payload._id))
        state.ids.push(action.payload._id);

      state.selectedId = action.payload._id;
    });

    builder.addCase(createClassroom.rejected, (state, action) => {
      state.createClassroom.loading = false;
      state.createClassroom.error = action.payload ?? "Failed to create classroom";
    });
    // Join classroom
    builder.addCase(joinClassroom.pending, (state) => {
      state.joinClassroom.loading = true;
      state.joinClassroom.error = null;
    });
    builder.addCase(joinClassroom.fulfilled, (state, action) => {
      state.joinClassroom.loading = false;
      state.entities[action.payload._id] = action.payload;
      if (!state.ids.includes(action.payload._id))
        state.ids.push(action.payload._id);
      state.selectedId = action.payload._id;
    });
    builder.addCase(joinClassroom.rejected, (state, action) => {
      state.joinClassroom.loading = false;
      state.joinClassroom.error = action.payload ?? "Failed to join classroom";
    });

    // Add assignment
    builder.addCase(addAssignment.pending, (state) => {
      state.addAssignmentStatus.loading = true;
      state.addAssignmentStatus.error = null;
    });

    builder.addCase(addAssignment.fulfilled, (state, action) => {
      state.addAssignmentStatus.loading = false;

      const classroomId = action.meta.arg.classroomId;
      const classroom = state.entities[classroomId];

      if (classroom) {
        classroom.assignments = classroom.assignments ?? [];
        classroom.assignments.push(action.payload);
      }
    });

    builder.addCase(addAssignment.rejected, (state, action) => {
      state.addAssignmentStatus.loading = false;
      state.addAssignmentStatus.error =
        action.payload ?? "Failed to add assignment";
    });

    // Delete assignment
    builder.addCase(deleteAssignment.fulfilled, (state, action) => {
      state.deleteAssignmentStatus.loading = false;
      state.deleteAssignmentStatus.error = null;
      const { classroomId, assignmentId } = action.payload;
      const classroom = state.entities[classroomId];
      if (classroom) {
        classroom.assignments = classroom.assignments?.filter(
          (assignment) => assignment._id !== assignmentId
        );
      }
    });

    builder.addCase(deleteAssignment.rejected, (state, action) => {
      state.deleteAssignmentStatus.error =
        action.payload ?? "Failed to delete assignment";
    });

    builder.addCase(deleteAssignment.pending, (state) => {
      state.deleteAssignmentStatus.loading = true;
      state.deleteAssignmentStatus.error = null;
    });
  },
});

// -------------------- SELECTORS --------------------

export const selectSelectedClassroom = (state: RootState) => {
  const id = state.classroom.selectedId;
  return id ? state.classroom.entities[id] : null;
};

// -------------------- EXPORTS --------------------
export const { selectClassroom, updateClassroom, updateAssignment } =
  classroomSlice.actions;

export default classroomSlice.reducer;
