export type UserInfo = {
  id: number
  role: "ADMIN" | "USER"
  username: string
}

export type DicomInfo = {
  id: string
  patientId: string
  studyDate: string
  modality: string
  status: "unannotated" | "annotated"
  review: "accept" | "pedding" | "reject"
}