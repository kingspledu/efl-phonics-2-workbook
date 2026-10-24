// Workbook image and unwritten-answer regions. Coordinates use the 922 x 1230 scan.
const READING_REGIONS = {};
function region(page, x, y, w, h, text, kind = 'picture') {
  (READING_REGIONS[page] ??= []).push({ x: x / 922, y: y / 1230, w: w / 922, h: h / 1230, text, kind });
}
function grid(page, xs, ys, words, w = 145, h = 115, answerOffset = null) {
  words.forEach((word, i) => {
    if (!word) return;
    const x = xs[i % xs.length], y = ys[Math.floor(i / xs.length)];
    region(page, x - w / 2, y - h / 2, w, h, word);
    if (answerOffset !== null) region(page, x - w / 2, y + answerOffset, w, 49, word, 'answer');
  });
}
function sentenceRows(page, words, ys, answerXs) {
  words.forEach((word, i) => {
    region(page, 122, ys[i] - 50, 172, 110, word);
    region(page, answerXs[i], ys[i] - 26, 170, 60, word, 'answer');
  });
}
function answers(page, xs, ys, words, w = 145, h = 55) {
  words.forEach((word, i) => {
    if (word) region(page, xs[i % xs.length] - w / 2, ys[Math.floor(i / xs.length)] - h / 2, w, h, word, 'answer');
  });
}

grid(4, [210, 465, 725], [315, 645], ['pan','hat','mat','fan','bat','man'], 160, 105, 160);
grid(5, [205, 365, 590, 750], [255, 475], ['can','fan','man','mat','hat','bat','fan','pan'], 115, 100);
grid(5, [195, 375, 555, 735], [745, 860], ['can','mat','man','cat','fan','pan','hat','bat'], 130, 90);
sentenceRows(6, ['man','mat','hat','fan'], [215,365,515,665], [370,515,575,365]);
region(6, 175, 955, 190, 145, 'can');
grid(7, [215, 585], [310, 500, 700], ['lap','dad','jam','tap','sad','dam'], 165, 145, 70);
grid(8, [185, 385, 560, 750], [205, 430], ['cat','sad','lap','map','tap','dad','pan','hat'], 140, 120);
grid(8, [185, 370, 550, 735], [750, 865], ['fan','bat','jam','mat','dam','map','man','cap'], 145, 95);
sentenceRows(9, ['tap','jam','map','dad'], [215,365,515,665], [570,535,535,330]);
grid(10, [200, 580], [370, 530, 690], ['dip','six','hip','mix','hit','sit'], 150, 105, 5);
grid(11, [185, 295, 410, 555, 665, 780], [255, 470], ['tap','mix','hit','lip','lap','sad','pan','fan','dam','cap','jam','mat'], 92, 102);
grid(11, [195, 575], [745,900,1060], ['sit','map','cat','hip','dad','man'], 120, 115);
sentenceRows(12, ['sit','mix','pin','six'], [215,365,515,665], [382,382,382,495]);
grid(13, [195,380,570,755], [325,710], ['lid','rib','dig','fin','bib','wig','pin','kid'], 140, 130, 70);
grid(14, [155,265,390,510,650,760], [275,535], ['bib','rib','pin','fin','dig','wig','lap','map','fan','man','lid','lip'], 90, 92);
grid(14, [185,370,560,750], [800,1025], ['can','hit','sad','dam','lid','dig','bat','kid'], 125, 120, 85);
sentenceRows(15, ['bib','rib','wig','pin'], [215,365,515,665], [485,485,380,380]);
grid(16, [190,375,565,755], [345,570,790,1010], ['man','dip','tap','six','rib','bat','mix','lap','cap','sad','hit','jam','dig','fan','lid','fin'], 135, 110, 60);
grid(17, [200,375,560,740], [230,380,530], ['map','hip','pan','rip','sit','dam','hit','lap','jam','bib','can','rib'], 140, 115);
grid(18, [190,375,560,750], [225,555,885], ['mat','kid','hat','pin','dad','lip','cap','wig','cat','pan','mix','dip'], 135, 105, 70);
grid(19, [190,370,560,750], [320,630], ['jet','net','vet','wet','bed','red','hen','pen'], 145, 120, 140);
grid(20, [200,470,730], [215,455], ['bed','net','hen','vet','pen','red'], 150, 115);
grid(20, [160,285,405,525,650,770], [840,1080], ['jet','jam','wet','kid','bed','red','pen','pan','hat','hen','net','vet'], 105, 110);
sentenceRows(21, ['red','net','hen','jet'], [215,365,515,665], [455,530,380,380]);
grid(22, [210,585], [340,520,700], ['hot','log','fox','mop','dog','box'], 175, 125, 60);
grid(23, [190,300,410,560,670,785], [255,475], ['hop','fox','hen','dog','wet','net','pen','jet','red','log','pot','box'], 94, 105);
grid(23, [350,485,620,755], [735,860,985,1110], ['pen','hen','pen','fox','dog','jet','bed','log','vet','log','wet','jet','red','fox','vet','box'], 105, 85);
sentenceRows(24, ['box','mop','dog','pot'], [215,365,515,665], [490,475,365,365]);
grid(25, [200,585], [370,530,700], ['mug','pup','rub','bug','cup','tub'], 160, 105, 10);
grid(26, [200,460,745], [230,465], ['pup','log','mop','box','bed','hug'], 155, 100);
grid(26, [335,460,595,735], [820,960,1100], ['red','dog','hop','hen','net','fox','cup','mop','rub','wet','bug','box'], 95, 85);
sentenceRows(27, ['hug','bug','tub','mug'], [215,365,515,665], [430,380,565,490]);
grid(28, [205,465,740], [320,705], ['fun','mud','cut','bud','nut','run'], 165, 125, 60);
grid(29, [195,385,575,755], [215,440], ['bun','log','cup','sad','pen','nut','mug','wig'], 135, 105);
grid(29, [160,285,415,535,665,785], [800], ['bed','jet','hot','box','rub','sun'], 95, 105);
sentenceRows(30, ['bun','nut','nut','bud'], [215,365,515,665], [365,365,495,495]);
grid(31, [190,375,560,750], [330,550,780,1000], ['jet','hot','bun','bed','nut','fox','wet','bud','mop','rug','pen','log','hug','cup','tub','pot'], 135, 115, 75);
grid(32, [185,365,545,725], [235,390,545], ['mug','vet','box','run','hen','fox','bug','pen','sun','pot','hot','net'], 140, 120);
grid(33, [195,385,575,755], [220,545,870], ['rub','mud','mop','red','cut','hen','dog','wet','box','pup','vet','fun'], 135, 105, 130);
grid(34, [190,335,475,615,755], [300,760], ['hat','lip','dad','bed','mop','pot','nut','mug','lid','hen'], 115, 95);
grid(35, [190,375,560,755], [220,465,715,975], ['pen','mix','tub','dog','box','vet','bun','pan','bug','wig','red','sit','sun','dip','sad','hot'], 140, 115, 60);
grid(36, [200,380], [210,340,465,590,720,845,970,1095], ['can','jet','hug','dam','pin','bed','cut','hit','lip','wet','sit','fox','cup','mat','log'], 130, 108);

