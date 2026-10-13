// words.js — word lists, grouped by category and then by difficulty.
// Word lengths must match the difficulty table in SPEC.md:
//   easy 3–5 letters, medium 6–8 letters, hard 9+ letters.
// Words are lowercase letters only (no spaces, hyphens, or digits).
// Every word also needs a fun clue in CLUES below.

const WORDS = {
  Animals: {
    easy: ["cat", "dog", "horse", "sheep", "mouse", "tiger", "zebra", "camel", "goat", "owl", "bear", "lion", "whale"],
    medium: ["rabbit", "donkey", "monkey", "giraffe", "penguin", "dolphin", "buffalo", "hamster", "leopard", "gorilla"],
    hard: ["crocodile", "alligator", "butterfly", "chameleon", "porcupine", "armadillo", "rhinoceros", "hippopotamus", "salamander"],
  },
  Countries: {
    easy: ["peru", "chad", "cuba", "mali", "oman", "chile", "china", "egypt", "india", "japan", "kenya", "nepal", "spain", "italy"],
    medium: ["brazil", "canada", "france", "mexico", "norway", "sweden", "poland", "greece", "germany", "ireland", "morocco", "vietnam", "denmark", "finland"],
    hard: ["australia", "argentina", "indonesia", "singapore", "venezuela", "madagascar", "switzerland", "netherlands", "philippines", "mozambique"],
  },
  Foods: {
    easy: ["bread", "pizza", "pasta", "apple", "rice", "soup", "taco", "cake", "salad", "honey", "mango", "lemon"],
    medium: ["banana", "cheese", "noodle", "carrot", "cookie", "burger", "waffle", "pancake", "avocado", "popcorn", "sausage", "omelette"],
    hard: ["spaghetti", "chocolate", "pineapple", "blueberry", "watermelon", "strawberry", "cauliflower", "hamburger", "raspberry"],
  },
};

