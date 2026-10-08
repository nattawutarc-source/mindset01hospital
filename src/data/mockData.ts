import { Exercise, PatientProfile, PostureAssessment } from '../types';

import defaultSideImg from '../assets/images/posture_side_view_1791457374220.jpg';
import defaultFrontImg from '../assets/images/posture_front_view_1791457386252.jpg';
import defaultBackImg from '../assets/images/posture_back_view_1791458887182.jpg';
import defaultChinTuckImg from '../assets/images/exercise_chin_tuck_1791457396414.jpg';

export const SAMPLE_IMAGES = {
  side: defaultSideImg,
  front: defaultFrontImg,
  back: defaultBackImg,
  chinTuck: defaultChinTuckImg,
};

export const EXERCISES: Exercise[] = [
  {
    id: 'chin-tuck',
    title: 'Chin Tuck',
    thaiName: 'เก็บคาง ดึงลำคอตรง',
    category: 'strengthening',
    setsRepsText: '10 ครั้ง x 2 เซต',
    repsTarget: 10,
    setsTarget: 2,
    holdSeconds: 5,
    phaseWeeks: '1-2',
    cue: 'ให้คางถอยเข้า ไม่เงยศีรษะ',
    description: 'ฝึกกล้ามเนื้อมัดลึกด้านหน้าลำคอ (Deep Neck Flexors) เพื่อลดอาการคอยื่น Forward Head Posture',
    instructions: [
      'นั่งหรือยืนตัวตรง สายตามองตรงไปข้างหน้าในระดับสายตา',
      'ใช้นิ้วชี้แตะเบาๆ ที่คาง แล้วดึงคางถอยไปด้านหลังในแนวระนาบ (เหมือนทำคางสองชั้น)',
      'ห้ามก้มหน้าหรือเงยหน้า ศีรษะต้องเลื่อนไปด้านหลังตรงๆ',
      'เกร็งค้างไว้ 5 วินาที แล้วผ่อนกลับสู่ท่าเริ่มต้น',
      'ทำซ้ำ 10 ครั้ง จำนวน 2 เซตต่อวัน'
    ],
    imageUrl: defaultChinTuckImg
  },
  {
    id: 'upper-trapezius-stretch',
    title: 'Upper Trapezius Stretch',
    thaiName: 'ยืดกล้ามเนื้อบ่าด้านบน',
    category: 'stretching',
    setsRepsText: '30 วินาที x 3 ครั้ง',
    repsTarget: 3,
    setsTarget: 1,
    holdSeconds: 30,
    phaseWeeks: '1-2',
    cue: 'เอียงคอช้าๆ ไม่ยกไหล่ข้างที่ยืด',
    description: 'คลายความตึงสะสมบริเวณต้นคอและบ่าจากการนั่งทำงานหน้าคอมพิวเตอร์',
    instructions: [
      'นั่งตัวตรงบนเก้าอี้ มือข้างหนึ่งจับใต้ที่นั่งเพื่อยึดหัวไหล่ให้อยู่กับที่',
      'มืออีกข้างเอื้อมข้ามศีรษะไปแตะใบหูด้านตรงข้าม',
      'ค่อยๆ โน้มศีรษะเอียงไปด้านข้างเบาๆ จนรู้สึกตึงสบายที่กล้ามเนื้อบ่า',
      'หายใจเข้า-ออกลึกๆ สม่ำเสมอ ค้างไว้ 30 วินาที ทำสลับ 2 ข้าง'
    ],
    imageUrl: defaultChinTuckImg
  },
  {
    id: 'thoracic-extension',
    title: 'Thoracic Extension',
    thaiName: 'ยืดเหยียดหลังส่วนบน',
    category: 'mobility',
    setsRepsText: '10 ครั้ง x 2 เซต',
    repsTarget: 10,
    setsTarget: 2,
    holdSeconds: 5,
    phaseWeeks: '1-2',
    cue: 'แอ่นเฉพาะหลังบน ห้ามแอ่นหลังล่าง',
    description: 'เพิ่มองศาการเคลื่อนไหวของกระดูกสันหลังระดับอก ลดอาการหลังค่อม (Kyphosis)',
    instructions: [
      'นั่งตัวตรง พนักเก้าอี้อยู่ระดับสะบักล่าง หรือใช้โฟมโรลเลอร์หนุน',
      'ประสานมือสองข้างไว้ที่ท้ายทอย เพื่อประคองลำคอ',
      'ค่อยๆ เอนลำตัวส่วนบนไปด้านหลังข้ามพนักเก้าอี้ พร้อมหายใจออกช้าๆ',
      'ค้างไว้ 3-5 วินาที แล้วกลับสู่ท่าเดิม ทำ 10 ครั้ง'
    ],
    imageUrl: defaultChinTuckImg
  },
  {
    id: 'scapular-retraction',
    title: 'Scapular Retraction',
    thaiName: 'บีบสะบักเข้าหากัน',
    category: 'strengthening',
    setsRepsText: '10 ครั้ง x 2 เซต',
    repsTarget: 10,
    setsTarget: 2,
    holdSeconds: 5,
    phaseWeeks: '3-4',
    cue: 'ดึงสะบักลงและหนีบเข้าหากัน ไม่งอหลัง',
    description: 'เสริมความแข็งแรงกล้ามเนื้อ Rhomboids และ Middle Trapezius เพื่อเปิดหัวไหล่',
    instructions: [
      'ยืนหรือนั่งตัวตรง แขนแนบลำตัว ข้อศอกงอ 90 องศา',
      'หมุนแขนและสะบักไปด้านหลัง พร้อมดึงสะบักสองข้างบีบเข้าหากัน',
      'ระวังอย่าให้หัวไหล่ยกขึ้นไปทางใบหู',
      'เกร็งค้างไว้ 5 วินาที แล้วผ่อนออก ทำซ้ำ 10 ครั้ง'
    ],
    imageUrl: defaultChinTuckImg
  },
  {
    id: 'pectoralis-stretch',
    title: 'Pectoralis Stretch',
    thaiName: 'ยืดกล้ามเนื้อหน้าอก',
    category: 'stretching',
    setsRepsText: '30 วินาที x 3 ครั้ง',
    repsTarget: 3,
    setsTarget: 1,
    holdSeconds: 30,
    phaseWeeks: '3-4',
    cue: 'ก้าวขาไปข้างหน้าเบาๆ จนรู้สึกตึงอก',
    description: 'ยืดคลายกล้ามเนื้อหน้าอกที่หดสั้นจากการก้มพิมพ์งาน ลดภาวะไหล่ห่อ (Rounded Shoulders)',
    instructions: [
      'ยืนข้างมุมเสาหรือกรอบประตู ยกท่อนแขนตั้งฉากวางแนบกับขอบ',
      'ก้าวเท้าด้านเดียวกับแขนไปข้างหน้าหนึ่งก้าว โน้มตัวไปข้างหน้าเบาๆ',
      'จะรู้สึกตึงบริเวณกล้ามเนื้อหน้าอกด้านหน้า ไม่เจ็บแปลบที่หัวไหล่',
      'ค้างไว้ 30 วินาที ทำซ้ำ 3 ครั้งต่อข้าง'
    ],
    imageUrl: defaultChinTuckImg
  }
];

