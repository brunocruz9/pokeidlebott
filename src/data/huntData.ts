export interface HuntLocation {
  slug: string;
  name: string;
  level: number;
  exp: number;
  type1: string;
  type2: string | null;
  area: string;
  looktype?: number;
  pixel?: [number, number];
}

// Tabela de Efetividade de Tipos Pokémon (Atacante -> Defensor)
// 2: Super Efetivo, 0.5: Pouco Efetivo, 0: Sem Efeito
export const TYPE_CHART: Record<string, Record<string, number>> = {
  NORMAL: { ROCK: 0.5, GHOST: 0, STEEL: 0.5 },
  FIRE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 2, BUG: 2, ROCK: 0.5, DRAGON: 0.5, STEEL: 2 },
  WATER: { FIRE: 2, WATER: 0.5, GRASS: 0.5, GROUND: 2, ROCK: 2, DRAGON: 0.5 },
  GRASS: { FIRE: 0.5, WATER: 2, GRASS: 0.5, POISON: 0.5, GROUND: 2, FLYING: 0.5, BUG: 0.5, ROCK: 2, DRAGON: 0.5, STEEL: 0.5 },
  ELECTRIC: { WATER: 2, ELECTRIC: 0.5, GRASS: 0.5, GROUND: 0, FLYING: 2, DRAGON: 0.5 },
  ICE: { FIRE: 0.5, WATER: 0.5, GRASS: 2, ICE: 0.5, GROUND: 2, FLYING: 2, DRAGON: 2, STEEL: 0.5 },
  FIGHTING: { NORMAL: 2, ICE: 2, POISON: 0.5, FLYING: 0.5, PSYCHIC: 0.5, BUG: 0.5, ROCK: 2, GHOST: 0, DARK: 2, STEEL: 2, FAIRY: 0.5 },
  POISON: { GRASS: 2, POISON: 0.5, GROUND: 0.5, ROCK: 0.5, GHOST: 0.5, STEEL: 0, FAIRY: 2 },
  GROUND: { FIRE: 2, ELECTRIC: 2, GRASS: 0.5, POISON: 2, FLYING: 0, BUG: 0.5, ROCK: 2, STEEL: 2 },
  FLYING: { ELECTRIC: 0.5, GRASS: 2, FIGHTING: 2, BUG: 2, ROCK: 0.5, STEEL: 0.5 },
  PSYCHIC: { FIGHTING: 2, POISON: 2, PSYCHIC: 0.5, DARK: 0, STEEL: 0.5 },
  BUG: { FIRE: 0.5, GRASS: 2, FIGHTING: 0.5, POISON: 0.5, FLYING: 0.5, PSYCHIC: 2, GHOST: 0.5, DARK: 2, STEEL: 0.5, FAIRY: 0.5 },
  ROCK: { FIRE: 2, ICE: 2, FIGHTING: 0.5, GROUND: 0.5, FLYING: 2, BUG: 2, STEEL: 0.5 },
  GHOST: { NORMAL: 0, PSYCHIC: 2, GHOST: 2, DARK: 0.5 },
  DRAGON: { DRAGON: 2, STEEL: 0.5, FAIRY: 0 },
  STEEL: { FIRE: 0.5, WATER: 0.5, ELECTRIC: 0.5, ICE: 2, ROCK: 2, STEEL: 0.5, FAIRY: 2 },
  DARK: { FIGHTING: 0.5, PSYCHIC: 2, GHOST: 2, DARK: 0.5, FAIRY: 0.5 },
  FAIRY: { FIRE: 0.5, FIGHTING: 2, POISON: 0.5, DRAGON: 2, DARK: 2, STEEL: 0.5 }
};

// Calcula o multiplicador de dano causado pelo atacante nos tipos do defensor
export function calculateEffectiveness(attackerType1: string, attackerType2: string | null, defenderType1: string, defenderType2: string | null): number {
  const getMultiplier = (atk: string, def1: string, def2: string | null) => {
    const chart = TYPE_CHART[atk.toUpperCase()] || {};
    const m1 = chart[def1.toUpperCase()] !== undefined ? chart[def1.toUpperCase()] : 1;
    const m2 = def2 && chart[def2.toUpperCase()] !== undefined ? chart[def2.toUpperCase()] : 1;
    return m1 * m2;
  };

  const mult1 = getMultiplier(attackerType1, defenderType1, defenderType2);
  const mult2 = attackerType2 ? getMultiplier(attackerType2, defenderType1, defenderType2) : 0;
  return Math.max(mult1, mult2);
}

