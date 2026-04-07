/**
 * data.js — Innovision Overseas UAE Hiring Platform
 * Static data: roles, question banks, admin credentials
 * v1.0.0 | © 2024 Innovision Overseas Pvt. Ltd.
 *
 * TO CHANGE ADMIN PASSWORDS:
 * Edit the ADMINS object below before deploying.
 * In production, replace with a server-side authentication API.
 */

'use strict';

/* ── ADMIN CREDENTIALS ──────────────────────────────
 * Structure: username → { password, role, display }
 * Replace or extend as needed for your team.
 */
const ADMINS = {
  'admin':      { password: 'innovision2024', role: 'Super Admin',  display: 'Admin' },
  'hr_manager': { password: 'uaehiring',      role: 'HR Manager',   display: 'HR Manager' },
  'recruiter':  { password: 'recruit123',     role: 'Recruiter',    display: 'Recruiter' }
};

/* ── JOB ROLES ───────────────────────────────────── */
const ROLES = {
  driver: {
    label: 'Taxi Driver',
    icon: '🚕',
    desc: 'Taxi/driver role for UAE deployments. Valid UAE driving licence and safe driving practices required.'
  },
  security: {
    label: 'Special Security Guard',
    icon: '🛡️',
    desc: 'Armed/unarmed security for high-security facilities, malls, and corporate premises in Dubai & Abu Dhabi.'
  },
  housekeeping: {
    label: 'Housekeeping Staff',
    icon: '🧹',
    desc: 'Hotel, hospital & facility cleaning staff for 3★–5★ hospitality clients in UAE.'
  },
  supervisor: {
    label: 'Field Supervisor',
    icon: '📋',
    desc: 'On-ground team lead for facility management or construction site supervision across UAE projects.'
  },
  helper: {
    label: 'General Helper',
    icon: '🔧',
    desc: 'Multi-skilled helper for construction, warehouse, or facility maintenance roles across UAE.'
  }
};

/* Accent colours: avatar, score chips, selected job card / filter (candidate + admin) */
const ROLE_THEME_HEX = {
  driver: '#d97706',
  security: '#2563eb',
  housekeeping: '#2d9964',
  supervisor: '#7c3aed',
  helper: '#ea580c'
};

function getRoleThemeHex(jobKey) {
  return ROLE_THEME_HEX[jobKey] || '#c53030';
}