export const INITIAL_ASSESSMENT_P001_W0: PostureAssessment = {
  id: 'asm-p001-w0',
  patientId: 'P001',
  week: 0,
  date: '5 ต.ค. 2025',
  sideImageUrl: defaultSideImg,
  frontImageUrl: defaultFrontImg,
  backImageUrl: defaultBackImg,
  cvaAngle: 46.0,
  shoulderC7Angle: 21.0,
  shoulderTiltDeg: 2.8,
  scapularTiltDeg: 2.5,
  trunkAlignment: 'อยู่ในแนว',
  scapularSymmetry: 'สะบักขวาต่ำกว่าเล็กน้อย (2.5°)',
  spineAlignment: 'ตรงแนวปกติ',
  restPain: 4,
  workPain: 7,
  ptNotes: 'พบภาวะ Forward Head Posture ชัดเจน CVA ต่ำกว่าเกณฑ์ปกติ (46° จากปกติ >50°), อาการปวดสัมพันธ์กับท่านั่งทำงานเกิน 2 ชม.',
  landmarksSide: {
    tragus: { x: 50, y: 15 },
    c7: { x: 53, y: 22 },
    shoulder: { x: 55, y: 27 },
    horizontalRef: { x: 75, y: 22 },
  },
  landmarksFront: {
    leftShoulder: { x: 42, y: 28 },
    rightShoulder: { x: 58, y: 29.5 },
  },
  landmarksBack: {
    leftScapula: { x: 44, y: 32 },
    rightScapula: { x: 56, y: 33.2 },
    spineTop: { x: 50, y: 22 },
    spineBottom: { x: 50, y: 65 },
  }
};

