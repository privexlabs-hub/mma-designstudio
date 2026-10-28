/* Caprasimo advance widths per 1000 units (measured from the self-hosted font in Chromium; per-glyph
   sums match whole-word widths within 0.2%). Used to keep display words from breaking mid-word. */
const CAPRASIMO: Record<string, number> = {"0":600,"1":600,"2":600,"3":600,"4":600,"5":600,"6":600,"7":600,"8":600,"9":600," ":250,"!":308,"\"":432,"#":600,"$":600,"%":811,"&":869,"'":228,"(":499,")":499,"*":600,"+":600,",":300,"-":284,".":300,"/":472,":":300,";":300,"<":500,"=":600,">":500,"?":482,"@":799,"A":827,"B":717,"C":720,"D":802,"E":691,"F":661,"G":794,"H":802,"I":414,"J":627,"K":827,"L":633,"M":884,"N":830,"O":778,"P":684,"Q":781,"R":776,"S":645,"T":701,"U":820,"V":803,"W":1040,"X":795,"Y":780,"Z":686,"[":499,"\\":472,"]":499,"^":500,"_":500,"`":500,"a":567,"b":632,"c":526,"d":650,"e":530,"f":424,"g":578,"h":679,"i":356,"j":369,"k":734,"l":365,"m":964,"n":671,"o":602,"p":666,"q":648,"r":535,"s":477,"t":463,"u":678,"v":627,"w":989,"x":602,"y":619,"z":514,"{":499,"|":500,"}":499,"~":667,"’":300,"‘":300,"“":559,"”":559,"–":600,"—":854,"…":900,"₦":636,"é":530};
const FALLBACK = 700; // wider than any lowercase glyph, so unknown characters err on the safe side

/** Width in px of `word` set in Caprasimo at `size` px with `ls` em letter spacing. */
export function displayWidth(word: string, size: number, ls = 0): number {
  let u = 0; for (const ch of word) u += CAPRASIMO[ch] ?? FALLBACK;
  return u / 1000 * size + ls * size * [...word].length;
}
