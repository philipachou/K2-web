// --- Predictions & Statistical Language Model Module ---
import { getChatHistory, getPersonalSummary } from './db.js';

// --- Dictionary raw list from dictionary.txt ---
export const DICTIONARY_TEXT = `the,1000
and,900
to,800
of,750
a,700
in,650
that,600
is,550
was,500
he,450
for,400
it,380
with,360
as,340
his,320
on,300
at,280
by,260
i,250
this,240
had,230
not,220
but,210
from,200
or,190
she,180
an,170
they,160
which,150
you,140
one,130
we,120
were,110
her,100
would,95
there,90
their,85
what,80
out,75
if,70
about,65
who,60
get,55
go,50
me,45
make,40
can,40
like,35
time,30
say,25
speak,20
hello,15
thank,10
water,10
help,10
food,10
hungry,5
thirsty,5
pain,5
tired,5
yes,15
no,15
please,10
more,10
home,10
doctor,5
nurse,5
bathroom,5
sleep,5
now,10
later,5
today,5
tomorrow,5
good,10
bad,5
cold,5
hot,5
warm,5
turn,10
light,10
on,10
off,10
tv,5
music,5
chair,5
bed,5
sit,5
stand,5
up,10
down,10
left,5
right,5
stop,10
start,5
open,5
close,5
call,5
pete,5
emma,5
phil,5
griffin,5
niko,5
nopo,5
how,20
are,20
fine,10
great,10
okay,10
see,10
look,10
know,15
think,15
feel,10
want,15
need,15
love,10
happy,10
sad,5
angry,5
scared,5
bored,5
confused,5
sorry,10
welcome,5
talk,10
listen,10
hear,10
understand,5
remember,5
forget,5
wait,10
come,10
leave,5
stay,5
bring,5
take,10
give,10
show,10
tell,10
ask,10
answer,5
read,5
write,5
watch,5
play,5
work,5
eat,5
drink,5
medication,5
pill,5
glasses,5
phone,5
computer,5
tablet,5
blanket,5
pillow,5
fan,5
heater,5
window,5
door,5
room,5
kitchen,5
outside,5
inside,5
morning,5
afternoon,5
evening,5
night,5
always,5
never,5
sometimes,5
maybe,5
really,5
very,10
much,10
little,5
few,5
many,5
all,10
some,10
any,5
none,5
big,5
small,5
fast,5
slow,5
hard,5
easy,5
new,5
old,5
first,5
last,5
next,5
back,10
again,5
why,10
when,15
where,15
which,10
who,10
whose,5
here,15
there,15
where,10
everywhere,5
nowhere,5
something,5
anything,5
nothing,5
everything,5
someone,5
anyone,5
no one,5
everyone,5
because,5
since,5
though,5
although,5
unless,5
until,5
while,5
before,5
after,5
during,5
through,5
across,5
around,5
behind,5
between,5
under,5
over,5
above,5
below,5
inside,5
outside,5
into,5
onto,5
toward,5
away,5
together,5
apart,5
alone,5
family,5
friend,5
husband,5
wife,5
son,5
daughter,5
brother,5
sister,5
mother,5
father,5
parents,5
children,5
body,5
head,5
eye,5
eyes,5
ear,5
ears,5
mouth,5
nose,5
face,5
arm,5
arms,5
hand,5
hands,5
leg,5
legs,5
foot,5
feet,5
back,5
chest,5
stomach,5
throat,5
neck,5
shoulder,5
shoulders,5
itch,5
ache,5
burn,5
tingle,5
cramp,5
stiff,5
weak,5
dizzy,5
nausea,5
breath,5
breathe,5
cough,5
choke,5
swallow,5
suction,5
bipap,5
trach,5
feed,5
tube,5
pump,5
ventilator,5
oxygen,5
mask,5
sling,5
hoyer,5
lift,5
reposition,5
adjust,5
scratch,5
wipe,5
clean,5
dry,5
wash,5
brush,5
teeth,5
hair,5
shave,5
dress,5
undress,5
clothes,5
shirt,5
pants,5
socks,5
shoes,5
jacket,5
glasses,5
hearing,5
aid,5
wheelchair,5
tilt,5
recline,5
elevate,5
feet,5
legs,5
headrest,5
armrest,5
footrest,5
joystick,5
gaze,5
tracker,5
screen,5
keyboard,5
mouse,5
switch,5
battery,5
charger,5
plug,5
power,5
wifi,5
internet,5
connection,5
volume,5
louder,5
softer,5
mute,5
brightness,5
darker,5
lighter,5
app,5
browser,5
email,5
text,5
message,5
youtube,5
audiobook,5
kindle,5
netflix,5
spotify,5
weather,5
sunny,5
rain,5
snow,5
wind,5
cloudy,5
forecast,5
temperature,5
degree,5
degrees,5
air,5
conditioner,5
thermostat,5
alexa,5
google,5
siri,5
assistant,5
lights,5
lamp,5
ceiling,5
blind,5
blinds,5
shade,5
shades,5
front,5
back,5
porch,5
garage,5
driveway,5
garden,5
plants,5
flowers,5
trees,5
birds,5
cat,5
dog,5
pet,5
visit,5
visitor,5
guest,5
appointment,5
schedule,5
calendar,5
clock,5
hour,5
minute,5
second,5
monday,5
tuesday,5
wednesday,5
thursday,5
friday,5
saturday,5
sunday,5
january,5
february,5
march,5
april,5
may,5
june,5
july,5
august,5
september,5
october,5
november,5
december,5
morning,5
noon,5
afternoon,5
evening,5
midnight,5
breakfast,5
lunch,5
dinner,5
snack,5
coffee,5
tea,5
juice,5
water,5
smoothie,5
soup,5
ice,5
cream,5
fruit,5
apple,5
banana,5
orange,5
berries,5
vegetable,5
salad,5
bread,5
toast,5
butter,5
jam,5
egg,5
eggs,5
cheese,5
yogurt,5
meat,5
chicken,5
fish,5
pasta,5
rice,5
potato,5
potatoes,5
sweet,5
salty,5
sour,5
bitter,5
spicy,5
flavor,5
taste,5
delicious,5
yummy,5
full,5
more,5
enough,5
finished,5
done,5
ready,5
waiting,5
soon,5
almost,5
always,5
never,5
maybe,5
sure,5
certain,5
possible,5
impossible,5
important,5
urgent,5
emergency,5
help,5
call 911,5
trouble,5
problem,5
safe,5
danger,5
careful,5
slow down,5
hurry,5
relax,5
calm,5
quiet,5
loud,5
noisy,5
peaceful,5
comfortable,5
uncomfortable,5
better,5
worse,5
same,5
different,5
easy,5
difficult,5
hard,5
simple,5
complex,5
clear,5
fuzzy,5
bright,5
dim,5
dark,5
open,5
shut,5
locked,5
unlocked,5
stuck,5
free,5
broken,5
fixed,5
working,5
offline,5
online,5
available,5
busy,5
resting,5
sleeping,5
awake,5
talking,5
thinking,5
listening,5
watching,5
reading,5
writing,5
enjoying,5
smiling,5
laughing,5
crying,5
hoping,5
wishing,5
praying,5
thankful,5
grateful,5
blessed,5
proud,5
excited,5
nervous,5
calm,5
brave,5
strong,5
patient,5
kind,5
gentle,5
loving,5
caring,5
wonderful,5
fantastic,5
terrific,5
awesome,5
amazing,5
beautiful,5
lovely,5
nice,5
sweet,5
funny,5
silly,5
clever,5
smart,5
wise,5
curious,5
creative,5
friendly,5
polite,5
generous,5
honest,5
helpful,5
thoughtful,5
peaceful,5
stubs
discuss,450
discussion,400
discovered,350
discovery,350
dissertation,400`;

