export interface Classroom {
  _id: string
  name: string
  description: string
  isTeacher: boolean
  teacherName: string
  joinCode: string
  members?: string[]
  assignments: Assignment[]
  lectureNotes: LectureNote[]
  discussions: Discussion[]
}

export interface Assignment {
  _id: string
  title: string
  dueDate: string
  dueTime?: string
  discussions: Discussion[]
  submissions?: Submission[]
  createdBy?: string
  description?: string
}

export interface Submission {
  _id: string
  studentName?: string
  studentId?: string
  content: string
  submittedAt: string
  status?: "submitted" | "graded" | "pending"
  grade?: number
  feedback?: string
}

export interface LectureNote {
  _id: string
  title: string
  date: string
}

export interface Discussion {
  _id: string
  author: string
  message: string
  replies: number
  timestamp: string
}