export const ASSESSMENT_P001_W4: PostureAssessment = {
  id: 'asm-p001-w4',
  patientId: 'P001',
  week: 4,
  date: '2 พ.ย. 2025',
  sideImageUrl: defaultSideImg,
  frontImageUrl: defaultFrontImg,
  backImageUrl: defaultBackImg,
  cvaAngle: 51.0,
  shoulderC7Angle: 16.0,
  shoulderTiltDeg: 1.5,
  scapularTiltDeg: 1.1,
  trunkAlignment: 'อยู่ในแนว',
  scapularSymmetry: 'สมดุลขึ้น (ต่างกัน 1.1°)',
  spineAlignment: 'ตรงแนวปกติ',
  restPain: 1,
  workPain: 3,
  ptNotes: 'องศาคอยื่นดีขึ้นมาก CVA ปรับตัวขึ้นสู่ 51° (+5°), ความตึงของบ่าลดลง และอาการปวดขณะทำงานลดจาก 7 เหลือ 3 คะแนน',
  landmarksSide: {
    tragus: { x: 51, y: 15 },
    c7: { x: 52, y: 22 },
    shoulder: { x: 54, y: 27 },
    horizontalRef: { x: 75, y: 22 },
  },
  landmarksFront: {
    leftShoulder: { x: 43, y: 28 },
    rightShoulder: { x: 57, y: 28.8 },
  },
  landmarksBack: {
    leftScapula: { x: 44, y: 32 },
    rightScapula: { x: 56, y: 32.5 },
    spineTop: { x: 50, y: 22 },
    spineBottom: { x: 50, y: 65 },
  }
};

export const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'P001',
    code: 'P001',
    name: 'คุณนภัส (HN: 126xxx)',
    hn: 'HN: 126xxx',
    condition: 'ออฟฟิศซินโดรม / คอยื่น ปวดคอบ่า',
    startDate: '5 ต.ค. 2025',
    latestWeek: 'W4',
    status: 'completed',
    cvaCurrent: 51.0,
    workPainCurrent: 3,
    hepCompliance: 80,
    assessments: [INITIAL_ASSESSMENT_P001_W0, ASSESSMENT_P001_W4],
    symptomLogs: [
      { id: 'log-1', patientId: 'P001', date: '5 ต.ค. 2025', restPain: 4, workPain: 7, triggers: ['นั่งนาน', 'ก้มหน้า', 'ใช้คอมพิวเตอร์'] },
      { id: 'log-2', patientId: 'P001', date: '12 ต.ค. 2025', restPain: 3, workPain: 6, triggers: ['นั่งนาน', 'ใช้คอมพิวเตอร์'] },
      { id: 'log-3', patientId: 'P001', date: '19 ต.ค. 2025', restPain: 2, workPain: 5, triggers: ['นั่งนาน'] },
      { id: 'log-4', patientId: 'P001', date: '26 ต.ค. 2025', restPain: 2, workPain: 4, triggers: ['เครียด'] },
      { id: 'log-5', patientId: 'P001', date: '2 พ.ย. 2025', restPain: 1, workPain: 3, triggers: ['ใช้คอมพิวเตอร์'] },
    ]
  },
  {
    id: 'P002',
    code: 'P002',
    name: 'คุณธีรภัทร (HN: 128xxx)',
    hn: 'HN: 128xxx',
    condition: 'ไหล่ห่อ สะบักจม นั่งพิมพ์งานนาน',
    startDate: '10 ต.ค. 2025',
    latestWeek: 'W4',
    status: 'completed',
    cvaCurrent: 52.1,
    workPainCurrent: 3,
    hepCompliance: 85,
    assessments: [
      {
        ...INITIAL_ASSESSMENT_P001_W0,
        id: 'asm-p002-w0',
        patientId: 'P002',
        cvaAngle: 47.5,
        workPain: 6,
        restPain: 3,
      },
      {
        ...ASSESSMENT_P001_W4,
        id: 'asm-p002-w4',
        patientId: 'P002',
        cvaAngle: 52.1,
        workPain: 3,
        restPain: 1,
      }
    ],
    symptomLogs: []
  },
  {
    id: 'P003',
    code: 'P003',
    name: 'คุณพัชรา (HN: 131xxx)',
    hn: 'HN: 131xxx',
    condition: 'ปวดหลังส่วนบน เรื้อรัง 3 เดือน',
    startDate: '18 ต.ค. 2025',
    latestWeek: 'W1',
    status: 'in-progress',
    cvaCurrent: 38.5,
    workPainCurrent: 6,
    hepCompliance: 65,
    assessments: [
      {
        ...INITIAL_ASSESSMENT_P001_W0,
        id: 'asm-p003-w0',
        patientId: 'P003',
        cvaAngle: 38.5,
        workPain: 6,
        restPain: 4,
      }
    ],
    symptomLogs: []
  },
  {
    id: 'P004',
    code: 'P004',
    name: 'คุณวรวิทย์ (HN: 133xxx)',
    hn: 'HN: 133xxx',
    condition: 'คอยื่น ปวดศีรษะแบบ Tension headache',
    startDate: '12 ต.ค. 2025',
    latestWeek: 'W3',
    status: 'in-progress',
    cvaCurrent: 49.0,
    workPainCurrent: 4,
    hepCompliance: 75,
    assessments: [
      {
        ...INITIAL_ASSESSMENT_P001_W0,
        id: 'asm-p004-w0',
        patientId: 'P004',
        cvaAngle: 45.0,
        workPain: 7,
      }
    ],
    symptomLogs: []
  },
  {
    id: 'P005',
    code: 'P005',
    name: 'คุณกัญญา (HN: 135xxx)',
    hn: 'HN: 135xxx',
    condition: 'ปวดสะบักร้าวขึ้นคอ เพิ่งเข้ารับการตรวจ',
    startDate: '28 ต.ค. 2025',
    latestWeek: 'W0',
    status: 'not-started',
    cvaCurrent: 44.3,
    workPainCurrent: 7,
    hepCompliance: 0,
    assessments: [
      {
        ...INITIAL_ASSESSMENT_P001_W0,
        id: 'asm-p005-w0',
        patientId: 'P005',
        cvaAngle: 44.3,
        workPain: 7,
        restPain: 5,
      }
    ],
    symptomLogs: []
  }
];