export const DICTIONARY = DICTIONARY_TEXT.split("\n").filter(l => l.trim()).map(line => {
  const parts = line.split(",");
  return { word: parts[0].toLowerCase(), weight: parseInt(parts[1], 10) || 10 };
});

// --- Core Predictor Matrices from tlm.py ---
export const DEFAULT_FREQS = {
  'e': 0.1202, 't': 0.0910, 'a': 0.0812, 'o': 0.0768, 'i': 0.0731,
  'n': 0.0695, 's': 0.0628, 'r': 0.0602, 'h': 0.0592, 'd': 0.0432,
  'l': 0.0398, 'u': 0.0288, 'c': 0.0271, 'm': 0.0261, 'f': 0.0230,
  'y': 0.0211, 'w': 0.0209, 'g': 0.0203, 'p': 0.0182, 'b': 0.0149,
  'v': 0.0111, 'k': 0.0069, 'x': 0.0017, 'q': 0.0011, 'j': 0.0010,
  'z': 0.0007, ' ': 0.1500
};

export const BIGRAM_MATRIX = {
  'a': { 'n': 10, 'r': 9, 't': 8, 's': 7, 'l': 6, 'd': 5, 'c': 4, 'm': 4, 'g': 3, 'b': 2, ' ': 8 },
  'b': { 'e': 10, 'u': 8, 'o': 7, 'a': 6, 'i': 5, 'l': 4, 'r': 4, 'y': 3, ' ': 3 },
  'c': { 'o': 10, 'h': 9, 'e': 8, 'a': 7, 'i': 6, 'k': 5, 'l': 4, 'u': 3, 'r': 3, ' ': 2 },
  'd': { 'e': 10, 'i': 7, 'o': 6, 'a': 5, 'u': 4, 'y': 3, 'r': 2, ' ': 12 },
  'e': { 'r': 10, 'n': 9, 's': 8, 'd': 7, 'a': 6, 'c': 5, 't': 4, 'l': 4, 'v': 3, ' ': 15 },
  'f': { 'o': 10, 'e': 8, 'i': 7, 'a': 6, 'r': 5, 'l': 4, 'u': 3, ' ': 10 },
  'g': { 'e': 10, 'o': 8, 'h': 7, 'i': 6, 'a': 5, 'r': 4, 'l': 3, ' ': 10 },
  'h': { 'e': 20, 'a': 15, 'o': 12, 'i': 10, 'u': 6, 'y': 4, ' ': 5 },
  'i': { 'n': 12, 's': 10, 't': 8, 'c': 7, 'o': 6, 'l': 5, 'd': 4, 'r': 3, ' ': 8 },
  'j': { 'e': 10, 'o': 8, 'a': 6, 'u': 4, ' ': 1 },
  'k': { 'e': 10, 'i': 8, 'y': 5, 'o': 4, 's': 2, ' ': 12 },
  'l': { 'e': 10, 'y': 8, 'o': 7, 'a': 6, 'i': 5, 'd': 4, 'u': 3, 'l': 2, ' ': 10 },
  'm': { 'e': 10, 'a': 8, 'o': 7, 'i': 6, 'u': 5, 'p': 4, 'y': 2, ' ': 10 },
  'n': { 'd': 10, 'g': 9, 't': 8, 'e': 7, 'o': 6, 'a': 5, 'i': 4, ' ': 15 },
  'o': { 'f': 12, 'n': 10, 'u': 8, 'r': 7, 'w': 6, 't': 5, 'm': 4, 'p': 3, ' ': 15 },
  'p': { 'e': 10, 'o': 8, 'a': 7, 'r': 6, 'l': 5, 'i': 4, 'u': 3, 'y': 2, ' ': 5 },
  'q': { 'u': 25, ' ': 1 },
  'r': { 'e': 12, 'o': 10, 'a': 8, 'i': 7, 'n': 5, 'd': 4, 'y': 3, ' ': 15 },
  's': { 't': 12, 'h': 10, 'e': 8, 'o': 7, 'i': 6, 'a': 5, 'u': 4, 'p': 3, ' ': 18 },
  't': { 'h': 22, 'e': 15, 'o': 10, 'a': 8, 'i': 7, 'r': 6, 'u': 4, 'y': 3, ' ': 20 },
  'u': { 'r': 10, 's': 8, 't': 7, 'l': 6, 'n': 5, 'p': 4, 'b': 3, 'c': 2, ' ': 5 },
  'v': { 'e': 15, 'o': 8, 'i': 6, 'a': 4, 'y': 2, ' ': 2 },
  'w': { 'h': 12, 'a': 10, 'o': 8, 'e': 7, 'i': 6, 'r': 2, ' ': 4 },
  'x': { 't': 5, 'e': 4, 'i': 3, ' ': 8 },
  'y': { 'o': 10, 'e': 6, 's': 5, 'a': 4, ' ': 20 },
  'z': { 'e': 10, 'y': 5, 'o': 4, 'a': 2, ' ': 4 }
};