// A fun clue for every word. Clues hint at the word without saying it
// (tests/words.test.js checks that no clue gives its own word away).
const CLUES = {
  // Animals
  cat: "Knocks your stuff off the table, then naps like nothing happened.",
  dog: "Greets you at the door like you've been gone for ten years.",
  horse: "Sleeps standing up and wears shoes made of metal.",
  sheep: "Its haircut becomes your sweater.",
  mouse: "Small, squeaky, and suspiciously fond of cheese in cartoons.",
  tiger: "A giant cat in striped pajamas — no two stripe patterns match.",
  zebra: "Is it black with white stripes, or white with black stripes?",
  camel: "Carries its own snack pack on its back (it's fat, not water!).",
  goat: "Will climb a cliff — or eat your homework.",
  owl: "Turns its head almost all the way around. Who? Who?",
  bear: "Eats all autumn, then sleeps all winter.",
  lion: "Wears a big fluffy mane and calls itself king.",
  whale: "The biggest animal ever, and it sings underwater.",
  rabbit: "Hops, thumps its foot, and pops out of magicians' hats.",
  donkey: "Says 'hee-haw' and is famous for being stubborn.",
  monkey: "Swings through trees and is always up to funny business.",
  giraffe: "Has the same number of neck bones as you — just much longer ones.",
  penguin: "A bird in a tuxedo that swims instead of flying.",
  dolphin: "A clever sea mammal that chats in clicks and whistles.",
  buffalo: "A huge, shaggy, horned grazer that roams the plains in herds.",
  hamster: "Stuffs its cheeks like a backpack and runs on a wheel all night.",
  leopard: "A spotted big cat that drags its dinner up a tree.",
  gorilla: "The largest ape: beats its chest, but mostly eats leaves.",
  crocodile: "Long pointy snout, toothy grin, and fake tears.",
  alligator: "Rounded snout, Florida swamps — 'see you later' rhymes with it.",
  butterfly: "Starts life as a caterpillar, ends up with wings.",
  chameleon: "Changes color and moves each eye on its own.",
  porcupine: "Please don't hug it — it's covered in quills.",
  armadillo: "Wears its own armor and can roll into a ball.",
  rhinoceros: "A big gray tank with a horn on its nose.",
  hippopotamus: "Its name means 'river horse', but it can't actually swim.",
  salamander: "Looks like a lizard, has slimy skin, and can regrow its tail.",

  // Countries
  peru: "Home of Machu Picchu and lots of llamas.",
  chad: "An African country that shares its name with a lake... and a guy you know.",
  cuba: "A Caribbean island famous for vintage cars and salsa music.",
  mali: "Its city Timbuktu was a legendary center of learning.",
  oman: "A sultanate on the Arabian Sea with deserts and frankincense trees.",
  chile: "The skinniest country on the map — and it sounds spicy.",
  china: "The Great Wall and giant pandas. Also a word for fancy plates.",
  egypt: "Pyramids, pharaohs, and the River Nile.",
  india: "The Taj Mahal lives here, and so does Bollywood.",
  japan: "Land of the rising sun, sushi, and bullet trains.",
  kenya: "Safari country famous for its marathon runners.",
  nepal: "Mount Everest's home, with the only flag that isn't a rectangle.",
  spain: "Flamenco, paella, and an afternoon nap called a siesta.",
  italy: "Shaped like a boot, and the birthplace of pizza.",
  brazil: "Biggest country in South America: samba, soccer, and the Amazon.",
  canada: "Maple syrup, moose, and saying sorry a lot.",
  france: "The Eiffel Tower and very fancy bread.",
  mexico: "Tacos, mariachi bands, and the Day of the Dead.",
  norway: "Fjords, northern lights, and real Vikings.",
  sweden: "Flat-pack furniture and the band ABBA.",
  poland: "Its capital is Warsaw, and it gave the world pierogi.",
  greece: "Where the Olympics began and the gods lived on a mountain.",
  germany: "Pretzels, fairy-tale castles, and the Brothers Grimm.",
  ireland: "The Emerald Isle — keep an eye out for leprechauns.",
  morocco: "Colorful markets in Marrakech at the edge of the Sahara.",
  vietnam: "Pho noodle soup and Ha Long Bay's limestone islands.",
  denmark: "The birthplace of LEGO bricks.",
  finland: "The land of a thousand lakes (it actually has about 188,000).",
  australia: "Kangaroos, koalas, and a country that's also a continent.",
  argentina: "Tango dancing and Lionel Messi's home country.",
  indonesia: "Made of over 17,000 islands, including Bali.",
  singapore: "A city that's also a country, guarded by a lion-fish statue.",
  venezuela: "Home of Angel Falls, the tallest waterfall in the world.",
  madagascar: "The island where lemurs live — also an animated movie.",
  switzerland: "Chocolate, cheese with holes, and very precise clocks.",
  netherlands: "Windmills, tulips, and more bikes than people.",
  philippines: "Over 7,000 islands and colorful jeepney buses.",
  mozambique: "A long Indian Ocean coastline in southeast Africa; Portuguese is spoken here.",

  // Foods
  bread: "Sliced, toasted, buttered — the best thing since... itself.",
  pizza: "Round, comes in a square box, eaten in triangles.",
  pasta: "Comes shaped like bowties, tubes, and shells.",
  apple: "Eat one a day to keep the doctor away.",
  rice: "Tiny grains eaten by billions of people every day.",
  soup: "Dinner you eat with a spoon, perfect when you're sick.",
  taco: "A crunchy folded shell — Tuesday is its favorite day.",
  cake: "Wears candles on top once a year.",
  salad: "A bowl of leaves pretending to be a meal.",
  honey: "Made by bees, and it never goes bad.",
  mango: "A juicy tropical fruit with one big flat seed.",
  lemon: "Sour and yellow. When life gives you these...",
  banana: "Yellow, curved, and great for slipping on in cartoons.",
  cheese: "Say this when someone takes your photo.",
  noodle: "Long and slurpy — also slang for your brain.",
  carrot: "Bunnies love it; snowmen wear it as a nose.",
  cookie: "Monster-approved, and best dunked in milk.",
  burger: "A patty in a bun, maybe with a slice of cheese on top.",
  waffle: "Breakfast with little squares for holding syrup.",
  pancake: "Flat, flipped, and stacked high with syrup.",
  avocado: "Green, creamy, and smashed onto toast.",
  popcorn: "Explodes in the microwave; tastes best at the movies.",
  sausage: "A meaty tube that sizzles at barbecues.",
  omelette: "Folded eggs — you have to break a few to make one.",
  spaghetti: "Long noodles that go perfectly with meatballs.",
  chocolate: "Made from cocoa beans, and it melts in your hand.",
  pineapple: "Spiky outside, sweet inside. Does it belong on pizza?",
  blueberry: "A tiny round fruit that stains your tongue purple.",
  watermelon: "Green outside, red inside, full of seeds to spit.",
  strawberry: "The only fruit that wears its seeds on the outside.",
  cauliflower: "Looks like a white brain; can pretend to be rice or pizza crust.",
  hamburger: "Named after a German city, but famous in America.",
  raspberry: "A red berry — and the rude noise you blow with your tongue.",
};

// This one file works in two places:
// - In the browser, a <script> tag makes WORDS a global variable.
// - In Node (our tests), `module` exists, so we export it with require().
if (typeof module !== "undefined") {
  module.exports = { WORDS, CLUES };
}
