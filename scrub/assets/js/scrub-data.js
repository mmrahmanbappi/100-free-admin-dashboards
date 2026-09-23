/* Scrub - demo dataset.
   Every figure rendered anywhere in the template comes from this object.
   All patients, clinicians, MRNs and results are invented for demonstration.
   Replace the contents to point the dashboard at a real system. */
window.SCRUB_DATA = (function () {

  var settings = {
    org: "Meridian Health",
    unit: "Ward 4, Level 2",
    currency: "$",
    timezone: "UTC+00:00",
    user: { name: "Dr. Elena Reyes", email: "e.reyes@meridian.health", initials: "ER", role: "Consultant" }
  };

  function wave(n, base, amp, seed) {
    var out = [], s = seed || 5;
    for (var i = 0; i < n; i++) {
      s = (s * 9301 + 49297) % 233280;
      out.push(Math.max(0, Math.round(base + Math.sin(i / 7 * Math.PI * 2) * amp * 0.3 +
        (i / n) * amp * 0.4 + (s / 233280 - 0.5) * amp * 0.4)));
    }
    return out;
  }
  function days(n) {
    var out = [], d = new Date(2026, 8, 19);
    for (var i = n - 1; i >= 0; i--)
      out.push(new Date(d.getTime() - i * 864e5)
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short" }));
    return out;
  }
  var labels30 = days(30);
  var hours14 = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00",
                 "14:00","15:00","16:00","17:00","18:00","19:00"];

  var metrics = {
    inClinic:   { label: "Patients in clinic", value: 38, delta: 4,  dunit: "abs", unit: "count", series: wave(30, 34, 12, 7) },
    waiting:    { label: "In the waiting room", value: 11, delta: 2, dunit: "abs", unit: "count", invert: true, series: wave(30, 10, 6, 11) },
    wait:       { label: "Median wait", value: 12, delta: -3, dunit: "abs", unit: "min", invert: true, series: wave(30, 14, 6, 13) },
    escalations:{ label: "Open escalations", value: 3, delta: 1, dunit: "abs", unit: "count", invert: true },
    occupancy:  { label: "Bed occupancy", value: 75, delta: 6, dunit: "pp", unit: "rate", series: wave(30, 72, 14, 17) },
    admissions: { label: "Admissions today", value: 14, delta: 3, dunit: "abs", unit: "count", series: wave(30, 12, 7, 19) },
    discharges: { label: "Discharges today", value: 9, delta: -2, dunit: "abs", unit: "count", series: wave(30, 11, 6, 23) },
    los:        { label: "Average stay", value: 4.2, dunit: "abs", unit: "days", delta: -0.4, invert: true, series: wave(30, 42, 9, 29).map(function (v) { return v / 10; }) },
    appts:      { label: "Appointments today", value: 96, delta: 4, dunit: "abs", unit: "count", series: wave(30, 88, 24, 31) },
    dna:        { label: "Did not attend", value: 6.4, delta: -0.8, dunit: "pp", unit: "rate", invert: true, series: wave(30, 68, 18, 37).map(function (v) { return v / 10; }) },
    readmit:    { label: "30 day readmission", value: 7.1, delta: -0.6, dunit: "pp", unit: "rate", invert: true, series: wave(30, 74, 14, 41).map(function (v) { return v / 10; }) },
    labsPending:{ label: "Results pending", value: 7, delta: -2, dunit: "abs", unit: "count", invert: true },
    revenue:    { label: "Billed this month", value: 284600, delta: 8.4, unit: "money", series: wave(30, 8400, 3600, 43) },
    outstanding:{ label: "Outstanding", value: 62840, delta: -12.1, unit: "money", invert: true },
    adherence:  { label: "Medication adherence", value: 92, delta: 2.4, dunit: "pp", unit: "rate", series: wave(30, 90, 8, 47) },
    steps:      { label: "Average daily steps", value: 8420, delta: 6.8, unit: "count", series: wave(30, 7800, 2600, 53) }
  };

  /* the vitals strip: the component a clinician reads first */
  var vitals = [
    { key: "Heart rate",        value: "92",     unit: "bpm",  ref: "60 to 100",     state: "ok",   flag: "Normal" },
    { key: "Blood pressure",    value: "148/94", unit: "mmHg", ref: "under 130/80",  state: "warn", flag: "Stage 2" },
    { key: "SpO2",              value: "91",     unit: "%",    ref: "95 to 100",     state: "crit", flag: "Low" },
    { key: "Temperature",       value: "37.8",   unit: "\u00b0C", ref: "36.1 to 37.2", state: "warn", flag: "Raised" },
    { key: "Respiratory rate",  value: "18",     unit: "/min", ref: "12 to 20",      state: "ok",   flag: "Normal" },
    { key: "News2 score",       value: "6",      unit: "",     ref: "0 to 4",        state: "crit", flag: "Urgent review" }
  ];
  var spo2 = [96,96,95,95,94,95,94,93,94,93,92,93,92,91,92,91,91,92,91,91,92,93,92,91,91,92,92,91,91,91];
  var hr   = [78,80,82,81,84,86,88,90,89,88,90,92,91,90,92,94,93,92,94,92,91,90,92,93,92,91,92,93,92,92];

  var patients = [
    { mrn:"40817", name:"Ruben Sosa",     initials:"RS", age:"67 M", presenting:"COPD exacerbation",   location:"Bed 12", acuity:1, status:"Critical", tone:"crit", allergy:"PENICILLIN", consultant:"Dr. Marek",  admitted:"17 Sep", los:2, ward:"Respiratory" },
    { mrn:"40821", name:"Amara Ndiaye",   initials:"AN", age:"54 F", presenting:"Day 2 post-op, CABG", location:"Bed 04", acuity:2, status:"Monitor",  tone:"warn", allergy:"",           consultant:"Dr. Reyes",  admitted:"17 Sep", los:2, ward:"Cardiology" },
    { mrn:"40802", name:"Hana Ito",       initials:"HI", age:"41 F", presenting:"Hypertension review", location:"Room 3", acuity:3, status:"Monitor",  tone:"warn", allergy:"LATEX",      consultant:"Dr. Reyes",  admitted:"19 Sep", los:0, ward:"Cardiology" },
    { mrn:"40796", name:"Tomas Lund",     initials:"TL", age:"33 M", presenting:"ACL rehabilitation",  location:"Room 1", acuity:4, status:"Stable",   tone:"ok",   allergy:"",           consultant:"Ms. Okafor", admitted:"19 Sep", los:0, ward:"Physiotherapy" },
    { mrn:"40784", name:"Ines Barros",    initials:"IB", age:"29 F", presenting:"Type 1 diabetes review", location:"Room 2", acuity:4, status:"Stable", tone:"ok", allergy:"SULFA",      consultant:"Dr. Adeyemi", admitted:"19 Sep", los:0, ward:"Endocrinology" },
    { mrn:"40770", name:"Kwame Asare",    initials:"KA", age:"58 M", presenting:"Day 5 post-op, knee",  location:"Bed 09", acuity:5, status:"Stable",   tone:"ok",   allergy:"",           consultant:"Mr. Vance",  admitted:"14 Sep", los:5, ward:"Orthopaedics" },
    { mrn:"40765", name:"Elif Yilmaz",    initials:"EY", age:"72 F", presenting:"Heart failure",        location:"Bed 07", acuity:2, status:"Monitor",  tone:"warn", allergy:"ASPIRIN",    consultant:"Dr. Reyes",  admitted:"15 Sep", los:4, ward:"Cardiology" },
    { mrn:"40758", name:"Jonas Berg",     initials:"JB", age:"46 M", presenting:"Cellulitis",           location:"Bed 03", acuity:3, status:"Monitor",  tone:"warn", allergy:"",           consultant:"Dr. Adeyemi", admitted:"16 Sep", los:3, ward:"General medicine" },
    { mrn:"40741", name:"Priya Raman",    initials:"PR", age:"38 F", presenting:"Asthma review",        location:"Room 4", acuity:4, status:"Stable",   tone:"ok",   allergy:"NSAIDS",     consultant:"Dr. Marek",  admitted:"19 Sep", los:0, ward:"Respiratory" },
    { mrn:"40733", name:"Owen Bright",    initials:"OB", age:"61 M", presenting:"Post-op review",       location:"Room 5", acuity:5, status:"Stable",   tone:"ok",   allergy:"",           consultant:"Mr. Vance",  admitted:"19 Sep", los:0, ward:"Orthopaedics" }
  ];

  var beds = [
    { bed:"Bed 01", patient:"Nina Duarte",  state:"Occupied", tone:"ok" },
    { bed:"Bed 02", patient:"",             state:"Free",     tone:"free" },
    { bed:"Bed 03", patient:"Jonas Berg",   state:"Occupied", tone:"warn" },
    { bed:"Bed 04", patient:"Amara Ndiaye", state:"Occupied", tone:"warn" },
    { bed:"Bed 05", patient:"",             state:"Cleaning", tone:"info" },
    { bed:"Bed 06", patient:"Sara Holm",    state:"Occupied", tone:"ok" },
    { bed:"Bed 07", patient:"Elif Yilmaz",  state:"Occupied", tone:"warn" },
    { bed:"Bed 08", patient:"",             state:"Free",     tone:"free" },
    { bed:"Bed 09", patient:"Kwame Asare",  state:"Occupied", tone:"ok" },
    { bed:"Bed 10", patient:"Felix Moreau", state:"Occupied", tone:"ok" },
    { bed:"Bed 11", patient:"",             state:"Free",     tone:"free" },
    { bed:"Bed 12", patient:"Ruben Sosa",   state:"Occupied", tone:"crit" },
    { bed:"Bed 13", patient:"Lena Fischer", state:"Occupied", tone:"ok" },
    { bed:"Bed 14", patient:"",             state:"Cleaning", tone:"info" },
    { bed:"Bed 15", patient:"Ciaran Doyle", state:"Occupied", tone:"ok" },
    { bed:"Bed 16", patient:"",             state:"Free",     tone:"free" }
  ];

  var appointments = [
    { time:"09:00", patient:"Amara Ndiaye", initials:"AN", clinician:"Dr. Reyes",  specialty:"Cardiology",     status:"Checked in",  tone:"ok",   type:"Follow up" },
    { time:"09:30", patient:"Tomas Lund",   initials:"TL", clinician:"Ms. Okafor", specialty:"Physiotherapy",  status:"Waiting",     tone:"warn", type:"Review" },
    { time:"10:15", patient:"Hana Ito",     initials:"HI", clinician:"Dr. Reyes",  specialty:"Cardiology",     status:"In room",     tone:"info", type:"Follow up" },
    { time:"11:00", patient:"Ruben Sosa",   initials:"RS", clinician:"Dr. Marek",  specialty:"Respiratory",    status:"Scheduled",   tone:"",     type:"Urgent" },
    { time:"11:45", patient:"Ines Barros",  initials:"IB", clinician:"Ms. Okafor", specialty:"Physiotherapy",  status:"Did not attend", tone:"crit", type:"Review" },
    { time:"13:00", patient:"Priya Raman",  initials:"PR", clinician:"Dr. Marek",  specialty:"Respiratory",    status:"Scheduled",   tone:"",     type:"New patient" },
    { time:"13:45", patient:"Owen Bright",  initials:"OB", clinician:"Mr. Vance",  specialty:"Orthopaedics",   status:"Scheduled",   tone:"",     type:"Post-op" },
    { time:"14:30", patient:"Elif Yilmaz",  initials:"EY", clinician:"Dr. Reyes",  specialty:"Cardiology",     status:"Scheduled",   tone:"",     type:"Follow up" }
  ];

  var telehealth = [
    { time:"09:15", patient:"Felix Moreau", clinician:"Dr. Adeyemi", length:"12 min", status:"Completed", tone:"ok",   link:"Recorded" },
    { time:"10:00", patient:"Sara Holm",    clinician:"Dr. Reyes",   length:"18 min", status:"Completed", tone:"ok",   link:"Recorded" },
    { time:"11:30", patient:"Nina Duarte",  clinician:"Dr. Marek",   length:"-",      status:"In call",   tone:"info", link:"Join" },
    { time:"12:15", patient:"Jae Park",     clinician:"Ms. Okafor",  length:"-",      status:"Waiting",   tone:"warn", link:"Admit" },
    { time:"15:00", patient:"Lena Fischer", clinician:"Dr. Adeyemi", length:"-",      status:"Scheduled", tone:"",     link:"Open" }
  ];

  var medications = [
    { drug:"Salbutamol 2.5 mg neb", patient:"Ruben Sosa",   location:"Bed 12", due:"09:00", status:"Given",   tone:"ok",   route:"Nebulised" },
    { drug:"Prednisolone 40 mg",    patient:"Ruben Sosa",   location:"Bed 12", due:"09:00", status:"Given",   tone:"ok",   route:"Oral" },
    { drug:"Enoxaparin 40 mg",      patient:"Amara Ndiaye", location:"Bed 04", due:"10:00", status:"Due now", tone:"warn", route:"Subcutaneous" },
    { drug:"Paracetamol 1 g",       patient:"Kwame Asare",  location:"Bed 09", due:"10:00", status:"Due now", tone:"warn", route:"Oral" },
    { drug:"Furosemide 40 mg",      patient:"Elif Yilmaz",  location:"Bed 07", due:"10:00", status:"Withheld",tone:"crit", route:"Oral" },
    { drug:"Amlodipine 5 mg",       patient:"Hana Ito",     location:"Room 3", due:"12:00", status:"Later",   tone:"",     route:"Oral" },
    { drug:"Flucloxacillin 1 g",    patient:"Jonas Berg",   location:"Bed 03", due:"12:00", status:"Later",   tone:"",     route:"Intravenous" },
    { drug:"Insulin glargine 18 u", patient:"Ines Barros",  location:"Room 2", due:"22:00", status:"Later",   tone:"",     route:"Subcutaneous" }
  ];

  var prescriptions = [
    { id:"RX-88412", patient:"Ruben Sosa",   drug:"Prednisolone 40 mg", course:"5 days",  prescriber:"Dr. Marek",   issued:"17 Sep", status:"Active",   tone:"ok" },
    { id:"RX-88409", patient:"Jonas Berg",   drug:"Flucloxacillin 1 g", course:"7 days",  prescriber:"Dr. Adeyemi", issued:"16 Sep", status:"Active",   tone:"ok" },
    { id:"RX-88401", patient:"Elif Yilmaz",  drug:"Furosemide 40 mg",   course:"Ongoing", prescriber:"Dr. Reyes",   issued:"15 Sep", status:"On hold",  tone:"warn" },
    { id:"RX-88396", patient:"Hana Ito",     drug:"Amlodipine 5 mg",    course:"Ongoing", prescriber:"Dr. Reyes",   issued:"12 Sep", status:"Active",   tone:"ok" },
    { id:"RX-88384", patient:"Kwame Asare",  drug:"Codeine 30 mg",      course:"3 days",  prescriber:"Mr. Vance",   issued:"14 Sep", status:"Completed",tone:"" }
  ];

  var labs = [
    { id:"LB-2291", patient:"Ruben Sosa",   test:"Arterial blood gas", requested:"09:12", result:"pH 7.31, pCO2 7.4", status:"Abnormal", tone:"crit", clinician:"Dr. Marek" },
    { id:"LB-2290", patient:"Elif Yilmaz",  test:"U and E",            requested:"08:40", result:"K 5.4 mmol/L",      status:"Abnormal", tone:"warn", clinician:"Dr. Reyes" },
    { id:"LB-2289", patient:"Jonas Berg",   test:"CRP",                requested:"08:10", result:"84 mg/L",           status:"Abnormal", tone:"warn", clinician:"Dr. Adeyemi" },
    { id:"LB-2288", patient:"Amara Ndiaye", test:"Full blood count",   requested:"07:55", result:"Within range",      status:"Normal",   tone:"ok",   clinician:"Dr. Reyes" },
    { id:"LB-2287", patient:"Ines Barros",  test:"HbA1c",              requested:"Yesterday", result:"58 mmol/mol",   status:"Abnormal", tone:"warn", clinician:"Dr. Adeyemi" },
    { id:"LB-2286", patient:"Hana Ito",     test:"Lipid profile",      requested:"Yesterday", result:"Pending",       status:"Pending",  tone:"",     clinician:"Dr. Reyes" },
    { id:"LB-2285", patient:"Tomas Lund",   test:"Vitamin D",          requested:"Yesterday", result:"Pending",       status:"Pending",  tone:"",     clinician:"Ms. Okafor" }
  ];

  var imaging = [
    { id:"IM-7741", patient:"Ruben Sosa",   study:"Chest radiograph", modality:"X-ray", requested:"09:20", status:"Reported", tone:"ok",   finding:"Hyperinflation, no consolidation" },
    { id:"IM-7740", patient:"Kwame Asare",  study:"Knee series",      modality:"X-ray", requested:"Yesterday", status:"Reported", tone:"ok", finding:"Prosthesis well sited" },
    { id:"IM-7739", patient:"Elif Yilmaz",  study:"Echocardiogram",   modality:"Ultrasound", requested:"08:05", status:"In progress", tone:"info", finding:"-" },
    { id:"IM-7738", patient:"Jonas Berg",   study:"Soft tissue",      modality:"Ultrasound", requested:"Yesterday", status:"Awaiting report", tone:"warn", finding:"-" },
    { id:"IM-7737", patient:"Amara Ndiaye", study:"Chest CT",         modality:"CT",    requested:"18 Sep", status:"Reported", tone:"ok",   finding:"Post-surgical changes" }
  ];

  var carePlans = [
    { patient:"Ruben Sosa",   plan:"COPD escalation plan",  owner:"Dr. Marek",   review:"Today",   progress:40, status:"Active", tone:"crit" },
    { patient:"Amara Ndiaye", plan:"Cardiac rehabilitation",owner:"Dr. Reyes",   review:"22 Sep",  progress:25, status:"Active", tone:"warn" },
    { patient:"Kwame Asare",  plan:"Knee recovery, week 1", owner:"Ms. Okafor",  review:"21 Sep",  progress:68, status:"Active", tone:"ok" },
    { patient:"Ines Barros",  plan:"Diabetes self-management", owner:"Dr. Adeyemi", review:"30 Sep", progress:82, status:"Active", tone:"ok" },
    { patient:"Tomas Lund",   plan:"ACL rehabilitation",    owner:"Ms. Okafor",  review:"26 Sep",  progress:54, status:"Active", tone:"ok" }
  ];

  var referrals = [
    { id:"RF-1182", patient:"Hana Ito",     from:"General medicine", to:"Cardiology",   urgency:"Routine", waited:"6 days",  status:"Accepted", tone:"ok" },
    { id:"RF-1181", patient:"Jonas Berg",   from:"Emergency",        to:"Dermatology",  urgency:"Urgent",  waited:"2 days",  status:"Triage",   tone:"warn" },
    { id:"RF-1180", patient:"Priya Raman",  from:"General practice", to:"Respiratory",  urgency:"Routine", waited:"11 days", status:"Accepted", tone:"ok" },
    { id:"RF-1179", patient:"Owen Bright",  from:"Orthopaedics",     to:"Physiotherapy",urgency:"Routine", waited:"3 days",  status:"Booked",   tone:"ok" },
    { id:"RF-1178", patient:"Elif Yilmaz",  from:"Cardiology",       to:"Palliative",   urgency:"Urgent",  waited:"1 day",   status:"Triage",   tone:"warn" }
  ];

  var activity = [
    { patient:"Kwame Asare",  steps:6420, minutes:34, sessions:5, adherence:88, trend:12.4 },
    { patient:"Tomas Lund",   steps:9840, minutes:52, sessions:6, adherence:96, trend:18.2 },
    { patient:"Ines Barros",  steps:8120, minutes:41, sessions:5, adherence:92, trend:4.6 },
    { patient:"Owen Bright",  steps:5240, minutes:22, sessions:3, adherence:64, trend:-8.1 },
    { patient:"Priya Raman",  steps:7460, minutes:38, sessions:4, adherence:81, trend:2.2 },
    { patient:"Amara Ndiaye", steps:3180, minutes:14, sessions:2, adherence:58, trend:-14.6 }
  ];

  var rehab = [
    { program:"Cardiac rehabilitation", lead:"Dr. Reyes",  enrolled:42, weeks:12, completion:78, status:"Running", tone:"ok" },
    { program:"Pulmonary rehabilitation", lead:"Dr. Marek", enrolled:28, weeks:8,  completion:64, status:"Running", tone:"ok" },
    { program:"Post-op knee, phase 1",  lead:"Ms. Okafor", enrolled:34, weeks:6,  completion:86, status:"Running", tone:"ok" },
    { program:"Diabetes education",     lead:"Dr. Adeyemi",enrolled:51, weeks:10, completion:41, status:"Running", tone:"warn" },
    { program:"Falls prevention",       lead:"Ms. Okafor", enrolled:0,  weeks:6,  completion:0,  status:"Planned", tone:"" }
  ];

  var records = [
    { id:"NT-9942", patient:"Ruben Sosa",   type:"Ward round note", author:"Dr. Marek",   when:"19 Sep 08:20", status:"Signed", tone:"ok" },
    { id:"NT-9941", patient:"Elif Yilmaz",  type:"Nursing note",    author:"N. Adeyemi",  when:"19 Sep 07:40", status:"Signed", tone:"ok" },
    { id:"NT-9940", patient:"Amara Ndiaye", type:"Operation note",  author:"Dr. Reyes",   when:"17 Sep 14:05", status:"Signed", tone:"ok" },
    { id:"NT-9939", patient:"Jonas Berg",   type:"Ward round note", author:"Dr. Adeyemi", when:"19 Sep 08:55", status:"Draft",  tone:"warn" },
    { id:"NT-9938", patient:"Kwame Asare",  type:"Discharge summary", author:"Mr. Vance", when:"19 Sep 09:10", status:"Draft",  tone:"warn" }
  ];

  var admissions = [
    { mrn:"40821", patient:"Amara Ndiaye", source:"Elective",   ward:"Cardiology",       when:"17 Sep 11:20", bed:"Bed 04", status:"Admitted", tone:"ok" },
    { mrn:"40817", patient:"Ruben Sosa",   source:"Emergency",  ward:"Respiratory",      when:"17 Sep 22:44", bed:"Bed 12", status:"Admitted", tone:"crit" },
    { mrn:"40758", patient:"Jonas Berg",   source:"Emergency",  ward:"General medicine", when:"16 Sep 03:12", bed:"Bed 03", status:"Admitted", tone:"warn" },
    { mrn:"40699", patient:"Sara Holm",    source:"Transfer",   ward:"General medicine", when:"19 Sep 07:05", bed:"Bed 06", status:"Awaiting bed", tone:"warn" },
    { mrn:"40688", patient:"Felix Moreau", source:"Elective",   ward:"Orthopaedics",     when:"19 Sep 08:30", bed:"Bed 10", status:"Admitted", tone:"ok" }
  ];

  var discharges = [
    { mrn:"40770", patient:"Kwame Asare",  ward:"Orthopaedics", planned:"Today 14:00", blocker:"Discharge summary", status:"Pending", tone:"warn" },
    { mrn:"40733", patient:"Owen Bright",  ward:"Orthopaedics", planned:"Today 16:00", blocker:"Transport",         status:"Pending", tone:"warn" },
    { mrn:"40645", patient:"Lena Fischer", ward:"Cardiology",   planned:"Today 11:00", blocker:"",                  status:"Ready",   tone:"ok" },
    { mrn:"40612", patient:"Ciaran Doyle", ward:"General medicine", planned:"Tomorrow", blocker:"Social care",      status:"Delayed", tone:"crit" },
    { mrn:"40588", patient:"Nina Duarte",  ward:"General medicine", planned:"Today 15:00", blocker:"",              status:"Ready",   tone:"ok" }
  ];

  var staff = [
    { initials:"ER", name:"Dr. Elena Reyes",   role:"Consultant",    specialty:"Cardiology",      onCall:"On shift", tone:"ok",   patients:14 },
    { initials:"AM", name:"Dr. Adam Marek",    role:"Consultant",    specialty:"Respiratory",     onCall:"On shift", tone:"ok",   patients:11 },
    { initials:"FO", name:"Ms. Funmi Okafor",  role:"Physiotherapist", specialty:"Rehabilitation",onCall:"On shift", tone:"ok",   patients:18 },
    { initials:"TA", name:"Dr. Tobi Adeyemi",  role:"Registrar",     specialty:"General medicine",onCall:"On call",  tone:"warn", patients:9 },
    { initials:"MV", name:"Mr. Marc Vance",    role:"Surgeon",       specialty:"Orthopaedics",    onCall:"Off duty", tone:"",     patients:7 },
    { initials:"NA", name:"N. Adeyinka",       role:"Senior nurse",  specialty:"Ward 4",          onCall:"On shift", tone:"ok",   patients:16 }
  ];

  var rota = [
    { name:"Dr. Elena Reyes",  mon:"Clinic", tue:"Ward",  wed:"Theatre", thu:"Clinic", fri:"Ward" },
    { name:"Dr. Adam Marek",   mon:"Ward",   tue:"Clinic",wed:"Ward",    thu:"Ward",   fri:"Clinic" },
    { name:"Ms. Funmi Okafor", mon:"Clinic", tue:"Clinic",wed:"Clinic",  thu:"Rehab",  fri:"Rehab" },
    { name:"Dr. Tobi Adeyemi", mon:"Nights", tue:"Nights",wed:"Off",     thu:"Off",    fri:"Ward" },
    { name:"Mr. Marc Vance",   mon:"Theatre",tue:"Theatre",wed:"Clinic", thu:"Off",    fri:"Theatre" },
    { name:"N. Adeyinka",      mon:"Ward",   tue:"Ward",  wed:"Ward",    thu:"Off",    fri:"Ward" }
  ];

  var tasks = [
    { task:"Review ABG for bed 12",       patient:"Ruben Sosa",   owner:"Dr. Marek",   due:"09:45", priority:"Urgent",  tone:"crit", status:"Open" },
    { task:"Chase potassium result",      patient:"Elif Yilmaz",  owner:"Dr. Reyes",   due:"10:30", priority:"High",    tone:"warn", status:"Open" },
    { task:"Complete discharge summary",  patient:"Kwame Asare",  owner:"Mr. Vance",   due:"12:00", priority:"High",    tone:"warn", status:"Open" },
    { task:"Book follow up clinic",       patient:"Hana Ito",     owner:"N. Adeyinka", due:"Today", priority:"Routine", tone:"",     status:"Open" },
    { task:"Refer to social care",        patient:"Ciaran Doyle", owner:"N. Adeyinka", due:"Today", priority:"High",    tone:"warn", status:"Done" },
    { task:"Sign ward round note",        patient:"Jonas Berg",   owner:"Dr. Adeyemi", due:"11:00", priority:"Routine", tone:"",     status:"Done" }
  ];

  var messages = [
    { from:"Dr. Adam Marek",   subject:"Bed 12, ABG results",        when:"09:44", unread:true,  tag:"Urgent" },
    { from:"Pharmacy",         subject:"Furosemide withheld, bed 07",when:"09:12", unread:true,  tag:"Medication" },
    { from:"N. Adeyinka",      subject:"Discharge transport delay",  when:"08:50", unread:true,  tag:"Ward" },
    { from:"Radiology",        subject:"Echo slot available 11:00",  when:"08:22", unread:false, tag:"Imaging" },
    { from:"Ms. Funmi Okafor", subject:"Rehab list for Thursday",    when:"Yesterday", unread:false, tag:"Clinic" }
  ];

  var departments = [
    { name:"Respiratory",      seen:28, wait:14, capacity:88 },
    { name:"Cardiology",       seen:22, wait:11, capacity:76 },
    { name:"General medicine", seen:20, wait:18, capacity:92 },
    { name:"Physiotherapy",    seen:16, wait:6,  capacity:54 },
    { name:"Orthopaedics",     seen:14, wait:9,  capacity:61 },
    { name:"Endocrinology",    seen:10, wait:8,  capacity:44 }
  ];

  var invoices = [
    { id:"IN-55821", patient:"Amara Ndiaye", payer:"Meridian Private", amount:4280, due:"30 Sep", status:"Sent",     tone:"warn" },
    { id:"IN-55820", patient:"Kwame Asare",  payer:"National scheme",  amount:2140, due:"28 Sep", status:"Paid",     tone:"ok" },
    { id:"IN-55819", patient:"Hana Ito",     payer:"Self pay",         amount:320,  due:"22 Sep", status:"Overdue",  tone:"crit" },
    { id:"IN-55818", patient:"Elif Yilmaz",  payer:"National scheme",  amount:5860, due:"04 Oct", status:"Sent",     tone:"warn" },
    { id:"IN-55817", patient:"Tomas Lund",   payer:"Meridian Private", amount:640,  due:"20 Sep", status:"Paid",     tone:"ok" }
  ];

  var claims = [
    { id:"CL-3312", payer:"National scheme",  patients:14, amount:38420, submitted:"15 Sep", status:"Approved",  tone:"ok" },
    { id:"CL-3311", payer:"Meridian Private", patients:9,  amount:22180, submitted:"14 Sep", status:"In review", tone:"warn" },
    { id:"CL-3310", payer:"National scheme",  patients:11, amount:29640, submitted:"08 Sep", status:"Approved",  tone:"ok" },
    { id:"CL-3309", payer:"Harbour Insure",   patients:4,  amount:9840,  submitted:"05 Sep", status:"Rejected",  tone:"crit" }
  ];

  var supplies = [
    { item:"Nitrile gloves, medium", sku:"SU-0112", stock:420, reorder:200, days:12, status:"In stock",    tone:"ok" },
    { item:"Nebuliser masks",        sku:"SU-0208", stock:38,  reorder:60,  days:3,  status:"Low",         tone:"warn" },
    { item:"IV giving sets",         sku:"SU-0331", stock:0,   reorder:80,  days:0,  status:"Out of stock",tone:"crit" },
    { item:"Sterile dressing packs", sku:"SU-0442", stock:186, reorder:100, days:9,  status:"In stock",    tone:"ok" },
    { item:"Blood collection tubes", sku:"SU-0517", stock:64,  reorder:120, days:4,  status:"Low",         tone:"warn" },
    { item:"Alcohol hand rub 500 ml",sku:"SU-0623", stock:240, reorder:100, days:18, status:"In stock",    tone:"ok" }
  ];

  var equipment = [
    { item:"Infusion pump",       id:"EQ-4412", location:"Ward 4",  service:"12 Oct", status:"In service", tone:"ok" },
    { item:"Vital signs monitor", id:"EQ-4388", location:"Bed 12",  service:"02 Nov", status:"In service", tone:"ok" },
    { item:"Portable ultrasound", id:"EQ-4291", location:"Room 3",  service:"24 Sep", status:"Service due",tone:"warn" },
    { item:"Nebuliser unit",      id:"EQ-4180", location:"Store",   service:"Overdue",status:"Out of use", tone:"crit" },
    { item:"ECG machine",         id:"EQ-4102", location:"Clinic 2",service:"18 Dec", status:"In service", tone:"ok" }
  ];

  var cohorts = {
    columns: ["Week 0","Week 1","Week 2","Week 3","Week 4","Week 5"],
    rows: [
      { label:"11 Aug", size:142, values:[100, 86, 74, 68, 62, 58] },
      { label:"18 Aug", size:158, values:[100, 88, 78, 71, 66, null] },
      { label:"25 Aug", size:164, values:[100, 90, 81, 74, null, null] },
      { label:"01 Sep", size:171, values:[100, 91, 83, null, null, null] },
      { label:"08 Sep", size:186, values:[100, 93, null, null, null, null] },
      { label:"15 Sep", size:194, values:[100, null, null, null, null, null] }
    ]
  };

  var pathway = [
    { label:"Referral received", value:482, pct:100,  drop:0 },
    { label:"Triaged",           value:441, pct:91.5, drop:8.5 },
    { label:"Appointment booked",value:398, pct:82.6, drop:9.8 },
    { label:"Seen in clinic",    value:352, pct:73.0, drop:11.6 },
    { label:"Treatment started", value:284, pct:58.9, drop:19.3 }
  ];

  var feed = [
    { what:"SpO2 alert, bed 12",        who:"Ruben Sosa",   t:"2 min" },
    { what:"Medication given",          who:"Bed 12, salbutamol", t:"9 min" },
    { what:"Patient checked in",        who:"Amara Ndiaye", t:"14 min" },
    { what:"Lab result returned",       who:"Elif Yilmaz, U and E", t:"22 min" },
    { what:"Bed 05 cleaning started",   who:"Housekeeping", t:"31 min" },
    { what:"Discharge marked ready",    who:"Lena Fischer", t:"44 min" },
    { what:"Referral accepted",         who:"Hana Ito, cardiology", t:"1 h" }
  ];

  var notifications = [
    { title:"SpO2 below threshold, bed 12", body:"Ruben Sosa, 91% for 18 minutes, registrar paged", when:"2 min ago", unread:true },
    { title:"Potassium 5.4 mmol/L",         body:"Elif Yilmaz, bed 07, repeat requested",           when:"22 min ago", unread:true },
    { title:"IV giving sets out of stock",  body:"Reorder raised with supplies",                    when:"1 h ago",   unread:true },
    { title:"Discharge summary due",        body:"Kwame Asare, planned for 14:00",                  when:"2 h ago",   unread:false }
  ];

  var roles = [
    { cap:"View patient record",     Consultant:1, Registrar:1, Nurse:1, Therapist:1, Admin:0 },
    { cap:"Prescribe",               Consultant:1, Registrar:1, Nurse:0, Therapist:0, Admin:0 },
    { cap:"Administer medication",   Consultant:1, Registrar:1, Nurse:1, Therapist:0, Admin:0 },
    { cap:"Order investigations",    Consultant:1, Registrar:1, Nurse:0, Therapist:0, Admin:0 },
    { cap:"Discharge a patient",     Consultant:1, Registrar:1, Nurse:0, Therapist:0, Admin:0 },
    { cap:"Manage the rota",         Consultant:1, Registrar:0, Nurse:1, Therapist:0, Admin:1 },
    { cap:"View billing",            Consultant:0, Registrar:0, Nurse:0, Therapist:0, Admin:1 }
  ];

  var definitions = {
    inClinic: "Patients physically present in the unit, including those in treatment rooms and bays.",
    waiting: "Patients checked in and not yet called. Lower is better.",
    wait: "Median minutes from check in to being called. Lower is better.",
    escalations: "Open alerts where a vital sign has breached the escalation criteria. Lower is better.",
    occupancy: "Occupied beds as a share of the beds open on this unit.",
    los: "Mean length of stay in days for patients discharged in the period. Lower is better.",
    dna: "Booked appointments where the patient did not attend, as a share of all booked. Lower is better.",
    readmit: "Patients readmitted within 30 days of discharge, as a share of discharges. Lower is better.",
    adherence: "Doses recorded as given as a share of doses due.",
    revenue: "Value of episodes billed in the current month, before adjustments."
  };

  return {
    settings: settings, labels30: labels30, hours14: hours14, metrics: metrics,
    definitions: definitions, vitals: vitals, spo2: spo2, hr: hr,
    patients: patients, beds: beds, appointments: appointments, telehealth: telehealth,
    medications: medications, prescriptions: prescriptions, labs: labs, imaging: imaging,
    carePlans: carePlans, referrals: referrals, activity: activity, rehab: rehab,
    records: records, admissions: admissions, discharges: discharges, staff: staff,
    rota: rota, tasks: tasks, messages: messages, departments: departments,
    invoices: invoices, claims: claims, supplies: supplies, equipment: equipment,
    cohorts: cohorts, pathway: pathway, feed: feed, notifications: notifications, roles: roles
  };
})();