// Next-word prediction context cache
export let lastApiPredictions = [];

export function setLastApiPredictions(preds) {
  lastApiPredictions = preds || [];
}

export function clearLastApiPredictions() {
  lastApiPredictions = [];
}

export let activeWordsAbortController = null;
export let activePhrasesAbortController = null;

// --- Probability Calculations ---
export function getNextCharProbabilities(prefix) {
  if (!prefix) {
    return normalizeProbabilities(DEFAULT_FREQS);
  }
  const lastChar = prefix[prefix.length - 1].toLowerCase();
  if (!BIGRAM_MATRIX[lastChar]) {
    return normalizeProbabilities(DEFAULT_FREQS);
  }

  let weights = Object.assign({}, BIGRAM_MATRIX[lastChar]);

  const alphabet = "abcdefghijklmnopqrstuvwxyz ";
  for (let i = 0; i < alphabet.length; i++) {
    const c = alphabet[i];
    if (weights[c] === undefined) {
      weights[c] = 0.05;
    } else {
      weights[c] += 0.05;
    }
  }
  return normalizeProbabilities(weights);
}

export function getBlendedCharProbabilities(prefix) {
  const staticProbs = getNextCharProbabilities(prefix);

  const lastSpace = prefix.lastIndexOf(" ");
  const currentWordPrefix = lastSpace === -1 ? prefix.toLowerCase() : prefix.substring(lastSpace + 1).toLowerCase();

  if (!currentWordPrefix) {
    return staticProbs;
  }

  // Find matches in local dictionary and cached API predictions
  const dictMatches = DICTIONARY.filter(w => w.word.startsWith(currentWordPrefix));
  const apiMatches = lastApiPredictions.filter(w => w.word.startsWith(currentWordPrefix));

  const dictSum = dictMatches.reduce((sum, item) => sum + item.weight, 0);
  const apiSum = apiMatches.reduce((sum, item) => sum + item.weight, 0);

  // Combine all unique words
  const allWordSet = new Set([
    ...dictMatches.map(m => m.word),
    ...apiMatches.map(m => m.word)
  ]);

  let candidateProbs = {};
  const alpha = apiSum > 0 ? 0.6 : 0.0; // Blend weight: 60% API, 40% Dict

  allWordSet.forEach(word => {
    const dictMatch = dictMatches.find(m => m.word === word);
    const apiMatch = apiMatches.find(m => m.word === word);

    const pDict = dictSum > 0 && dictMatch ? (dictMatch.weight / dictSum) : 0.0;
    const pApi = apiSum > 0 && apiMatch ? (apiMatch.weight / apiSum) : 0.0;

    candidateProbs[word] = alpha * pApi + (1.0 - alpha) * pDict;
  });

  let bucketProbs = {};
  for (const word in candidateProbs) {
    const prob = candidateProbs[word];
    if (word.length > currentWordPrefix.length) {
      const nextChar = word[currentWordPrefix.length];
      if ("abcdefghijklmnopqrstuvwxyz ".includes(nextChar)) {
        bucketProbs[nextChar] = (bucketProbs[nextChar] || 0) + prob;
      }
    } else if (word.length === currentWordPrefix.length) {
      bucketProbs[" "] = (bucketProbs[" "] || 0) + prob;
    }
  }

  const beta = 0.7; // 70% word context, 30% bigram priors
  let blended = {};
  const alphabet = "abcdefghijklmnopqrstuvwxyz ";
  for (let i = 0; i < alphabet.length; i++) {
    const c = alphabet[i];
    const pBucket = bucketProbs[c] || 0.0;
    const pStatic = staticProbs[c] || 0.0;
    blended[c] = beta * pBucket + (1.0 - beta) * pStatic;
  }

  return normalizeProbabilities(blended);
}