// Writing boxes without a printed answer receive an example answer to listen to.
answers(6, [215,655], [990], ['can','cat'], 190, 55);
answers(9, [215,455,730], [905], ['cap','dad','dam'], 180, 55);
answers(12, [210,460,730], [905], ['dip','sit','mix'], 180, 55);
answers(15, [180,365,555,750], [905], ['bib','lid','dig','fin'], 155, 55);
answers(21, [210,460,730], [905], ['jet','bed','hen'], 180, 55);
answers(24, [165,365,565,755], [905], ['dog','mop','hot','box'], 145, 55);
answers(27, [210,460,730], [905], ['bug','rub','cup'], 180, 55);
answers(30, [210,460,730], [905], ['bun','bud','nut'], 180, 55);

// Grouped review answers are blank even though their source pictures sit above.
answers(17, [220,470,720], [765,825,1010,1080], ['map','cap','jam','lap','can','dam','hip','bib','sit','dip','rib','hit'], 175, 42);
answers(32, [195,465,730], [760,830,1010,1080], ['mug','run','hen','bug','sun','pen','vet','fox','hot','jet','box','pot'], 170, 45);
answers(36, [725], [192,245,300,410,463,515,620,675,730,840,895,950,1065,1115,1160], ['can','dam','mat','pin','hit','sit','jet','wet','bed','hop','fox','log','hug','cup','cut'], 150, 38);
