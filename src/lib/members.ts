export type WorkingGroup = "Curricula" | "Communication" | "Implementation";

export type Member = {
  name: string;
  country: string;
  groups: WorkingGroup[];
};

/**
 * Sankofa working-group members.
 * Source: the June 2026 roster spreadsheet (contact details left out on purpose).
 */
export const members: Member[] = [
  { name: "Ademola Dickson", country: "Nigeria", groups: ["Implementation"] },
  { name: "Amina Abubakar", country: "Nigeria", groups: ["Implementation"] },
  { name: "Amira Ouerfelli", country: "Tunisia", groups: ["Curricula", "Communication", "Implementation"] },
  { name: "Anitta Antony", country: "India", groups: ["Curricula"] },
  { name: "Anjana Somasundaran", country: "India", groups: ["Curricula"] },
  { name: "Barbara Sabiiti Waako", country: "Uganda", groups: ["Curricula"] },
  { name: "Bruce Mafuta", country: "DR Congo", groups: ["Curricula"] },
  { name: "Cherukuri Indira Dasgupta", country: "India", groups: ["Implementation"] },
  { name: "Chilala Kakoma-Bowa", country: "Zambia", groups: ["Curricula", "Implementation"] },
  { name: "Christie Etukudor", country: "Scotland", groups: ["Curricula", "Implementation"] },
  { name: "Desire C Mussa", country: "Malawi", groups: ["Curricula"] },
  { name: "Donatus Njoku", country: "Nigeria", groups: ["Communication"] },
  { name: "Erika Kalenga", country: "Tanzania", groups: ["Curricula", "Implementation"] },
  { name: "Fidelis Filipatali", country: "Tanzania", groups: ["Curricula", "Implementation"] },
  { name: "Fredi Lutego", country: "Tanzania", groups: ["Implementation"] },
  { name: "Ibiremi Ibikunle-Ayeni", country: "Nigeria", groups: ["Communication"] },
  { name: "Lane Maema", country: "South Africa", groups: ["Curricula", "Implementation"] },
  { name: "Lawrence Ekeng", country: "Nigeria", groups: ["Curricula", "Communication", "Implementation"] },
  { name: "Lettie Burton", country: "England", groups: ["Curricula", "Communication", "Implementation"] },
  { name: "Mureithi Kivuti", country: "Kenya", groups: ["Curricula"] },
  { name: "Mustapha Osman", country: "Ghana", groups: ["Implementation"] },
  { name: "Mweene Himwiinga", country: "Zambia", groups: ["Curricula", "Implementation"] },
  { name: "Nicole Kawaako", country: "Uganda", groups: ["Curricula"] },
  { name: "Nicolo Stevanato", country: "Italy", groups: ["Curricula"] },
  { name: "Nkenen Brendaline Shieka", country: "Cameroon", groups: ["Curricula", "Implementation"] },
  { name: "Patience Kpeda", country: "Ghana", groups: ["Implementation"] },
  { name: "Rania Nefzi", country: "Tunisia", groups: ["Communication"] },
  { name: "Ranjan Sen", country: "USA", groups: ["Implementation"] },
  { name: "Ray Larsen", country: "USA", groups: ["Curricula", "Communication", "Implementation"] },
  { name: "Salamatu Sani", country: "Nigeria", groups: ["Curricula", "Communication", "Implementation"] },
  { name: "Santosh Kumar Patnaik", country: "India", groups: ["Curricula", "Implementation"] },
  { name: "Sudha Balagopalan", country: "India", groups: ["Curricula"] },
  { name: "Toby Cumberbatch", country: "USA", groups: ["Curricula", "Communication", "Implementation"] },
];