export function normalizeProbabilities(freqs) {
  let total = 0;
  for (const k in freqs) {
    total += freqs[k];
  }
  let normalized = {};
  const alphabet = "abcdefghijklmnopqrstuvwxyz ";
  if (total === 0) {
    for (let i = 0; i < alphabet.length; i++) {
      normalized[alphabet[i]] = 1.0 / 27;
    }
    return normalized;
  }
  for (const k in freqs) {
    normalized[k] = freqs[k] / total;
  }
  return normalized;
}

// --- Background Cloud Word & Phrase Prediction Requests ---
export async function executeFetchWords(textBefore, prefix, onUpdate) {
  if (activeWordsAbortController) {
    activeWordsAbortController.abort();
  }
  const controller = new AbortController();
  activeWordsAbortController = controller;
  const signal = controller.signal;

  try {
    const history = await getChatHistory();
    if (activeWordsAbortController !== controller) return;

    const summaryList = await getPersonalSummary();
    if (activeWordsAbortController !== controller) return;

    const profile_summary = summaryList.map(i => `${i.category}: ${i.content}`).join("\n");
    if (activeWordsAbortController !== controller) return;

    const res = await fetch("/api/predict-words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history,
        profile_summary,
        text_prefix: textBefore
      }),
      signal: signal
    });

    const data = await res.json();
    if (activeWordsAbortController !== controller) return;

    if (data.predictions && Array.isArray(data.predictions)) {
      lastApiPredictions = data.predictions;
      if (typeof onUpdate === "function") {
        onUpdate();
      }
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Word predictions API failed:", err);
    }
  } finally {
    if (activeWordsAbortController === controller) {
      activeWordsAbortController = null;
    }
  }
}

