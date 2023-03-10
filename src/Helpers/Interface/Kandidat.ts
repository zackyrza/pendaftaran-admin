import { IPendaftaran } from "./Pendaftaran";

export interface IKandidat {
  id: number,
  name: string,
  registrationId: number,
  registration?: IPendaftaran,
  status: string,
  nik: string,
  gender: string,
  placeOfBirth: string,
  birthDate: Date,
  age: number,
  education: string,
  bloodType: string,
  rhesusType: string,
  weight: number,
  height: number,
  handphone: string,
  religion: string,
  occupation: string,
  maritalStatus: string,
  email: string,
  photo: string,
  ktp: string,
  ijazah: string,
  shoesNumber: string,
  shirtSize: string,
  deletedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}

export interface IKandidatPost {
  name: string,
  registrationId: number,
  status: string,
  nik: string,
  gender: string,
  placeOfBirth: string,
  birthDate: Date,
  age: number,
  education: string,
  bloodType: string,
  rhesusType: string,
  weight: number,
  height: number,
  handphone: string,
  religion: string,
  occupation: string,
  maritalStatus: string,
  email: string,
  photo: string,
  ktp: string,
  ijazah: string,
  shoesNumber: string,
  shirtSize: string,
}