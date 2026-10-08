import { AuthUser } from '../types';

export interface UserAccount extends AuthUser {
  passwordHash: string; // Plaintext or hashed demo password
}

export const SYSTEM_ACCOUNTS: UserAccount[] = [
  // Admin / Physical Therapist Accounts
  {
    id: 'usr-admin-mimnasikan',
    username: 'mimnasikan',
    passwordHash: '123456',
    name: 'กภ. มิมนสิการ (ผู้ดูแลระบบคลินิก)',
    role: 'admin',
    title: 'หัวหน้านักกายภาพบำบัด / ผู้ดูแลระบบคลินิก',
    email: 'mimnasikan@physiocare.com',
  },
  {
    id: 'usr-pt-1',
    username: 'pt01',
    passwordHash: '123456',
    name: 'กภ. นัฐวุฒิ นพรัตน์',
    role: 'admin',
    title: 'นักกายภาพบำบัดวิชาชีพ',
    email: 'nattawut.pt@clinic.com',
  },

  // Patient Accounts (Linked to mock patients P001-P005)
  {
    id: 'usr-p001',
    username: 'p001',
    passwordHash: '1234',
    name: 'คุณนภัส (HN: 126xxx)',
    patientCode: 'P001',
    hn: 'HN: 126xxx',
    role: 'patient',
    title: 'ผู้ป่วยออฟฟิศซินโดรม / คอยื่น (W4)',
  },
  {
    id: 'usr-p002',
    username: 'p002',
    passwordHash: '1234',
    name: 'คุณธีรภัทร (HN: 128xxx)',
    patientCode: 'P002',
    hn: 'HN: 128xxx',
    role: 'patient',
    title: 'ผู้ป่วยไหล่ห่อ สะบักจม (W4)',
  },
  {
    id: 'usr-p003',
    username: 'p003',
    passwordHash: '1234',
    name: 'คุณพัชรา (HN: 131xxx)',
    patientCode: 'P003',
    hn: 'HN: 131xxx',
    role: 'patient',
    title: 'ผู้ป่วยปวดหลังส่วนบนเรื้อรัง (W1)',
  },
  {
    id: 'usr-p004',
    username: 'p004',
    passwordHash: '1234',
    name: 'คุณวรวิทย์ (HN: 133xxx)',
    patientCode: 'P004',
    hn: 'HN: 133xxx',
    role: 'patient',
    title: 'ผู้ป่วยคอยื่น ปวดศีรษะตึง (W3)',
  },
  {
    id: 'usr-p005',
    username: 'p005',
    passwordHash: '1234',
    name: 'คุณกัญญา (HN: 135xxx)',
    patientCode: 'P005',
    hn: 'HN: 135xxx',
    role: 'patient',
    title: 'ผู้ป่วยปวดสะบักร้าวขึ้นคอ (W0)',
  },
];