/* ── QUESTION BANK ───────────────────────────────── */
let QB = {
  driver: [
    {
      id: 'td_p1_q1',
      type: 'reading',
      passage:
        'Japan is a very famous country for its industry. It is not very big, but it is very busy. The capital is Tokyo. The language is Japanese, and most people know English. Japan has several large cities and these cities are important centers for industry and business. There are large factories for making cars, buses, trains, ships and boats. These products are exported to many countries all over the world. A lot of people prefer to buy the Japanese products because they are not expensive and they serve for a long time.',
      question: 'What is Japan famous for?',
      expectedAnswer: 'Japan is famous for its industry and manufacturing.'
    },
    {
      id: 'td_p1_q2',
      type: 'reading',
      passage:
        'Japan is a very famous country for its industry. It is not very big, but it is very busy. The capital is Tokyo. The language is Japanese, and most people know English. Japan has several large cities and these cities are important centers for industry and business. There are large factories for making cars, buses, trains, ships and boats. These products are exported to many countries all over the world. A lot of people prefer to buy the Japanese products because they are not expensive and they serve for a long time.',
      question: "What does the word 'exported' mean in the paragraph?",
      expectedAnswer: 'Exported means goods are sent to other countries for sale.'
    },
    {
      id: 'td_p1_q3',
      type: 'reading',
      passage:
        'Japan is a very famous country for its industry. It is not very big, but it is very busy. The capital is Tokyo. The language is Japanese, and most people know English. Japan has several large cities and these cities are important centers for industry and business. There are large factories for making cars, buses, trains, ships and boats. These products are exported to many countries all over the world. A lot of people prefer to buy the Japanese products because they are not expensive and they serve for a long time.',
      question: 'Why do people prefer Japanese products?',
      expectedAnswer: 'People prefer Japanese products because they are not expensive and last for a long time.'
    },
    {
      id: 'td_p1_q4',
      type: 'reading',
      passage:
        'Japan is a very famous country for its industry. It is not very big, but it is very busy. The capital is Tokyo. The language is Japanese, and most people know English. Japan has several large cities and these cities are important centers for industry and business. There are large factories for making cars, buses, trains, ships and boats. These products are exported to many countries all over the world. A lot of people prefer to buy the Japanese products because they are not expensive and they serve for a long time.',
      question: 'Name some things that are made in Japanese factories.',
      expectedAnswer: 'Cars, buses, trains, ships and boats are made in Japanese factories.'
    },
    {
      id: 'td_p1_q5',
      type: 'reading',
      passage:
        'Japan is a very famous country for its industry. It is not very big, but it is very busy. The capital is Tokyo. The language is Japanese, and most people know English. Japan has several large cities and these cities are important centers for industry and business. There are large factories for making cars, buses, trains, ships and boats. These products are exported to many countries all over the world. A lot of people prefer to buy the Japanese products because they are not expensive and they serve for a long time.',
      question: 'What does the paragraph tell you about the size and activity of Japan?',
      expectedAnswer: 'Japan is not very big in size but it is very busy and industrially active.'
    },

    {
      id: 'td_p2_q1',
      type: 'reading',
      passage:
        'Horses are beautiful creatures. They can be different colors, and can run quickly. People like to watch horses because they are strong and powerful. Horses are mammals. Horses can live up to 20 or 25 years. Sometimes people can tell how old a horse is by looking at its teeth. They generally sleep standing up, so that if a predator approaches, they can run away quickly. Horses only need about three hours of sleep per day.',
      question: "What does the word 'predator' mean?",
      expectedAnswer: 'A predator is an animal that hunts and eats other animals.'
    },
    {
      id: 'td_p2_q2',
      type: 'reading',
      passage:
        'Horses are beautiful creatures. They can be different colors, and can run quickly. People like to watch horses because they are strong and powerful. Horses are mammals. Horses can live up to 20 or 25 years. Sometimes people can tell how old a horse is by looking at its teeth. They generally sleep standing up, so that if a predator approaches, they can run away quickly. Horses only need about three hours of sleep per day.',
      question: 'Why do horses sleep standing up?',
      expectedAnswer: 'They sleep standing up so they can run away quickly if a predator approaches.'
    },
    {
      id: 'td_p2_q3',
      type: 'reading',
      passage:
        'Horses are beautiful creatures. They can be different colors, and can run quickly. People like to watch horses because they are strong and powerful. Horses are mammals. Horses can live up to 20 or 25 years. Sometimes people can tell how old a horse is by looking at its teeth. They generally sleep standing up, so that if a predator approaches, they can run away quickly. Horses only need about three hours of sleep per day.',
      question: 'How long can horses live?',
      expectedAnswer: 'Horses can live up to 20 or 25 years.'
    },
    {
      id: 'td_p2_q4',
      type: 'reading',
      passage:
        'Horses are beautiful creatures. They can be different colors, and can run quickly. People like to watch horses because they are strong and powerful. Horses are mammals. Horses can live up to 20 or 25 years. Sometimes people can tell how old a horse is by looking at its teeth. They generally sleep standing up, so that if a predator approaches, they can run away quickly. Horses only need about three hours of sleep per day.',
      question: 'How can people tell the age of a horse?',
      expectedAnswer: 'People can tell the age of a horse by looking at its teeth.'
    },
    {
      id: 'td_p2_q5',
      type: 'reading',
      passage:
        'Horses are beautiful creatures. They can be different colors, and can run quickly. People like to watch horses because they are strong and powerful. Horses are mammals. Horses can live up to 20 or 25 years. Sometimes people can tell how old a horse is by looking at its teeth. They generally sleep standing up, so that if a predator approaches, they can run away quickly. Horses only need about three hours of sleep per day.',
      question: "What does the paragraph tell about horses’ sleeping habits?",
      expectedAnswer: 'Horses sleep standing up and need only about three hours of sleep per day.'
    },

    {
      id: 'td_p3_q1',
      type: 'reading',
      passage:
        'It’s Arbor Day, and Ali and Asma are planting a tree in their backyard. Their parents are watching TV in the living room, and they don’t know what the children are doing. Kids learned about Arbor Day in school. Their teachers told them trees are important to the environment because they create oxygen and provide a home for birds and other small animals. Now, the kids want to surprise their parents by planting a tree in the middle of the backyard. They hope their parents will be happy.',
      question: 'What is Arbor Day?',
      expectedAnswer: 'Arbor Day is a day dedicated to planting and caring for trees.'
    },
    {
      id: 'td_p3_q2',
      type: 'reading',
      passage:
        'It’s Arbor Day, and Ali and Asma are planting a tree in their backyard. Their parents are watching TV in the living room, and they don’t know what the children are doing. Kids learned about Arbor Day in school. Their teachers told them trees are important to the environment because they create oxygen and provide a home for birds and other small animals. Now, the kids want to surprise their parents by planting a tree in the middle of the backyard. They hope their parents will be happy.',
      question: 'Why are Ali and Asma planting a tree?',
      expectedAnswer: 'They are planting a tree because they learned trees are important for the environment.'
    },
    {
      id: 'td_p3_q3',
      type: 'reading',
      passage:
        'It’s Arbor Day, and Ali and Asma are planting a tree in their backyard. Their parents are watching TV in the living room, and they don’t know what the children are doing. Kids learned about Arbor Day in school. Their teachers told them trees are important to the environment because they create oxygen and provide a home for birds and other small animals. Now, the kids want to surprise their parents by planting a tree in the middle of the backyard. They hope their parents will be happy.',
      question: "What does the word 'environment' mean?",
      expectedAnswer: 'Environment means the natural world around us including air, land, plants and animals.'
    },
    {
      id: 'td_p3_q4',
      type: 'reading',
      passage:
        'It’s Arbor Day, and Ali and Asma are planting a tree in their backyard. Their parents are watching TV in the living room, and they don’t know what the children are doing. Kids learned about Arbor Day in school. Their teachers told them trees are important to the environment because they create oxygen and provide a home for birds and other small animals. Now, the kids want to surprise their parents by planting a tree in the middle of the backyard. They hope their parents will be happy.',
      question: 'How do trees help birds and animals?',
      expectedAnswer: 'Trees provide oxygen and give birds and small animals a home.'
    },
    {
      id: 'td_p3_q5',
      type: 'reading',
      passage:
        'It’s Arbor Day, and Ali and Asma are planting a tree in their backyard. Their parents are watching TV in the living room, and they don’t know what the children are doing. Kids learned about Arbor Day in school. Their teachers told them trees are important to the environment because they create oxygen and provide a home for birds and other small animals. Now, the kids want to surprise their parents by planting a tree in the middle of the backyard. They hope their parents will be happy.',
      question: 'What surprise do the children plan for their parents?',
      expectedAnswer: 'They plan to surprise their parents by planting a tree in the backyard.'
    },

    {
      id: 'td_p4_q1',
      type: 'reading',
      passage:
        'The Nile River is the longest river in the world, flowing through northeastern Africa. It stretches over 6,600 kilometers, from its sources to the Mediterranean Sea. The river has two main tributaries: the White Nile and the Blue Nile. The White Nile begins in East Africa, flowing from Lake Victoria in Uganda. The Blue Nile starts in Ethiopia, carrying vital water and rich soil. These two branches meet in Sudan, continuing their journey north together. For thousands of years, the Nile has been the lifeblood of Egypt, allowing farming in the desert. Ancient Egyptian civilization grew along its banks, building cities and monuments. The river still supports millions of people today for water, food, and transport. Farmers use its waters to grow crops like cotton, wheat, and sugarcane.',
      question: "What does the word 'tributaries' mean?",
      expectedAnswer: 'Tributaries are smaller rivers that flow into a larger river.'
    },
    {
      id: 'td_p4_q2',
      type: 'reading',
      passage:
        'The Nile River is the longest river in the world, flowing through northeastern Africa. It stretches over 6,600 kilometers, from its sources to the Mediterranean Sea. The river has two main tributaries: the White Nile and the Blue Nile. The White Nile begins in East Africa, flowing from Lake Victoria in Uganda. The Blue Nile starts in Ethiopia, carrying vital water and rich soil. These two branches meet in Sudan, continuing their journey north together. For thousands of years, the Nile has been the lifeblood of Egypt, allowing farming in the desert. Ancient Egyptian civilization grew along its banks, building cities and monuments. The river still supports millions of people today for water, food, and transport. Farmers use its waters to grow crops like cotton, wheat, and sugarcane.',
      question: 'Where do the White Nile and Blue Nile begin?',
      expectedAnswer: 'The White Nile begins near Lake Victoria in Uganda and the Blue Nile begins in Ethiopia.'
    },
    {
      id: 'td_p4_q3',
      type: 'reading',
      passage:
        'The Nile River is the longest river in the world, flowing through northeastern Africa. It stretches over 6,600 kilometers, from its sources to the Mediterranean Sea. The river has two main tributaries: the White Nile and the Blue Nile. The White Nile begins in East Africa, flowing from Lake Victoria in Uganda. The Blue Nile starts in Ethiopia, carrying vital water and rich soil. These two branches meet in Sudan, continuing their journey north together. For thousands of years, the Nile has been the lifeblood of Egypt, allowing farming in the desert. Ancient Egyptian civilization grew along its banks, building cities and monuments. The river still supports millions of people today for water, food, and transport. Farmers use its waters to grow crops like cotton, wheat, and sugarcane.',
      question: "Why is the Nile called the 'lifeblood of Egypt'?",
      expectedAnswer: 'It is called lifeblood because it provides water and supports farming and life in Egypt.'
    },
    {
      id: 'td_p4_q4',
      type: 'reading',
      passage:
        'The Nile River is the longest river in the world, flowing through northeastern Africa. It stretches over 6,600 kilometers, from its sources to the Mediterranean Sea. The river has two main tributaries: the White Nile and the Blue Nile. The White Nile begins in East Africa, flowing from Lake Victoria in Uganda. The Blue Nile starts in Ethiopia, carrying vital water and rich soil. These two branches meet in Sudan, continuing their journey north together. For thousands of years, the Nile has been the lifeblood of Egypt, allowing farming in the desert. Ancient Egyptian civilization grew along its banks, building cities and monuments. The river still supports millions of people today for water, food, and transport. Farmers use its waters to grow crops like cotton, wheat, and sugarcane.',
      question: 'How does the Nile help farmers?',
      expectedAnswer: 'The Nile provides water and fertile soil for growing crops.'
    },
    {
      id: 'td_p4_q5',
      type: 'reading',
      passage:
        'The Nile River is the longest river in the world, flowing through northeastern Africa. It stretches over 6,600 kilometers, from its sources to the Mediterranean Sea. The river has two main tributaries: the White Nile and the Blue Nile. The White Nile begins in East Africa, flowing from Lake Victoria in Uganda. The Blue Nile starts in Ethiopia, carrying vital water and rich soil. These two branches meet in Sudan, continuing their journey north together. For thousands of years, the Nile has been the lifeblood of Egypt, allowing farming in the desert. Ancient Egyptian civilization grew along its banks, building cities and monuments. The river still supports millions of people today for water, food, and transport. Farmers use its waters to grow crops like cotton, wheat, and sugarcane.',
      question: 'What does the paragraph tell about the importance of the Nile River?',
      expectedAnswer: 'The Nile supports agriculture, transportation, and millions of people living along it.'
    }
  ],
  security: [{"id":"ssg_1","type":"comprehension","question":"How ___ you?","options":[{"key":"A","text":"are"},{"key":"B","text":"good evening"},{"key":"C","text":"doing"}],"expectedOption":"A","expectedAnswer":"are"},{"id":"ssg_2","type":"comprehension","question":"Do ___ like cricket?","options":[{"key":"A","text":"always"},{"key":"B","text":"also"},{"key":"C","text":"you"}],"expectedOption":"C","expectedAnswer":"you"},{"id":"ssg_3","type":"comprehension","question":"Our training was completed ___ time.","options":[{"key":"A","text":"on"},{"key":"B","text":"with"},{"key":"C","text":"at"}],"expectedOption":"A","expectedAnswer":"on"},{"id":"ssg_4","type":"comprehension","question":"You should not ___ mistakes.","options":[{"key":"A","text":"make"},{"key":"B","text":"made"},{"key":"C","text":"making"}],"expectedOption":"A","expectedAnswer":"make"},{"id":"ssg_5","type":"comprehension","question":"I ___ reading the book.","options":[{"key":"A","text":"too much"},{"key":"B","text":"enjoyed"},{"key":"C","text":"don't"}],"expectedOption":"B","expectedAnswer":"enjoyed"},{"id":"ssg_6","type":"comprehension","question":"He is my ___.","options":[{"key":"A","text":"daughter"},{"key":"B","text":"sister"},{"key":"C","text":"son"}],"expectedOption":"C","expectedAnswer":"son"},{"id":"ssg_7","type":"comprehension","question":"We are ___ of waiting.","options":[{"key":"A","text":"tried"},{"key":"B","text":"tired"},{"key":"C","text":"trying"}],"expectedOption":"B","expectedAnswer":"tired"},{"id":"ssg_8","type":"comprehension","question":"I am ___ for my English test.","options":[{"key":"A","text":"studied"},{"key":"B","text":"studying"},{"key":"C","text":"read"}],"expectedOption":"B","expectedAnswer":"studying"},{"id":"ssg_9","type":"comprehension","question":"I want to be successful ___ life.","options":[{"key":"A","text":"on"},{"key":"B","text":"over"},{"key":"C","text":"in"}],"expectedOption":"C","expectedAnswer":"in"},{"id":"ssg_10","type":"comprehension","question":"I have something ___.","options":[{"key":"A","text":"to say"},{"key":"B","text":"bring"},{"key":"C","text":"talk"}],"expectedOption":"A","expectedAnswer":"to say"},{"id":"ssg_11","type":"comprehension","question":"I love eating ___.","options":[{"key":"A","text":"dessert"},{"key":"B","text":"desert"},{"key":"C","text":"deceit"}],"expectedOption":"A","expectedAnswer":"dessert"},{"id":"ssg_12","type":"comprehension","question":"___ mobile phone is this?","options":[{"key":"A","text":"Which"},{"key":"B","text":"Whose"},{"key":"C","text":"What"}],"expectedOption":"B","expectedAnswer":"Whose"},{"id":"ssg_13","type":"comprehension","question":"You received my birthday gift. ___","options":[{"key":"A","text":"Have not you?"},{"key":"B","text":"True or not?"},{"key":"C","text":"Didn't you?"}],"expectedOption":"C","expectedAnswer":"Didn't you?"},{"id":"ssg_14","type":"comprehension","question":"Virat Kohli is considered one of the most famous batsmen. ___","options":[{"key":"A","text":"Yes, he is."},{"key":"B","text":"Yes, is."},{"key":"C","text":"Yes, is he!"}],"expectedOption":"A","expectedAnswer":"Yes, he is."},{"id":"ssg_15","type":"comprehension","question":"___ the better team, we lost the match.","options":[{"key":"A","text":"Although being"},{"key":"B","text":"Despite of being"},{"key":"C","text":"Despite"}],"expectedOption":"C","expectedAnswer":"Despite"},{"id":"ssg_16","type":"comprehension","question":"The best way to learn English is ___","options":[{"key":"A","text":"in speaking"},{"key":"B","text":"to speaking"},{"key":"C","text":"by speaking"}],"expectedOption":"C","expectedAnswer":"by speaking"},{"id":"ssg_17","type":"comprehension","question":"If only I ___ richer.","options":[{"key":"A","text":"were"},{"key":"B","text":"can"},{"key":"C","text":"should"}],"expectedOption":"A","expectedAnswer":"were"},{"id":"ssg_18","type":"comprehension","question":"You aren't allowed to use your phone, so ___","options":[{"key":"A","text":"It's no point in leaving it on."},{"key":"B","text":"There's no point in leaving it on."},{"key":"C","text":"There's no point to leaving it on."}],"expectedOption":"B","expectedAnswer":"There's no point in leaving it on."},{"id":"ssg_19","type":"comprehension","question":"My favourite colours ___","options":[{"key":"A","text":"are blue, green and purple."},{"key":"B","text":"is blue green and purple."},{"key":"C","text":"blue-green and purple."}],"expectedOption":"A","expectedAnswer":"are blue, green and purple."},{"id":"ssg_20","type":"comprehension","question":"Perhaps Elizabeth ___ pass the exam.","options":[{"key":"A","text":"may"},{"key":"B","text":"can"},{"key":"C","text":"will"}],"expectedOption":"A","expectedAnswer":"may"},{"id":"ssg_21","type":"comprehension","question":"I ___ breakfast this morning.","options":[{"key":"A","text":"hadn't"},{"key":"B","text":"didn't have"},{"key":"C","text":"haven't"}],"expectedOption":"B","expectedAnswer":"didn't have"},{"id":"ssg_22","type":"comprehension","question":"I ___ see a doctor ___ I felt sick.","options":[{"key":"A","text":"had to, because"},{"key":"B","text":"have to, because"},{"key":"C","text":"has to, because"}],"expectedOption":"A","expectedAnswer":"had to, because"},{"id":"ssg_23","type":"comprehension","question":"___ you mind if I didn't come?","options":[{"key":"A","text":"Could"},{"key":"B","text":"Would"},{"key":"C","text":"Will"}],"expectedOption":"B","expectedAnswer":"Would"},{"id":"ssg_24","type":"comprehension","question":"It ___ cats and dogs.","options":[{"key":"A","text":"rain"},{"key":"B","text":"ruined"},{"key":"C","text":"rained"}],"expectedOption":"C","expectedAnswer":"rained"},{"id":"ssg_25","type":"comprehension","question":"We arrived ___ Dubai.","options":[{"key":"A","text":"to"},{"key":"B","text":"in"},{"key":"C","text":"at"}],"expectedOption":"B","expectedAnswer":"in"},{"id":"ssg_26","type":"comprehension","question":"Can I borrow ___ money? How ___ do you need?","options":[{"key":"A","text":"some, many"},{"key":"B","text":"any, much"},{"key":"C","text":"some, much"}],"expectedOption":"C","expectedAnswer":"some, much"},{"id":"ssg_27","type":"comprehension","question":"I would rather Friday ___ Saturday.","options":[{"key":"A","text":"than"},{"key":"B","text":"or"},{"key":"C","text":"not"}],"expectedOption":"A","expectedAnswer":"than"},{"id":"ssg_28","type":"comprehension","question":"He plays football ___.","options":[{"key":"A","text":"skilful"},{"key":"B","text":"skilfully"},{"key":"C","text":"skilled"}],"expectedOption":"B","expectedAnswer":"skilfully"},{"id":"ssg_29","type":"comprehension","question":"Is Usaama ___ Andrew?","options":[{"key":"A","text":"taller that"},{"key":"B","text":"as tall as"},{"key":"C","text":"more tall than"}],"expectedOption":"B","expectedAnswer":"as tall as"},{"id":"ssg_30","type":"comprehension","question":"She looks ___ she's going to be sick.","options":[{"key":"A","text":"as if"},{"key":"B","text":"like if"},{"key":"C","text":"if"}],"expectedOption":"A","expectedAnswer":"as if"},{"id":"ssg_31","type":"comprehension","question":"Your phone ___ while you were away.","options":[{"key":"A","text":"ring"},{"key":"B","text":"rang"},{"key":"C","text":"reign"}],"expectedOption":"B","expectedAnswer":"rang"},{"id":"ssg_32","type":"comprehension","question":"She ___ me to go to school.","options":[{"key":"A","text":"said"},{"key":"B","text":"suggested"},{"key":"C","text":"told"}],"expectedOption":"C","expectedAnswer":"told"},{"id":"ssg_33","type":"comprehension","question":"I bought a bunch of ___.","options":[{"key":"A","text":"roses"},{"key":"B","text":"bananas"},{"key":"C","text":"sweets"}],"expectedOption":"A","expectedAnswer":"roses"},{"id":"ssg_34","type":"comprehension","question":"Where is the ___ accommodation?","options":[{"key":"A","text":"most"},{"key":"B","text":"most farthest"},{"key":"C","text":"nearest"}],"expectedOption":"C","expectedAnswer":"nearest"},{"id":"ssg_35","type":"comprehension","question":"I don't like coffee. ___ do I.","options":[{"key":"A","text":"So"},{"key":"B","text":"Neither"},{"key":"C","text":"Either"}],"expectedOption":"B","expectedAnswer":"Neither"},{"id":"ssg_36","type":"comprehension","question":"He had come ___ the money.","options":[{"key":"A","text":"on"},{"key":"B","text":"by"},{"key":"C","text":"at"}],"expectedOption":"B","expectedAnswer":"by"},{"id":"ssg_37","type":"comprehension","question":"You ___ the cleaning.","options":[{"key":"A","text":"needn't have done"},{"key":"B","text":"wouldn't have done"},{"key":"C","text":"couldn't have done"}],"expectedOption":"A","expectedAnswer":"needn't have done"},{"id":"ssg_38","type":"comprehension","question":"___ requires resilience.","options":[{"key":"A","text":"Friendship"},{"key":"B","text":"Sleeping"},{"key":"C","text":"Eating"}],"expectedOption":"A","expectedAnswer":"Friendship"},{"id":"ssg_39","type":"comprehension","question":"I ___ her all my life.","options":[{"key":"A","text":"known"},{"key":"B","text":"have been knowing"},{"key":"C","text":"have known"}],"expectedOption":"C","expectedAnswer":"have known"},{"id":"ssg_40","type":"comprehension","question":"I went to the barber for ___.","options":[{"key":"A","text":"haircutting"},{"key":"B","text":"a haircut"},{"key":"C","text":"hair making"}],"expectedOption":"B","expectedAnswer":"a haircut"},{"id":"ssg_41","type":"comprehension","question":"The laptop belongs to my uncle. So, it is ___.","options":[{"key":"A","text":"my uncles laptop"},{"key":"B","text":"my uncle's laptop"},{"key":"C","text":"my uncles' laptop"}],"expectedOption":"B","expectedAnswer":"my uncle's laptop"},{"id":"ssg_42","type":"comprehension","question":"Nurses ___ ill people and gardeners ___ flowers and plants.","options":[{"key":"A","text":"look after, cultivate"},{"key":"B","text":"look at, cultivate"},{"key":"C","text":"look in, cultivate"}],"expectedOption":"A","expectedAnswer":"look after, cultivate"},{"id":"ssg_43","type":"comprehension","question":"Without her glasses, she is as blind as ___.","options":[{"key":"A","text":"a bat"},{"key":"B","text":"darkness"},{"key":"C","text":"a beggar"}],"expectedOption":"A","expectedAnswer":"a bat"},{"id":"ssg_44","type":"comprehension","question":"You ___ play in the middle of the road.","options":[{"key":"A","text":"ought not to"},{"key":"B","text":"don't ever"},{"key":"C","text":"can never"}],"expectedOption":"A","expectedAnswer":"ought not to"},{"id":"ssg_45","type":"comprehension","question":"I wish to ___ the older version.","options":[{"key":"A","text":"revert back"},{"key":"B","text":"respond"},{"key":"C","text":"revert to"}],"expectedOption":"C","expectedAnswer":"revert to"},{"id":"ssg_46","type":"comprehension","question":"His sister is the one ___ to him in the photo.","options":[{"key":"A","text":"standing"},{"key":"B","text":"stood"},{"key":"C","text":"adjacent"}],"expectedOption":"A","expectedAnswer":"standing"},{"id":"ssg_47","type":"comprehension","question":"Can I take ___ to read?","options":[{"key":"A","text":"it home"},{"key":"B","text":"it to home"},{"key":"C","text":"for home"}],"expectedOption":"A","expectedAnswer":"it home"},{"id":"ssg_48","type":"comprehension","question":"The doctor gave me a ___.","options":[{"key":"A","text":"receipt"},{"key":"B","text":"prescription"},{"key":"C","text":"dose"}],"expectedOption":"B","expectedAnswer":"prescription"},{"id":"ssg_49","type":"comprehension","question":"___ Arabic food?","options":[{"key":"A","text":"Have you ever ate"},{"key":"B","text":"Have you ever eaten"},{"key":"C","text":"Have you eaten ever"}],"expectedOption":"B","expectedAnswer":"Have you ever eaten"},{"id":"ssg_50","type":"comprehension","question":"I am ___ not coming for duty next week.","options":[{"key":"A","text":"possibly"},{"key":"B","text":"definitely"},{"key":"C","text":"probably"}],"expectedOption":"B","expectedAnswer":"definitely"},{"id":"ssg_51","type":"comprehension","question":"I will be among the ___ to this Friday's movie premiere.","options":[{"key":"A","text":"spectators"},{"key":"B","text":"crowd"},{"key":"C","text":"audience"}],"expectedOption":"A","expectedAnswer":"spectators"},{"id":"ssg_52","type":"comprehension","question":"You shouldn't count your ___ before they are hatched.","options":[{"key":"A","text":"chickens"},{"key":"B","text":"ducks"},{"key":"C","text":"eggs"}],"expectedOption":"C","expectedAnswer":"eggs"},{"id":"ssg_53","type":"comprehension","question":"If I had a million dollars, I ___.","options":[{"key":"A","text":"will buy a luxury car"},{"key":"B","text":"would buy a luxury car"},{"key":"C","text":"bought a luxury car"}],"expectedOption":"B","expectedAnswer":"would buy a luxury car"},{"id":"ssg_54","type":"comprehension","question":"Hi - Long time no see! ___","options":[{"key":"A","text":"I haven't seen you in 10 years! What have you been up to?"},{"key":"B","text":"I haven't seen you since last 10 years! Where did you go to?"},{"key":"C","text":"I didn't see you for 10 years! What have you been up to?"}],"expectedOption":"A","expectedAnswer":"I haven't seen you in 10 years! What have you been up to?"},{"id":"ssg_55","type":"comprehension","question":"No sooner had the accident happened ___ the ___ gathered.","options":[{"key":"A","text":"that, audience"},{"key":"B","text":"then, people"},{"key":"C","text":"than, crowd"}],"expectedOption":"C","expectedAnswer":"than, crowd"},{"id":"ssg_56","type":"comprehension","question":"He decided that he ___.","options":[{"key":"A","text":"ought not to"},{"key":"B","text":"needn't"},{"key":"C","text":"didn't have to"}],"expectedOption":"C","expectedAnswer":"didn't have to"},{"id":"ssg_57","type":"comprehension","question":"The supervisor gave you a coupon ___?","options":[{"key":"A","text":"hadn't he"},{"key":"B","text":"hasn't he"},{"key":"C","text":"didn't he"}],"expectedOption":"C","expectedAnswer":"didn't he"},{"id":"ssg_58","type":"comprehension","question":"While I ___ to work, I ___ an old friend.","options":[{"key":"A","text":"walked, bumped into"},{"key":"B","text":"walked, was bumping into"},{"key":"C","text":"was walking, bumped into"}],"expectedOption":"C","expectedAnswer":"was walking, bumped into"},{"id":"ssg_59","type":"comprehension","question":"You have made a lot of ___.","options":[{"key":"A","text":"mistakes"},{"key":"B","text":"wrongs"},{"key":"C","text":"faults"}],"expectedOption":"A","expectedAnswer":"mistakes"},{"id":"ssg_60","type":"comprehension","question":"If I could travel anywhere, I ___ America.","options":[{"key":"A","text":"will travel"},{"key":"B","text":"would travel"},{"key":"C","text":"would prefer"}],"expectedOption":"B","expectedAnswer":"would travel"},{"id":"ssg_61","type":"comprehension","question":"managing your ___ settings","options":[{"key":"A","text":"security"},{"key":"B","text":"privacy"},{"key":"C","text":"publicity"},{"key":"D","text":"social"}],"expectedOption":"B","expectedAnswer":"privacy"},{"id":"ssg_62","type":"comprehension","question":"keep your personal information ___","options":[{"key":"A","text":"secure"},{"key":"B","text":"unlocked"},{"key":"C","text":"secular"},{"key":"D","text":"authenticated"}],"expectedOption":"A","expectedAnswer":"secure"},{"id":"ssg_63","type":"comprehension","question":"___ may try to trick you","options":[{"key":"A","text":"Scammers"},{"key":"B","text":"People"},{"key":"C","text":"Influencers"},{"key":"D","text":"Followers"}],"expectedOption":"A","expectedAnswer":"Scammers"},{"id":"ssg_64","type":"comprehension","question":"fake news can spread ___","options":[{"key":"A","text":"truthfulness"},{"key":"B","text":"misinformation"},{"key":"C","text":"positivity"},{"key":"D","text":"too much"}],"expectedOption":"B","expectedAnswer":"misinformation"},{"id":"ssg_65","type":"comprehension","question":"important to ___ sources","options":[{"key":"A","text":"disprove"},{"key":"B","text":"debunk"},{"key":"C","text":"verify"},{"key":"D","text":"read"}],"expectedOption":"C","expectedAnswer":"verify"},{"id":"ssg_66","type":"comprehension","question":"use ___ tools","options":[{"key":"A","text":"contradictory"},{"key":"B","text":"profile-checking"},{"key":"C","text":"file-making"},{"key":"D","text":"fact-checking"}],"expectedOption":"D","expectedAnswer":"fact-checking"},{"id":"ssg_67","type":"comprehension","question":"have an ___ on mental health","options":[{"key":"A","text":"eject"},{"key":"B","text":"elimination"},{"key":"C","text":"fun-fact"},{"key":"D","text":"impact"}],"expectedOption":"D","expectedAnswer":"impact"},{"id":"ssg_68","type":"comprehension","question":"lead to stress and ___","options":[{"key":"A","text":"happiness"},{"key":"B","text":"worry"},{"key":"C","text":"anxiety"},{"key":"D","text":"eagerness"}],"expectedOption":"C","expectedAnswer":"anxiety"},{"id":"ssg_69","type":"comprehension","question":"feelings of ___","options":[{"key":"A","text":"adequacy"},{"key":"B","text":"inadequacy"},{"key":"C","text":"competency"},{"key":"D","text":"sufficiency"}],"expectedOption":"B","expectedAnswer":"inadequacy"},{"id":"ssg_70","type":"comprehension","question":"focus on ___ connections","options":[{"key":"A","text":"authentic"},{"key":"B","text":"falsify"},{"key":"C","text":"ignoring"},{"key":"D","text":"telepathic"}],"expectedOption":"A","expectedAnswer":"authentic"}],
  housekeeping: [
    {
      id: 'h1', type: 'reading',
      passage: 'Innovision clients in UAE hospitality require strict colour-coded equipment: Red for washrooms and high-contamination areas, Blue for general public areas and corridors, Green for food preparation and kitchen zones, Yellow for isolation/quarantine rooms. Cross-use of equipment is a disciplinary offence under UAE hospitality standards.',
      question: 'What colour-coded equipment must be used in UAE hotel kitchen cleaning zones?'
    },
    {
      id: 'h2', type: 'comprehension',
      question: 'A VIP guest at a 5-star Dubai hotel calls to complain their room has not been cleaned despite placing the "Please Clean" sign 3 hours ago. How do you respond and resolve this immediately?'
    },
    {
      id: 'h3', type: 'situational',
      question: 'While cleaning a room at a UAE hotel, you discover a wallet containing AED 500 cash and a credit card. Describe your exact actions step by step.'
    },
    {
      id: 'h4', type: 'reading',
      passage: 'All chemical cleaning agents used in UAE hospitality must comply with ESMA (Emirates Authority for Standardization) safety guidelines: stored in original labelled containers, never mixed with other chemicals, used with appropriate PPE, and fully logged in the housekeeping chemical register each shift.',
      question: 'According to ESMA guidelines, what must housekeeping staff do with chemical cleaning agents at the start of each shift?'
    },
    {
      id: 'h5', type: 'situational',
      question: 'You have 10 hotel rooms to clean and a VIP guest is checking into Room 7 in 45 minutes. How do you prioritise and complete your work on time?'
    }
  ],
  supervisor: [
    {
      id: 'sv1', type: 'reading',
      passage: 'Innovision field supervisors deployed in UAE are required to conduct a daily morning briefing, assign tasks with written work orders, monitor attendance against roster, mediate any on-site disputes before escalation, and submit a digital shift report via the client app to Innovision management by the end of each shift.',
      question: 'By when must an Innovision field supervisor submit the digital shift report to management?'
    },
    {
      id: 'sv2', type: 'comprehension',
      question: 'Two team members under your supervision have a personal dispute and refuse to work on the same floor of a Dubai facility. How do you resolve this without disrupting operations?'
    },
    {
      id: 'sv3', type: 'situational',
      question: 'You are supervising a 12-person FM team in Abu Dhabi and 3 workers call in absent on the same morning with no notice. How do you manage the shift effectively?'
    },
    {
      id: 'sv4', type: 'reading',
      passage: 'UAE client KPI requirements for Innovision supervisors include: attendance rate above 96%, task completion rate above 92%, zero unresolved safety incidents, and client complaint resolution within 2 hours. Any KPI breach must be escalated to Innovision operations within 24 hours with a root cause report.',
      question: 'What must a supervisor provide when escalating a KPI breach to Innovision operations?'
    },
    {
      id: 'sv5', type: 'situational',
      question: 'A newly deployed Innovision worker on your UAE team is struggling with work pace and has received 2 informal warnings in their first week. How do you approach their performance improvement professionally?'
    }
  ],
  helper: [
    {
      id: 'hh1', type: 'reading',
      passage: 'General helpers deployed by Innovision Overseas to UAE sites are required to follow all site safety inductions, wear appropriate PPE at all times, report any unsafe condition to the supervisor immediately, and never operate machinery without written authorisation from the site engineer.',
      question: 'Under what condition may an Innovision-deployed helper operate machinery on a UAE site?'
    },
    {
      id: 'hh2', type: 'comprehension',
      question: 'You notice a co-worker at your UAE site is not wearing their hard hat in a mandatory zone and ignoring your verbal reminder. What do you do?'
    },
    {
      id: 'hh3', type: 'situational',
      question: 'You are asked by a UAE site foreman to carry materials through a barricaded area marked "Danger — No Entry". What is your response?'
    },
    {
      id: 'hh4', type: 'reading',
      passage: 'UAE labour law entitles every worker to a minimum 45-minute rest break after 5 consecutive hours of work in temperatures above 38°C. During summer months (June–September), outdoor work is prohibited between 12:30 PM and 3:00 PM.',
      question: 'During UAE summer months, what are the outdoor work prohibition hours?'
    },
    {
      id: 'hh5', type: 'situational',
      question: 'Describe how you would handle a situation where you are unsure of the correct way to complete a task assigned by your UAE site supervisor.'
    }
  ]
};