export async function executeFetchPhrases(textBefore, textAfter, onPhrasesReceived) {
  if (activePhrasesAbortController) {
    activePhrasesAbortController.abort();
  }
  const controller = new AbortController();
  activePhrasesAbortController = controller;
  const signal = controller.signal;

  const thinking = document.getElementById("phrase-thinking");
  if (thinking) thinking.style.display = "inline";

  try {
    const history = await getChatHistory();
    if (activePhrasesAbortController !== controller) return;

    const summaryList = await getPersonalSummary();
    if (activePhrasesAbortController !== controller) return;

    const profile_summary = summaryList.map(i => `${i.category}: ${i.content}`).join("\n");
    if (activePhrasesAbortController !== controller) return;

    const res = await fetch("/api/predict-phrases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text_prefix: textBefore,
        text_suffix: textAfter,
        history,
        profile_summary
      }),
      signal: signal
    });

    const data = await res.json();
    if (activePhrasesAbortController !== controller) return;

    if (data.phrases && typeof onPhrasesReceived === "function") {
      onPhrasesReceived(data.phrases);
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Phrase prediction request failed:", err);
    }
  } finally {
    if (activePhrasesAbortController === controller) {
      if (thinking) thinking.style.display = "none";
      activePhrasesAbortController = null;
    }
  }
}

// --- Prediction Buttons Touch Handler & UI Rendering ---
export function attachPredictionButtonTouchHandler(btn, onTapAction) {
  let startX = 0;
  let startY = 0;
  let isDrag = false;
  let touchActive = false;

  btn.addEventListener("mousedown", (e) => {
    e.preventDefault(); // Prevent editor box blur on desktop
  });

  btn.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 0) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDrag = false;
      touchActive = true;
    }
  }, { passive: true });

  btn.addEventListener("touchmove", (e) => {
    if (touchActive && e.touches && e.touches.length > 0) {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > 6 || dy > 6) {
        isDrag = true; // User is swiping/dragging the row
      }
    }
  }, { passive: true });

  btn.addEventListener("touchend", (e) => {
    if (touchActive) {
      touchActive = false;
      if (!isDrag) {
        // Stationary tap! Trigger prediction insertion
        e.preventDefault();
        onTapAction();
      }
    }
  });

  btn.addEventListener("click", (e) => {
    if (!isDrag) {
      onTapAction();
    }
  });
}

export function renderWordPredictions(words, prefix, onSelectWord) {
  const container = document.getElementById("word-predictions");
  if (!container) return;
  container.innerHTML = "";

  words.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "predict-btn";

    // Highlight suffix text and gray out prefix
    if (prefix && word.startsWith(prefix)) {
      btn.innerHTML = `<span class="prefix">${prefix}</span>${word.substring(prefix.length)}`;
    } else {
      btn.textContent = word;
    }

    attachPredictionButtonTouchHandler(btn, () => {
      if (typeof onSelectWord === "function") {
        onSelectWord(word);
      }
    });

    container.appendChild(btn);
  });
}

export function renderPhrasePredictions(phrases, textBefore, textAfter, onSelectPhrase) {
  const container = document.getElementById("phrase-predictions");
  if (!container) return;
  container.innerHTML = "";

  phrases.forEach(phrase => {
    const btn = document.createElement("button");
    btn.className = "predict-btn";
    btn.textContent = phrase;

    attachPredictionButtonTouchHandler(btn, () => {
      if (typeof onSelectPhrase === "function") {
        onSelectPhrase(phrase, textBefore, textAfter);
      }
    });

    container.appendChild(btn);
  });
}