// Base de Caça Completa compilada de map-markers.json e creatures.json
export const HUNT_LOCATIONS: HuntLocation[] = [
  // KANTO
  { slug: "caterpie", name: "Caterpie", level: 1, exp: 8, type1: "BUG", type2: null, area: "kanto", looktype: 32, pixel: [728, 690] },
  { slug: "weedle", name: "Weedle", level: 1, exp: 8, type1: "BUG", type2: "POISON", area: "kanto", looktype: 21, pixel: [476, 362] },
  { slug: "pidgey", name: "Pidgey", level: 1, exp: 8, type1: "NORMAL", type2: "FLYING", area: "kanto", looktype: 30, pixel: [689, 392] },
  { slug: "rattata", name: "Rattata", level: 1, exp: 8, type1: "NORMAL", type2: null, area: "kanto", looktype: 36, pixel: [599, 390] },
  { slug: "oddish", name: "Oddish", level: 1, exp: 8, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 56, pixel: [653, 426] },
  { slug: "paras", name: "Paras", level: 1, exp: 8, type1: "BUG", type2: "GRASS", area: "kanto", looktype: 81, pixel: [253, 439] },
  { slug: "bellsprout", name: "Bellsprout", level: 1, exp: 8, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 250, pixel: [577, 423] },
  { slug: "geodude", name: "Geodude", level: 1, exp: 8, type1: "ROCK", type2: "GROUND", area: "kanto", looktype: 196, pixel: [761, 409] },
  { slug: "poliwag", name: "Poliwag", level: 1, exp: 8, type1: "WATER", type2: null, area: "kanto", looktype: 111, pixel: [543, 905] },
  { slug: "metapod", name: "Metapod", level: 10, exp: 68, type1: "BUG", type2: null, area: "kanto", looktype: 31, pixel: [183, 520] },
  { slug: "kakuna", name: "Kakuna", level: 10, exp: 68, type1: "BUG", type2: "POISON", area: "kanto", looktype: 60, pixel: [432, 372] },
  { slug: "spearow", name: "Spearow", level: 10, exp: 68, type1: "NORMAL", type2: "FLYING", area: "kanto", looktype: 27, pixel: [141, 438] },
  { slug: "ekans", name: "Ekans", level: 10, exp: 68, type1: "POISON", type2: null, area: "kanto", looktype: 7, pixel: [507, 416] },
  { slug: "nidoranfe", name: "Nidoran Female", level: 10, exp: 68, type1: "POISON", type2: null, area: "kanto", looktype: 70, pixel: [116, 620] },
  { slug: "nidoranma", name: "Nidoran Male", level: 10, exp: 68, type1: "POISON", type2: null, area: "kanto", looktype: 66, pixel: [164, 571] },
  { slug: "zubat", name: "Zubat", level: 10, exp: 68, type1: "POISON", type2: "FLYING", area: "kanto", looktype: 44, pixel: [358, 382] },
  { slug: "diglett", name: "Diglett", level: 10, exp: 68, type1: "GROUND", type2: null, area: "kanto", looktype: 82, pixel: [671, 309] },
  { slug: "mankey", name: "Mankey", level: 10, exp: 68, type1: "FIGHTING", type2: null, area: "kanto", looktype: 106, pixel: [124, 683] },
  { slug: "abra", name: "Abra", level: 10, exp: 68, type1: "PSYCHIC", type2: null, area: "kanto", looktype: 262, pixel: [1176, 588] },
  { slug: "tentacool", name: "Tentacool", level: 10, exp: 68, type1: "WATER", type2: "POISON", area: "kanto", looktype: 96, pixel: [807, 607] },
  { slug: "slowpoke", name: "Slowpoke", level: 10, exp: 68, type1: "WATER", type2: "PSYCHIC", area: "kanto", looktype: 75, pixel: [560, 1879] },
  { slug: "magnemite", name: "Magnemite", level: 10, exp: 68, type1: "ELECTRIC", type2: "STEEL", area: "kanto", looktype: 217, pixel: [724, 456] },
  { slug: "doduo", name: "Doduo", level: 10, exp: 68, type1: "NORMAL", type2: "FLYING", area: "kanto", looktype: 26, pixel: [651, 776] },
  { slug: "grimer", name: "Grimer", level: 10, exp: 68, type1: "POISON", type2: null, area: "kanto", looktype: 214, pixel: [475, 437] },
  { slug: "shellder", name: "Shellder", level: 10, exp: 68, type1: "WATER", type2: null, area: "kanto", looktype: 54, pixel: [662, 931] },
  { slug: "krabby", name: "Krabby", level: 10, exp: 68, type1: "WATER", type2: null, area: "kanto", looktype: 112, pixel: [598, 1359] },
  { slug: "voltorb", name: "Voltorb", level: 10, exp: 68, type1: "ELECTRIC", type2: null, area: "kanto", looktype: 123, pixel: [893, 369] },
  { slug: "exeggcute", name: "Exeggcute", level: 10, exp: 68, type1: "GRASS", type2: "PSYCHIC", area: "kanto", looktype: 213, pixel: [1031, 589] },
  { slug: "koffing", name: "Koffing", level: 10, exp: 68, type1: "POISON", type2: null, area: "kanto", looktype: 228, pixel: [508, 377] },
  { slug: "horsea", name: "Horsea", level: 10, exp: 68, type1: "WATER", type2: null, area: "kanto", looktype: 33, pixel: [1030, 2887] },
  { slug: "goldeen", name: "Goldeen", level: 10, exp: 68, type1: "WATER", type2: null, area: "kanto", looktype: 274, pixel: [1050, 2822] },
  { slug: "bulbasaur", name: "Bulbasaur", level: 20, exp: 248, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 25, pixel: [365, 662] },
  { slug: "charmander", name: "Charmander", level: 20, exp: 248, type1: "FIRE", type2: null, area: "kanto", looktype: 29, pixel: [190, 884] },
  { slug: "squirtle", name: "Squirtle", level: 20, exp: 248, type1: "WATER", type2: null, area: "kanto", looktype: 2, pixel: [825, 229] },
  { slug: "pidgeotto", name: "Pidgeotto", level: 20, exp: 248, type1: "NORMAL", type2: "FLYING", area: "kanto", looktype: 5, pixel: [723, 392] },
  { slug: "sandshrew", name: "Sandshrew", level: 20, exp: 248, type1: "GROUND", type2: null, area: "kanto", looktype: 43, pixel: [699, 354] },
  { slug: "vulpix", name: "Vulpix", level: 20, exp: 248, type1: "FIRE", type2: null, area: "kanto", looktype: 62, pixel: [302, 924] },
  { slug: "venonat", name: "Venonat", level: 20, exp: 248, type1: "BUG", type2: "POISON", area: "kanto", looktype: 52, pixel: [794, 842] },
  { slug: "meowth", name: "Meowth", level: 20, exp: 248, type1: "NORMAL", type2: null, area: "kanto", looktype: 105, pixel: [129, 138] },
  { slug: "psyduck", name: "Psyduck", level: 20, exp: 248, type1: "WATER", type2: null, area: "kanto", looktype: 100, pixel: [882, 756] },
  { slug: "machop", name: "Machop", level: 20, exp: 248, type1: "FIGHTING", type2: null, area: "kanto", looktype: 118, pixel: [108, 549] },
  { slug: "ponyta", name: "Ponyta", level: 20, exp: 248, type1: "FIRE", type2: null, area: "kanto", looktype: 16, pixel: [163, 829] },
  { slug: "seel", name: "Seel", level: 20, exp: 248, type1: "WATER", type2: null, area: "kanto", looktype: 101, pixel: [536, 1068] },
  { slug: "gastly", name: "Gastly", level: 20, exp: 248, type1: "GHOST", type2: "POISON", area: "kanto", looktype: 48, pixel: [822, 532] },
  { slug: "cubone", name: "Cubone", level: 20, exp: 248, type1: "GROUND", type2: null, area: "kanto", looktype: 124, pixel: [732, 338] },
  { slug: "staryu", name: "Staryu", level: 20, exp: 248, type1: "WATER", type2: null, area: "kanto", looktype: 42, pixel: [943, 700] },
  { slug: "butterfree", name: "Butterfree", level: 30, exp: 548, type1: "BUG", type2: "FLYING", area: "kanto", looktype: 40, pixel: [402, 842] },
  { slug: "beedrill", name: "Beedrill", level: 30, exp: 548, type1: "BUG", type2: "POISON", area: "kanto", looktype: 3563, pixel: [446, 327] },
  { slug: "raticate", name: "Raticate", level: 30, exp: 548, type1: "NORMAL", type2: null, area: "kanto", looktype: 69, pixel: [571, 385] },
  { slug: "nidorina", name: "Nidorina", level: 30, exp: 548, type1: "POISON", type2: null, area: "kanto", looktype: 71, pixel: [134, 594] },
  { slug: "nidorino", name: "Nidorino", level: 30, exp: 548, type1: "POISON", type2: null, area: "kanto", looktype: 78, pixel: [191, 555] },
  { slug: "gloom", name: "Gloom", level: 30, exp: 548, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 74, pixel: [541, 437] },
  { slug: "primeape", name: "Primeape", level: 30, exp: 548, type1: "FIGHTING", type2: null, area: "kanto", looktype: 103, pixel: [144, 653] },
  { slug: "growlithe", name: "Growlithe", level: 30, exp: 548, type1: "FIRE", type2: null, area: "kanto", looktype: 109, pixel: [282, 882] },
  { slug: "poliwhirl", name: "Poliwhirl", level: 30, exp: 548, type1: "WATER", type2: null, area: "kanto", looktype: 212, pixel: [430, 949] },
  { slug: "weepinbell", name: "Weepinbell", level: 30, exp: 548, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 37, pixel: [520, 596] },
  { slug: "drowzee", name: "Drowzee", level: 30, exp: 548, type1: "PSYCHIC", type2: null, area: "kanto", looktype: 94, pixel: [1135, 613] },
  { slug: "rhyhorn", name: "Rhyhorn", level: 30, exp: 548, type1: "GROUND", type2: "ROCK", area: "kanto", looktype: 77, pixel: [811, 417] },
  { slug: "dratini", name: "Dratini", level: 30, exp: 548, type1: "DRAGON", type2: null, area: "kanto", looktype: 58, pixel: [515, 954] },
  { slug: "ivysaur", name: "Ivysaur", level: 40, exp: 968, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 24, pixel: [337, 693] },
  { slug: "charmeleon", name: "Charmeleon", level: 40, exp: 968, type1: "FIRE", type2: null, area: "kanto", looktype: 23, pixel: [207, 922] },
  { slug: "wartortle", name: "Wartortle", level: 40, exp: 968, type1: "WATER", type2: null, area: "kanto", looktype: 6, pixel: [860, 179] },
  { slug: "arbok", name: "Arbok", level: 40, exp: 968, type1: "POISON", type2: null, area: "kanto", looktype: 39, pixel: [439, 435] },
  { slug: "clefairy", name: "Clefairy", level: 40, exp: 968, type1: "FAIRY", type2: null, area: "kanto", looktype: 73, pixel: [299, 366] },
  { slug: "jigglypuff", name: "Jigglypuff", level: 40, exp: 968, type1: "NORMAL", type2: "FAIRY", area: "kanto", looktype: 203, pixel: [731, 1411] },
  { slug: "golbat", name: "Golbat", level: 40, exp: 968, type1: "POISON", type2: "FLYING", area: "kanto", looktype: 122, pixel: [335, 344] },
  { slug: "dugtrio", name: "Dugtrio", level: 40, exp: 968, type1: "GROUND", type2: null, area: "kanto", looktype: 83, pixel: [661, 348] },
  { slug: "machoke", name: "Machoke", level: 40, exp: 968, type1: "FIGHTING", type2: null, area: "kanto", looktype: 113, pixel: [81, 508] },
  { slug: "graveler", name: "Graveler", level: 40, exp: 968, type1: "ROCK", type2: "GROUND", area: "kanto", looktype: 247, pixel: [767, 367] },
  { slug: "electrode", name: "Electrode", level: 40, exp: 968, type1: "ELECTRIC", type2: null, area: "kanto", looktype: 125, pixel: [851, 407] },
  { slug: "fearow", name: "Fearow", level: 50, exp: 1508, type1: "NORMAL", type2: "FLYING", area: "kanto", looktype: 17, pixel: [135, 376] },
  { slug: "parasect", name: "Parasect", level: 50, exp: 1508, type1: "BUG", type2: "GRASS", area: "kanto", looktype: 95, pixel: [266, 406] },
  { slug: "persian", name: "Persian", level: 50, exp: 1508, type1: "NORMAL", type2: null, area: "kanto", looktype: 3, pixel: [159, 86] },
  { slug: "kadabra", name: "Kadabra", level: 50, exp: 1508, type1: "PSYCHIC", type2: null, area: "kanto", looktype: 219, pixel: [1099, 639] },
  { slug: "haunter", name: "Haunter", level: 50, exp: 1508, type1: "GHOST", type2: "POISON", area: "kanto", looktype: 65, pixel: [822, 490] },
  { slug: "marowak", name: "Marowak", level: 50, exp: 1508, type1: "GROUND", type2: null, area: "kanto", looktype: 197, pixel: [703, 294] },
  { slug: "tangela", name: "Tangela", level: 50, exp: 1508, type1: "GRASS", type2: null, area: "kanto", looktype: 18, pixel: [646, 387] },
  { slug: "seadra", name: "Seadra", level: 50, exp: 1508, type1: "WATER", type2: null, area: "kanto", looktype: 276, pixel: [1081, 2905] },
  { slug: "seaking", name: "Seaking", level: 50, exp: 1508, type1: "WATER", type2: null, area: "kanto", looktype: 272, pixel: [1098, 2837] },
  { slug: "pikachu", name: "Pikachu", level: 60, exp: 2168, type1: "ELECTRIC", type2: null, area: "kanto", looktype: 59, pixel: [1088, 202] },
  { slug: "sandslash", name: "Sandslash", level: 60, exp: 2168, type1: "GROUND", type2: null, area: "kanto", looktype: 115, pixel: [742, 295] },
  { slug: "vileplume", name: "Vileplume", level: 60, exp: 2168, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 89, pixel: [453, 647] },
  { slug: "venomoth", name: "Venomoth", level: 60, exp: 2168, type1: "BUG", type2: "POISON", area: "kanto", looktype: 49, pixel: [760, 859] },
  { slug: "golduck", name: "Golduck", level: 80, exp: 3848, type1: "WATER", type2: null, area: "kanto", looktype: 99, pixel: [880, 688] },
  { slug: "victreebel", name: "Victreebel", level: 60, exp: 2168, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 240, pixel: [354, 215] },
  { slug: "slowbro", name: "Slowbro", level: 60, exp: 2168, type1: "WATER", type2: "PSYCHIC", area: "kanto", looktype: 41, pixel: [620, 1878] },
  { slug: "dewgong", name: "Dewgong", level: 60, exp: 2168, type1: "WATER", type2: "ICE", area: "kanto", looktype: 110, pixel: [498, 1006] },
  { slug: "cloyster", name: "Cloyster", level: 60, exp: 2168, type1: "WATER", type2: "ICE", area: "kanto", looktype: 72, pixel: [592, 998] },
  { slug: "hypno", name: "Hypno", level: 60, exp: 2168, type1: "PSYCHIC", type2: null, area: "kanto", looktype: 119, pixel: [1142, 546] },
  { slug: "kingler", name: "Kingler", level: 60, exp: 2168, type1: "WATER", type2: null, area: "kanto", looktype: 245, pixel: [1150, 2713] },
  { slug: "hitmonlee", name: "Hitmonlee", level: 60, exp: 2168, type1: "FIGHTING", type2: null, area: "kanto", looktype: 20, pixel: [463, 1840] },
  { slug: "hitmonchan", name: "Hitmonchan", level: 60, exp: 2168, type1: "FIGHTING", type2: null, area: "kanto", looktype: 38, pixel: [518, 1839] },
  { slug: "weezing", name: "Weezing", level: 60, exp: 2168, type1: "POISON", type2: null, area: "kanto", looktype: 231, pixel: [460, 399] },
  { slug: "tauros", name: "Tauros", level: 60, exp: 2168, type1: "NORMAL", type2: null, area: "kanto", looktype: 93, pixel: [685, 757] },
  { slug: "venusaur", name: "Venusaur", level: 80, exp: 3848, type1: "GRASS", type2: "POISON", area: "kanto", looktype: 22, pixel: [412, 683] },
  { slug: "charizard", name: "Charizard", level: 80, exp: 3848, type1: "FIRE", type2: "FLYING", area: "kanto", looktype: 67, pixel: [61, 43] },
  { slug: "blastoise", name: "Blastoise", level: 80, exp: 3848, type1: "WATER", type2: null, area: "kanto", looktype: 55, pixel: [836, 108] },
  { slug: "pidgeot", name: "Pidgeot", level: 80, exp: 3848, type1: "NORMAL", type2: "FLYING", area: "kanto", looktype: 80, pixel: [664, 170] },
  { slug: "raichu", name: "Raichu", level: 80, exp: 3848, type1: "ELECTRIC", type2: null, area: "kanto", looktype: 50, pixel: [1166, 148] },
  { slug: "nidoqueen", name: "Nidoqueen", level: 80, exp: 3848, type1: "POISON", type2: "GROUND", area: "kanto", looktype: 79, pixel: [604, 758] },
  { slug: "nidoking", name: "Nidoking", level: 80, exp: 3848, type1: "POISON", type2: "GROUND", area: "kanto", looktype: 35, pixel: [605, 798] },
  { slug: "clefable", name: "Clefable", level: 80, exp: 3848, type1: "FAIRY", type2: null, area: "kanto", looktype: 68, pixel: [382, 353] },
  { slug: "wigglytuff", name: "Wigglytuff", level: 80, exp: 3848, type1: "NORMAL", type2: "FAIRY", area: "kanto", looktype: 64, pixel: [728, 1455] },
  { slug: "poliwrath", name: "Poliwrath", level: 80, exp: 3848, type1: "WATER", type2: "FIGHTING", area: "kanto", looktype: 104, pixel: [466, 960] },
  { slug: "machamp", name: "Machamp", level: 80, exp: 3848, type1: "FIGHTING", type2: null, area: "kanto", looktype: 121, pixel: [800, 340] },
  { slug: "tentacruel", name: "Tentacruel", level: 80, exp: 3848, type1: "WATER", type2: "POISON", area: "kanto", looktype: 108, pixel: [786, 644] },
  { slug: "golem", name: "Golem", level: 80, exp: 3848, type1: "ROCK", type2: "GROUND", area: "kanto", looktype: 116, pixel: [789, 452] },
  { slug: "rapidash", name: "Rapidash", level: 80, exp: 3848, type1: "FIRE", type2: null, area: "kanto", looktype: 2116, pixel: [225, 852] },
  { slug: "magneton", name: "Magneton", level: 80, exp: 3848, type1: "ELECTRIC", type2: "STEEL", area: "kanto", looktype: 223, pixel: [853, 368] },
  { slug: "muk", name: "Muk", level: 80, exp: 3848, type1: "POISON", type2: null, area: "kanto", looktype: 47, pixel: [405, 417] },
  { slug: "rhydon", name: "Rhydon", level: 80, exp: 3848, type1: "GROUND", type2: "ROCK", area: "kanto", looktype: 200, pixel: [811, 376] },
  { slug: "kangaskhan", name: "Kangaskhan", level: 80, exp: 3848, type1: "NORMAL", type2: null, area: "kanto", looktype: 198, pixel: [559, 781] },
  { slug: "starmie", name: "Starmie", level: 80, exp: 3848, type1: "WATER", type2: "PSYCHIC", area: "kanto", looktype: 249, pixel: [942, 772] },
  { slug: "mr_mime", name: "Mr. Mime", level: 80, exp: 3848, type1: "PSYCHIC", type2: "FAIRY", area: "kanto", looktype: 246, pixel: [561, 839] },
  { slug: "omastar", name: "Omastar", level: 80, exp: 3848, type1: "ROCK", type2: "WATER", area: "kanto", looktype: 192, pixel: [1299, 970] },
  { slug: "kabutops", name: "Kabutops", level: 80, exp: 3848, type1: "ROCK", type2: "WATER", area: "kanto", looktype: 164, pixel: [1249, 917] },
  { slug: "dragonair", name: "Dragonair", level: 80, exp: 3848, type1: "DRAGON", type2: null, area: "kanto", looktype: 61, pixel: [553, 954] },
  { slug: "ninetales", name: "Ninetales", level: 100, exp: 6008, type1: "FIRE", type2: null, area: "kanto", looktype: 114, pixel: [236, 896] },
  { slug: "arcanine", name: "Arcanine", level: 100, exp: 6008, type1: "FIRE", type2: null, area: "kanto", looktype: 91, pixel: [265, 844] },
  { slug: "alakazam", name: "Alakazam", level: 100, exp: 6008, type1: "PSYCHIC", type2: null, area: "kanto", looktype: 218, pixel: [1088, 531] },
  { slug: "gengar", name: "Gengar", level: 100, exp: 6008, type1: "GHOST", type2: "POISON", area: "kanto", looktype: 244, pixel: [190, 314] },
  { slug: "exeggutor", name: "Exeggutor", level: 100, exp: 6008, type1: "GRASS", type2: "PSYCHIC", area: "kanto", looktype: 46, pixel: [1031, 662] },
  { slug: "scyther", name: "Scyther", level: 100, exp: 6008, type1: "BUG", type2: "FLYING", area: "kanto", looktype: 15, pixel: [525, 811] },
  { slug: "jynx", name: "Jynx", level: 100, exp: 6008, type1: "ICE", type2: "PSYCHIC", area: "kanto", looktype: 282, pixel: [476, 1051] },
  { slug: "electabuzz", name: "Electabuzz", level: 100, exp: 6008, type1: "ELECTRIC", type2: null, area: "kanto", looktype: 281, pixel: [892, 407] },
  { slug: "magmar", name: "Magmar", level: 100, exp: 6008, type1: "FIRE", type2: null, area: "kanto", looktype: 76, pixel: [256, 939] },
  { slug: "pinsir", name: "Pinsir", level: 100, exp: 6008, type1: "BUG", type2: null, area: "kanto", looktype: 53, pixel: [265, 513] },
  { slug: "gyarados", name: "Gyarados", level: 100, exp: 6008, type1: "WATER", type2: "FLYING", area: "kanto", looktype: 117, pixel: [829, 643] },
  { slug: "lapras", name: "Lapras", level: 100, exp: 6008, type1: "WATER", type2: "ICE", area: "kanto", looktype: 193, pixel: [593, 956] },
  { slug: "aerodactyl", name: "Aerodactyl", level: 100, exp: 6008, type1: "ROCK", type2: "FLYING", area: "kanto", looktype: 10, pixel: [1035, 338] },
  { slug: "snorlax", name: "Snorlax", level: 100, exp: 6008, type1: "NORMAL", type2: null, area: "kanto", looktype: 51, pixel: [619, 2946] },
  { slug: "dragonite", name: "Dragonite", level: 100, exp: 6008, type1: "DRAGON", type2: "FLYING", area: "kanto", looktype: 211, pixel: [547, 1003] },

  // OUTLAND (Lv. 150)
  { slug: "brave_blastoise", name: "Brave Blastoise", level: 150, exp: 13508, type1: "WATER", type2: null, area: "outland", looktype: 55, pixel: [175, 93] },
  { slug: "tribal_feraligatr", name: "Tribal Feraligatr", level: 150, exp: 13508, type1: "WATER", type2: null, area: "outland", looktype: 329, pixel: [137, 54] },
  { slug: "ancient_meganium", name: "Ancient Meganium", level: 150, exp: 13508, type1: "GRASS", type2: null, area: "outland", looktype: 320, pixel: [211, 142] },
  { slug: "brave_venusaur", name: "Brave Venusaur", level: 150, exp: 13508, type1: "GRASS", type2: "POISON", area: "outland", looktype: 22, pixel: [272, 143] },
  { slug: "war_heracross", name: "War Heracross", level: 150, exp: 13508, type1: "BUG", type2: "FIGHTING", area: "outland", looktype: 373, pixel: [228, 233] },
  { slug: "furious_scyther", name: "Furious Scyther", level: 150, exp: 13508, type1: "BUG", type2: "FLYING", area: "outland", looktype: 15, pixel: [161, 256] },
  { slug: "enigmatic_girafarig", name: "Enigmatic Girafarig", level: 150, exp: 13508, type1: "NORMAL", type2: "PSYCHIC", area: "outland", looktype: 362, pixel: [121, 154] },
  { slug: "charged_raichu", name: "Charged Raichu", level: 150, exp: 13508, type1: "ELECTRIC", type2: null, area: "outland", looktype: 50, pixel: [129, 112] },
  { slug: "furious_ampharos", name: "Furious Ampharos", level: 150, exp: 13508, type1: "ELECTRIC", type2: null, area: "outland", looktype: 361, pixel: [143, 128] },
  { slug: "magnetic_electabuzz", name: "Magnetic Electabuzz", level: 150, exp: 13508, type1: "ELECTRIC", type2: null, area: "outland", looktype: 281, pixel: [158, 112] },
  { slug: "ancient_dragonair", name: "Ancient Dragonair", level: 150, exp: 13508, type1: "DRAGON", type2: null, area: "outland", looktype: 61, pixel: [201, 463] },
  { slug: "evil_cloyster", name: "Evil Cloyster", level: 150, exp: 13508, type1: "WATER", type2: "ICE", area: "outland", looktype: 72, pixel: [144, 521] },
  { slug: "freezing_dewgong", name: "Freezing Dewgong", level: 150, exp: 13508, type1: "WATER", type2: "ICE", area: "outland", looktype: 110, pixel: [155, 458] },
  { slug: "psy_jynx", name: "Psy Jynx", level: 150, exp: 13508, type1: "ICE", type2: "PSYCHIC", area: "outland", looktype: 282, pixel: [54, 497] },
  { slug: "heavy_piloswine", name: "Heavy Piloswine", level: 150, exp: 13508, type1: "ICE", type2: "GROUND", area: "outland", looktype: 390, pixel: [94, 455] },
  { slug: "milch_miltank", name: "Milch-Miltank", level: 150, exp: 13508, type1: "NORMAL", type2: null, area: "outland", looktype: 408, pixel: [217, 401] },
  { slug: "roll_donphan", name: "Roll Donphan", level: 150, exp: 13508, type1: "GROUND", type2: null, area: "outland", looktype: 405, pixel: [121, 316] },
  { slug: "furious_sandslash", name: "Furious Sandslash", level: 150, exp: 13508, type1: "GROUND", type2: null, area: "outland", looktype: 115, pixel: [143, 401] },
  { slug: "hard_golem", name: "Hard Golem", level: 150, exp: 13508, type1: "ROCK", type2: "GROUND", area: "outland", looktype: 116, pixel: [353, 349] },
  { slug: "brute_rhydon", name: "Brute Rhydon", level: 150, exp: 13508, type1: "GROUND", type2: "ROCK", area: "outland", looktype: 200, pixel: [407, 352] },
  { slug: "brave_charizard", name: "Brave Charizard", level: 150, exp: 13508, type1: "FIRE", type2: "FLYING", area: "outland", looktype: 67, pixel: [237, 326] },
  { slug: "enraged_typhlosion", name: "Enraged Typhlosion", level: 150, exp: 13508, type1: "FIRE", type2: null, area: "outland", looktype: 323, pixel: [177, 350] },
  { slug: "brave_nidoking", name: "Brave Nidoking", level: 150, exp: 13508, type1: "POISON", type2: "GROUND", area: "outland", looktype: 35, pixel: [399, 209] },
  { slug: "brave_nidoqueen", name: "Brave Nidoqueen", level: 150, exp: 13508, type1: "POISON", type2: "GROUND", area: "outland", looktype: 79, pixel: [371, 181] },
  { slug: "dark_crobat", name: "Dark Crobat", level: 150, exp: 13508, type1: "POISON", type2: "FLYING", area: "outland", looktype: 338, pixel: [273, 468] },
  { slug: "trickmaster_gengar", name: "Trickmaster Gengar", level: 150, exp: 13508, type1: "GHOST", type2: "POISON", area: "outland", looktype: 244, pixel: [368, 235] },
  { slug: "banshee_misdreavus", name: "Banshee Misdreavus", level: 150, exp: 13508, type1: "GHOST", type2: null, area: "outland", looktype: 366, pixel: [346, 222] },

  // ORRE (Lv. 520 - 600)
  { slug: "treecko", name: "Treecko", level: 520, exp: 13050, type1: "GRASS", type2: null, area: "orre", looktype: 1850, pixel: [125, 421] },
  { slug: "torchic", name: "Torchic", level: 520, exp: 12140, type1: "FIRE", type2: null, area: "orre", looktype: 1856, pixel: [342, 376] },
  { slug: "mudkip", name: "Mudkip", level: 520, exp: 13180, type1: "WATER", type2: null, area: "orre", looktype: 1853, pixel: [475, 305] },
  { slug: "grovyle", name: "Grovyle", level: 540, exp: 23480, type1: "GRASS", type2: null, area: "orre", looktype: 1851, pixel: [147, 400] },
  { slug: "combusken", name: "Combusken", level: 540, exp: 22160, type1: "FIRE", type2: "FIGHTING", area: "orre", looktype: 1857, pixel: [341, 408] },
  { slug: "marshtomp", name: "Marshtomp", level: 540, exp: 23330, type1: "WATER", type2: "GROUND", area: "orre", looktype: 1854, pixel: [425, 315] },
  { slug: "sceptile", name: "Sceptile", level: 580, exp: 51100, type1: "GRASS", type2: null, area: "orre", looktype: 1852, pixel: [110, 366] },
  { slug: "blaziken", name: "Blaziken", level: 580, exp: 45060, type1: "FIRE", type2: "FIGHTING", area: "orre", looktype: 1858, pixel: [397, 397] },
  { slug: "swampert", name: "Swampert", level: 580, exp: 50130, type1: "WATER", type2: "GROUND", area: "orre", looktype: 1855, pixel: [484, 392] },
  { slug: "ralts", name: "Ralts", level: 530, exp: 17910, type1: "PSYCHIC", type2: "FAIRY", area: "orre", looktype: 1848, pixel: [341, 132] },
  { slug: "kirlia", name: "Kirlia", level: 560, exp: 32280, type1: "PSYCHIC", type2: "FAIRY", area: "orre", looktype: 1847, pixel: [370, 124] },
  { slug: "gardevoir", name: "Gardevoir", level: 600, exp: 55000, type1: "PSYCHIC", type2: "FAIRY", area: "orre", looktype: 1849, pixel: [402, 129] },
  { slug: "bagon", name: "Bagon", level: 540, exp: 24630, type1: "DRAGON", type2: null, area: "orre", looktype: 1866, pixel: [134, 232] },
  { slug: "shelgon", name: "Shelgon", level: 560, exp: 34830, type1: "DRAGON", type2: null, area: "orre", looktype: 1867, pixel: [104, 231] },
  { slug: "lucario", name: "Lucario", level: 580, exp: 45250, type1: "FIGHTING", type2: "STEEL", area: "orre", looktype: 1949, pixel: [64, 219] },

  // NIGHTMARE (Lv. 2000 - 3000)
  { slug: "nightmare_beedrill", name: "Nightmare Beedrill", level: 2000, exp: 125000, type1: "BUG", type2: "POISON", area: "nightmare", looktype: 3563, pixel: [571, 331] },
  { slug: "nightmare_grimer", name: "Nightmare Grimer", level: 2000, exp: 120000, type1: "POISON", type2: null, area: "nightmare", looktype: 214, pixel: [302, 818] },
  { slug: "nightmare_cloyster", name: "Nightmare Cloyster", level: 2000, exp: 140000, type1: "WATER", type2: "ICE", area: "nightmare", looktype: 72, pixel: [1082, 227] },
  { slug: "nightmare_snorunt", name: "Nightmare Snorunt", level: 2000, exp: 130000, type1: "ICE", type2: null, area: "nightmare", looktype: 1877, pixel: [1037, 284] },
  { slug: "nightmare_garchomp", name: "Nightmare Garchomp", level: 3000, exp: 280000, type1: "DRAGON", type2: "GROUND", area: "nightmare", looktype: 3517, pixel: [944, 352] },
  { slug: "nightmare_dragonite", name: "Nightmare Dragonite", level: 3000, exp: 280000, type1: "DRAGON", type2: "FLYING", area: "nightmare", looktype: 211, pixel: [880, 353] },
  { slug: "nightmare_alakazam", name: "Nightmare Alakazam", level: 3000, exp: 290000, type1: "PSYCHIC", type2: null, area: "nightmare", looktype: 218, pixel: [846, 201] },
  { slug: "nightmare_gardevoir", name: "Nightmare Gardevoir", level: 3000, exp: 290000, type1: "PSYCHIC", type2: "FAIRY", area: "nightmare", looktype: 1849, pixel: [678, 880] },
  { slug: "nightmare_infernape", name: "Nightmare Infernape", level: 3000, exp: 275000, type1: "FIRE", type2: "FIGHTING", area: "nightmare", looktype: 2960, pixel: [772, 543] },
  { slug: "nightmare_scizor", name: "Nightmare Scizor", level: 3000, exp: 295000, type1: "BUG", type2: "STEEL", area: "nightmare", looktype: 370, pixel: [798, 394] },
  { slug: "nightmare_tyranitar", name: "Nightmare Tyranitar", level: 3000, exp: 300000, type1: "ROCK", type2: "DARK", area: "nightmare", looktype: 416, pixel: [824, -158] }
];