/* ── BADGE MAPS ──────────────────────────────────── */
const BADGE_MAP = {
  reading:       'badge-reading',
  comprehension: 'badge-comprehension',
  situational:   'badge-situational'
};
const BADGE_LBL = {
  reading:       'Reading',
  comprehension: 'Comprehension',
  situational:   'Situational'
};

/* ── DEMO SEED DATA (pre-populates admin on first load) ── */
const DEMO_CANDIDATES = [
  {
    id: 'INV2001001', firstName: 'Rajesh', lastName: 'Sharma',
    phone: '+91 98100 11223', email: 'rajesh@example.com',
    city: 'Gurugram, Haryana', experience: '5',
    passport: 'Valid Passport (6+ months)', education: '12th Pass',
    languages: 'Hindi, English', gulfExp: 'Yes — UAE',
    job: 'driver', source: 'Instagram',
    scores: { reading: 84, voice: 78, quality: 87, total: 83 },
    status: 'pending',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    questions: [],  // filled in app.js init
    evaluations: {
      td_p1_q1: { written: { matched: true, score: 1 },  voice: { matched: false, score: 0 } },
      td_p1_q2: { written: { matched: true, score: 1 },  voice: { matched: false, score: 0 } },
      td_p1_q3: { written: { matched: true, score: 1 },  voice: { matched: true,  score: 1 } }
    },
    answers: {
      td_p1_q1: 'Japan is famous for its industry and manufacturing.',
      td_p1_q2: 'Exported means goods are sent to other countries for sale.',
      td_p1_q3: 'People prefer Japanese products because they are not expensive and last for a long time.'
    },
    voice: { td_p1_q3: 'People prefer Japanese products because they are not expensive and last for a long time.' }
  },
  {
    id: 'INV2001002', firstName: 'Priya', lastName: 'Verma',
    phone: '+91 97200 22334', email: 'priya@example.com',
    city: 'Delhi', experience: '3',
    passport: 'Valid Passport (6+ months)', education: 'Graduate',
    languages: 'Hindi, English, Punjabi', gulfExp: 'No — First time',
    job: 'security', source: 'Facebook',
    scores: { reading: 76, voice: 69, quality: 73, total: 73 },
    status: 'selected',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    questions: [],
    evaluations: {
      ssg_p1_q1: { written: { matched: true, score: 1 },  voice: { matched: false, score: 0 } },
      ssg_p1_q2: { written: { matched: true, score: 1 },  voice: { matched: true,  score: 1 } },
      ssg_p1_q3: { written: { matched: false, score: 0 }, voice: { matched: false, score: 0 } }
    },
    answers: {
      ssg_p1_q1: 'Japan is famous for its industry and manufacturing.',
      ssg_p1_q2: 'Exported means goods are sent to other countries for sale.'
    },
    voice: { ssg_p1_q2: 'Exported means goods are sent to other countries for sale.' }
  },
  {
    id: 'INV2001003', firstName: 'Ramesh', lastName: 'Yadav',
    phone: '+91 96300 33445', email: '',
    city: 'Faridabad, Haryana', experience: '1',
    passport: 'Applied — awaiting', education: '10th Pass',
    languages: 'Hindi', gulfExp: 'No — First time',
    job: 'helper', source: 'WhatsApp',
    scores: { reading: 51, voice: 44, quality: 52, total: 49 },
    status: 'rejected',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    questions: [],
    answers: { hh1: 'Need permission.' },
    voice: {}
  },
  {
    id: 'INV2001004', firstName: 'Sunita', lastName: 'Singh',
    phone: '+91 95400 44556', email: 'sunita@example.com',
    city: 'Noida, UP', experience: '7',
    passport: 'Valid Passport (6+ months)', education: 'Graduate',
    languages: 'Hindi, English, Marathi', gulfExp: 'Yes — Saudi Arabia',
    job: 'supervisor', source: 'Referral',
    scores: { reading: 91, voice: 88, quality: 94, total: 91 },
    status: 'pending',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    questions: [],
    answers: {
      sv1: 'A digital shift report must be submitted to Innovision management via the client app by end of each shift.',
      sv2: 'I would meet both members separately, understand root cause, set ground rules, then bring them together.'
    },
    voice: { sv3: 'I would immediately reassign priority tasks, contact standby workers, and inform the Innovision operations team.' }
  },
  {
    id: 'INV2001005', firstName: 'Anil', lastName: 'Gupta',
    phone: '+91 94500 55667', email: 'anil.gupta@email.com',
    city: 'Jaipur, Rajasthan', experience: '4',
    passport: 'Valid Passport (6+ months)', education: 'ITI / Diploma',
    languages: 'Hindi, English', gulfExp: 'Yes — UAE',
    job: 'housekeeping', source: 'Instagram',
    scores: { reading: 79, voice: 72, quality: 81, total: 77 },
    status: 'pending',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    questions: [],
    answers: {
      h1: 'Green coded equipment is used in food preparation and kitchen zones.',
      h2: 'I would immediately apologise, go to the room personally, complete cleaning within 20 minutes, and follow up.'
    },
    voice: { h3: 'I would not touch it, inform my supervisor immediately, and complete the lost property form as per hotel policy.' }
  }
];

/* ── STORAGE HELPERS ─────────────────────────────── */
const STORAGE_KEY = 'inv_candidates';

function loadAdminData() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Deduplicate by First Name + Last Name (case-insensitive) to prevent redundant rows
    const uniqueMap = new Map();
    raw.forEach(r => {
      const key = ((r.firstName || '').trim().toLowerCase() + '|' + (r.lastName || '').trim().toLowerCase());
      uniqueMap.set(key, r); // Later entries automatically overwrite older ones
    });
    const result = Array.from(uniqueMap.values());
    if (result.length !== raw.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result)); // self-heal
    }
    return result;
  } catch (e) {
    console.warn('Innovision: failed to load candidate data', e);
    return [];
  }
}

function saveAdminData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Innovision: failed to save candidate data', e);
  }
}