export const ARTICLES = [
  {
    id: 'fhp-explained',
    title: 'รู้จัก Craniovertebral Angle (CVA) คืออะไร?',
    subtitle: 'ทำไมมุม CVA ถึงบอกความเสี่ยงคอยื่นและปวดคอบ่าเรื้อรัง',
    category: 'การตรวจวิเคราะห์',
    readTime: '3 นาที',
    content: `Craniovertebral Angle (CVA) คือมุมที่วัดระหว่างเส้นแนวนอนที่ลากผ่านกระดูกสันหลังส่วนคอข้อที่ 7 (C7 Spinous process) กับเส้นที่ลากเชื่อมจาก C7 ไปยังติ่งหู (Tragus of the ear)

ค่ามาตรฐานจากการวิจัยทางการยศาสตร์และกายภาพบำบัด:
• ค่าปกติ: อยู่ที่ประมาณ 50° ถึง 55° ขึ้นไป
• ค่าน้อยกว่า 50°: บ่งบอกถึงภาวะ "คอยื่นไปด้านหน้า" (Forward Head Posture)

เมื่อศีรษะยื่นไปข้างหน้าทุกๆ 1 นิ้ว กล้ามเนื้อหลังคอและบ่าจะต้องแบกรับน้ำหนักเพิ่มขึ้นเสมือนศีรษะหนักขึ้น 4-5 กิโลกรัม นำไปสู่อาการปวดเมื่อย ตึงบ่า และปวดศีรษะไมเกรนเทียม`
  },
  {
    id: 'ergonomics-guide',
    title: '5 จุดตรวจโต๊ะทำงาน Ergonomics สำหรับชาวออฟฟิศ',
    subtitle: 'ปรับโต๊ะและเก้าอี้ให้เหมาะสม ป้องกันคอยื่นและหลังค่อม',
    category: 'การยศาสตร์',
    readTime: '4 นาที',
    content: `1. หน้าจอคอมพิวเตอร์: ขอบบนของจอควรอยู่ในระดับสายตา หรือต่ำกว่าเล็กน้อย ห่างประมาณ 1 ช่วงแขน (50-70 ซม.)
2. ความสูงเก้าอี้: เท้าวางราบกับพื้นได้เต็มฝ่าเท้า ข้อเข่างอประมาณ 90-100 องศา
3. ที่ท้าวแขน: รองรับข้อศอกที่มุม 90 องศา ไหล่ไม่ยก ไม่ห่อ
4. พนักพิงหลัง: มีส่วนหนุนหลังส่วนล่าง (Lumbar support)
5. กฎ 50/10: ทำงาน 50 นาที พักลุกยืดเส้นยืดสาย 5-10 นาที`
  },
  {
    id: 'chin-tuck-benefits',
    title: 'ทำไมท่า Chin Tuck ถึงเป็นหัวใจสำคัญของการรักษา?',
    subtitle: 'กลไกกระตุ้น Deep Cervical Flexors คืนสมดุลกระดูกคอ',
    category: 'การออกกำลังกาย',
    readTime: '3 นาที',
    content: `ท่า Chin Tuck ไม่ใช่การก้มหน้า แต่เป็นการเลื่อนศีรษะไปด้านหลังตามแนวราบ เพื่อกระตุ้นกล้ามเนื้อ Longus Colli และ Longus Capitis ซึ่งเป็นกล้ามเนื้อมัดลึกที่พยุงกระดูกสันหลังส่วนคอ 

เมื่อกล้ามเนื้อมัดนี้แข็งแรงขึ้น จะช่วยดึงกระดูกต้นคอกลับเข้าสู่แนวโค้งธรรมชาติ (Cervical Lordosis) และลดแรงกดทับของหมอนรองกระดูกคอได้อย่างตรงจุด`
  }
];