// Otimizador de rotas: encontra a caça mais eficiente para um dado Pokémon e nível
export function findBestHunt(pokemonType1: string, pokemonType2: string | null, level: number): { hunt: HuntLocation; multiplier: number } {
  const available = HUNT_LOCATIONS.filter(h => h.level <= level);
  if (available.length === 0) {
    return {
      hunt: HUNT_LOCATIONS[0],
      multiplier: calculateEffectiveness(pokemonType1, pokemonType2, HUNT_LOCATIONS[0].type1, HUNT_LOCATIONS[0].type2)
    };
  }

  let best = available[0];
  let maxScore = -1;

  for (const hunt of available) {
    const eff = calculateEffectiveness(pokemonType1, pokemonType2, hunt.type1, hunt.type2);
    // Pontuação balanceada: EXP base ponderada pelo multiplicador elemental e proximidade do nível
    // Caças super efetivas aumentam a velocidade de kill (EXP/hora real)
    const levelDiff = Math.max(1, level - hunt.level);
    const penalty = levelDiff > 60 ? Math.max(0.2, 1 - (levelDiff - 60) * 0.01) : 1;
    const score = hunt.exp * eff * penalty;

    if (score > maxScore) {
      maxScore = score;
      best = hunt;
    }
  }

  return {
    hunt: best,
    multiplier: calculateEffectiveness(pokemonType1, pokemonType2, best.type1, best.type2)
  };
}
